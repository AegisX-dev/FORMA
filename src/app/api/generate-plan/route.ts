import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { model, generateWorkoutPrompt } from "@/lib/gemini";

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

    // Step A: Query Supabase for all exercises
    const { data: exercises, error: dbError } = await supabase
      .from("exercises")
      .select("readable_id, name, target_muscle, equipment, science_note");

    if (dbError) {
      return NextResponse.json(
        { error: "Database error", details: dbError.message },
        { status: 500 }
      );
    }

    if (!exercises || exercises.length === 0) {
      return NextResponse.json(
        { error: "No exercises found in database" },
        { status: 404 }
      );
    }

    // Create a lookup map for exercise data
    const exerciseMap = new Map(
      exercises.map((ex) => [
        ex.readable_id,
        { name: ex.name, science_note: ex.science_note },
      ])
    );

    // Step B: Format exercises into a readable string
    const availableExercises = exercises
      .map(
        (ex) =>
          `ID: ${ex.readable_id} - ${ex.name} (${ex.target_muscle} - ${ex.equipment})`
      )
      .join("\n");

    // Step C: Generate the prompt
    const prompt = generateWorkoutPrompt(userInputs, availableExercises);

    // Step D: Call Gemini with JSON response config
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = result.response;
    const text = response.text();

    // Parse the AI response
    const workoutPlan: WorkoutPlanFromAI = JSON.parse(text);

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
    return NextResponse.json(
      {
        error: "Failed to generate workout plan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
