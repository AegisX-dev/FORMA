import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { generateWorkoutPrompt } from "@/lib/gemini";

// API Key Pool for rotation and failover
interface ApiConfig {
  key: string | undefined;
  model: string;
  name: string;
}

interface ExerciseFromAI {
  id: number;
  sets: number;
  reps: string;
  note: string;
}

interface WorkoutDayFromAI {
  day_name: string;
  exercises: ExerciseFromAI[];
}

interface WorkoutPlanFromAI {
  schedule: WorkoutDayFromAI[];
}

// Helper to check if error is a rate limit (429) or quota error
function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes("429") || msg.includes("too many requests") || msg.includes("quota") || msg.includes("rate");
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { userInputs } = await request.json();

    if (!userInputs) {
      return NextResponse.json(
        { error: "Missing userInputs in request body" },
        { status: 400 }
      );
    }

    // Parse user equipment into array format
    const userEquipment = userInputs.equipment
      .split(",")
      .map((e: string) => e.trim())
      .filter(Boolean);

    // Convert to Title Case to match database format (e.g., 'DUMBBELL' -> 'Dumbbell')
    const formattedEquipment = userEquipment.map((item: string) => 
      item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
    );

    // Step A: Query Supabase for exercises filtered by user's equipment
    let { data: exercises, error: dbError } = await supabase
      .from("exercises")
      .select("readable_id, name, target_muscle, equipment, science_note")
      .overlaps("equipment", formattedEquipment);

    if (dbError) {
      return NextResponse.json(
        { error: "Database error", details: dbError.message },
        { status: 500 }
      );
    }

    // Fallback: If no exercises found, try bodyweight exercises
    if (!exercises || exercises.length === 0) {
      const { data: fallbackExercises, error: fallbackError } = await supabase
        .from("exercises")
        .select("readable_id, name, target_muscle, equipment, science_note")
        .overlaps("equipment", ["Bodyweight"]);

      if (fallbackError || !fallbackExercises || fallbackExercises.length === 0) {
        return NextResponse.json(
          { error: "No exercises found matching your equipment. Please select different equipment." },
          { status: 404 }
        );
      }

      exercises = fallbackExercises;
    }

    // Create a lookup map for exercise data (keep full data for enrichment)
    const exerciseMap = new Map(
      exercises.map((ex) => [
        ex.readable_id,
        { name: ex.name, science_note: ex.science_note },
      ])
    );

    // Step B: Create MINIFIED context for AI (reduces tokens by ~60%)
    // Only send essential data: id, name, muscle - NOT science_note, instructions, etc.
    const aiContext = exercises.map((ex) => ({
      id: ex.readable_id,
      name: ex.name,
      muscle: ex.target_muscle,
    }));

    // Format as compact JSON for the prompt
    const availableExercises = JSON.stringify(aiContext);

    // Step C: Generate the prompt
    const prompt = generateWorkoutPrompt(userInputs, availableExercises);

    // Step D: API Key Rotation & Failover System
    const apiPool: ApiConfig[] = [
      { key: process.env.GEMINI_API_KEY_1, model: "gemini-2.5-flash", name: "Key 1 (Primary)" },
      { key: process.env.GEMINI_API_KEY_2, model: "gemini-2.5-flash", name: "Key 2 (Backup)" },
      { key: process.env.GEMINI_API_KEY_3, model: "gemini-2.5-flash", name: "Key 3 (Backup)" },
    ].filter(config => config.key); // Only include configs with valid keys

    if (apiPool.length === 0) {
      return NextResponse.json(
        { error: "No API keys configured. Please contact support." },
        { status: 500 }
      );
    }

    let workoutPlan: WorkoutPlanFromAI | null = null;
    let lastError: Error | null = null;

    // Try each API key until one succeeds
    for (let i = 0; i < apiPool.length; i++) {
      const config = apiPool[i];
      
      try {
        console.log(`Attempting generation with ${config.name} (${config.model})...`);
        
        const genAI = new GoogleGenerativeAI(config.key!);
        const model = genAI.getGenerativeModel({ model: config.model });
        
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        });

        const response = result.response;
        const text = response.text();
        
        // Parse the AI response
        workoutPlan = JSON.parse(text);
        console.log(`✓ Success with ${config.name}`);
        break; // Success! Exit the loop
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Check if it's a rate limit error
        if (isRateLimitError(error)) {
          console.warn(`⚠ ${config.name} exhausted (429), switching to next key...`);
          continue; // Try the next key
        }
        
        // For non-rate-limit errors (e.g., prompt blocked, invalid response), throw immediately
        console.error(`✗ ${config.name} failed with non-recoverable error:`, lastError.message);
        throw lastError;
      }
    }

    // Final fallback: All keys exhausted
    if (!workoutPlan) {
      console.error("All API keys exhausted. System busy.");
      return NextResponse.json(
        { error: "System busy. All AI engines are at capacity. Please try again in 1-2 minutes." },
        { status: 429 }
      );
    }

    // Step E: Enrich the workout plan with exercise names and science notes
    const enrichedPlan = {
      schedule: workoutPlan.schedule.map((day) => ({
        day_name: day.day_name,
        exercises: day.exercises.map((exercise) => {
          const exerciseData = exerciseMap.get(exercise.id);
          return {
            ...exercise,
            name: exerciseData?.name || `Exercise ${exercise.id}`,
            science_note: exerciseData?.science_note || exercise.note,
          };
        }),
      })),
    };

    return NextResponse.json(enrichedPlan);
  } catch (error) {
    console.error("Error generating workout plan:", error);
    
    // Check for rate limit error (429)
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isRateLimit = errorMessage.includes("429") || errorMessage.includes("Too Many Requests") || errorMessage.includes("quota");
    
    if (isRateLimit) {
      return NextResponse.json(
        { error: "High traffic. Please wait 1 minute." },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      {
        error: "Failed to generate workout plan",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
