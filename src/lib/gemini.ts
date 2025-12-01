import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing environment variable: GEMINI_API_KEY");
}

export const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

interface UserInputs {
  goal: string;
  duration: string;
  equipment: string;
  days: string;
}

export function generateWorkoutPrompt(
  userInputs: UserInputs,
  availableExercises: string
): string {
  return `
ROLE: You are an Expert Strength Coach with deep knowledge of exercise science, periodization, and program design.

DATA SOURCE:
The following is the ONLY list of exercises you may select from. Each exercise has an ID, name, target muscle, and science note.
${availableExercises}

USER CONSTRAINTS:
- Goal: ${userInputs.goal}
- Session Duration: ${userInputs.duration}
- Available Equipment: ${userInputs.equipment}
- Training Days Per Week: ${userInputs.days}

INSTRUCTIONS:
1. Create a weekly workout schedule based on the user's constraints.
2. ONLY select exercise IDs that exist in the DATA SOURCE list above. Do NOT invent or guess IDs.
3. Distribute exercises appropriately across the training days.
4. Provide sets, reps, and a brief coaching note for each exercise.

OUTPUT FORMAT:
You MUST respond with valid JSON only. No explanations, no markdown, no extra text.
Use this exact structure:

{
  "schedule": [
    {
      "day_name": "Day 1 - Push",
      "exercises": [
        {
          "id": 1,
          "sets": 4,
          "reps": "8-10",
          "note": "Focus on controlled eccentric"
        }
      ]
    }
  ]
}

CRITICAL: Only use exercise IDs from the DATA SOURCE. Any ID not in the list is invalid.
`.trim();
}

