import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import PDFParser from "pdf2json";

// Use SERVICE ROLE key to bypass RLS for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ExtractedExercise {
  name: string;
  target_muscle: string;
  equipment: string | string[];
  difficulty: string;
  instructions: string;
}

// Helper function to parse PDF using pdf2json
function parsePdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1);
    
    parser.on("pdfParser_dataReady", () => {
      resolve(parser.getRawTextContent());
    });
    
    parser.on("pdfParser_dataError", (err: { parserError: Error }) => {
      reject(err.parserError);
    });
    
    parser.parseBuffer(buffer);
  });
}

// Map difficulty string to tier number
function mapDifficultyToTier(difficulty: string): number {
  const lower = difficulty.toLowerCase();
  if (lower.includes("beginner") || lower.includes("easy")) return 1;
  if (lower.includes("advanced") || lower.includes("hard") || lower.includes("expert")) return 3;
  return 2; // Default to Intermediate
}

// Normalize equipment to array format
function normalizeEquipment(equipment: string | string[]): string[] {
  if (Array.isArray(equipment)) {
    return equipment.map(e => e.trim()).filter(Boolean);
  }
  // Handle comma-separated string
  return equipment.split(/[,;]/).map(e => e.trim()).filter(Boolean);
}

// Validate and normalize target muscle
function normalizeTargetMuscle(muscle: string): string {
  const muscleMap: Record<string, string> = {
    "chest": "Chest",
    "pecs": "Chest",
    "pectorals": "Chest",
    "back": "Back",
    "lats": "Back",
    "traps": "Back",
    "legs": "Legs",
    "quads": "Legs",
    "hamstrings": "Legs",
    "glutes": "Legs",
    "calves": "Legs",
    "shoulders": "Shoulders",
    "delts": "Shoulders",
    "deltoids": "Shoulders",
    "arms": "Arms",
    "biceps": "Arms",
    "triceps": "Arms",
    "forearms": "Arms",
    "abs": "Abs",
    "core": "Abs",
    "abdominals": "Abs",
  };

  const lower = muscle.toLowerCase().trim();
  return muscleMap[lower] || muscle.charAt(0).toUpperCase() + muscle.slice(1).toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log(`[Ingest] Processing file: ${file.name} (${file.type})`);

    // Extract text based on file type
    let extractedText = "";

    if (file.type === "application/pdf") {
      // PDF extraction using pdf2json
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      extractedText = await parsePdf(buffer);
      console.log(`[Ingest] Extracted ${extractedText.length} chars from PDF`);
    } else if (file.type === "text/csv" || file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
      // Text/CSV extraction
      extractedText = await file.text();
      console.log(`[Ingest] Read ${extractedText.length} chars from text file`);
    } else {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Use PDF, CSV, or TXT.` },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { error: "File contains insufficient text content" },
        { status: 400 }
      );
    }

    // Truncate if too long (prevent token overflow)
    const maxChars = 50000;
    if (extractedText.length > maxChars) {
      console.log(`[Ingest] Truncating text from ${extractedText.length} to ${maxChars} chars`);
      extractedText = extractedText.substring(0, maxChars);
    }

    // Get API key (use primary key for admin operations)
    const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // System prompt for extraction
    const systemPrompt = `You are a data extraction engine. Analyze the following text and extract all fitness exercises mentioned.

Return a JSON Array where each object has:
{
  "name": "Exercise Name",
  "target_muscle": "Primary muscle group",
  "equipment": ["Equipment1", "Equipment2"],
  "difficulty": "Beginner/Intermediate/Advanced",
  "instructions": "Brief description or cues"
}

STRICT RULES:
- target_muscle MUST be one of: Chest, Back, Legs, Shoulders, Arms, Abs
- equipment should be an array like: ["Barbell"], ["Dumbbell", "Bench"], ["Bodyweight"], ["Machine"], ["Cables"]
- If difficulty is unclear, default to "Intermediate"
- If instructions are not found, provide a brief generic description
- Extract ALL exercises found, even if partially described
- Do NOT invent exercises not mentioned in the text

TEXT TO ANALYZE:
${extractedText}`;

    console.log("[Ingest] Sending to Gemini for analysis...");

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    console.log(`[Ingest] AI response: ${responseText.substring(0, 200)}...`);

    // Parse AI response
    let exercises: ExtractedExercise[];
    try {
      const parsed = JSON.parse(responseText);
      exercises = Array.isArray(parsed) ? parsed : parsed.exercises || [];
    } catch (parseError) {
      console.error("[Ingest] JSON parse error:", parseError);
      return NextResponse.json(
        { error: "AI returned invalid JSON. Try a cleaner document." },
        { status: 500 }
      );
    }

    if (!exercises || exercises.length === 0) {
      return NextResponse.json(
        { error: "No exercises found in document" },
        { status: 400 }
      );
    }

    console.log(`[Ingest] Extracted ${exercises.length} exercises from AI`);

    // Fetch existing exercise names to prevent duplicates
    const { data: existingData } = await supabase.from("exercises").select("name");
    const existingNames = new Set(existingData?.map((e) => e.name.toLowerCase()));
    
    // Filter out duplicates
    const uniqueExercises = exercises.filter(
      (ex) => !existingNames.has((ex.name?.trim() || "").toLowerCase())
    );
    
    console.log(`[Ingest] ${uniqueExercises.length} new exercises after filtering duplicates`);

    // Handle case where all exercises are duplicates
    if (uniqueExercises.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new exercises found. All were duplicates.",
        count: 0,
        duplicates: exercises.length,
      });
    }

    // Transform for database insert (only unique exercises)
    const dbRecords = uniqueExercises.map((ex) => ({
      name: ex.name?.trim() || "Unknown Exercise",
      target_muscle: normalizeTargetMuscle(ex.target_muscle || "Chest"),
      equipment: normalizeEquipment(ex.equipment || ["Bodyweight"]),
      difficulty_tier: mapDifficultyToTier(ex.difficulty || "Intermediate"),
      science_note: ex.instructions?.trim() || null,
    }));

    // Batch insert to Supabase
    const { data, error: insertError } = await supabase
      .from("exercises")
      .insert(dbRecords)
      .select("id");

    if (insertError) {
      console.error("[Ingest] Supabase insert error:", insertError);
      return NextResponse.json(
        { error: `Database error: ${insertError.message}` },
        { status: 500 }
      );
    }

    const insertedCount = data?.length || dbRecords.length;
    const skippedCount = exercises.length - uniqueExercises.length;
    console.log(`[Ingest] Successfully inserted ${insertedCount} exercises (${skippedCount} duplicates skipped)`);

    return NextResponse.json({
      success: true,
      count: insertedCount,
      duplicates: skippedCount,
      exercises: dbRecords.map(r => r.name),
    });

  } catch (error) {
    console.error("[Ingest] Unexpected error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Processing failed" },
      { status: 500 }
    );
  }
}
