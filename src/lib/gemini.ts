// Note: API key initialization is now handled in route.ts with key rotation
// This file only exports the prompt generator

interface UserInputs {
  goals: string[];
  duration: string;
  equipment: string;
  days: string;
}

export function generateWorkoutPrompt(
  userInputs: UserInputs,
  availableExercises: string
): string {
  // Format goal string based on single or multiple goals
  const goalText = userInputs.goals.length > 1
    ? `Hybrid Training (${userInputs.goals.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(" + ")})`
    : userInputs.goals[0].charAt(0).toUpperCase() + userInputs.goals[0].slice(1);
  
  const goalFocus = userInputs.goals.length > 1
    ? "Focus: Blend volume for size with heavy compound lifts for strength. Balance hypertrophy rep ranges (8-12) with strength rep ranges (3-6) across the program."
    : `Focus: Optimize for ${userInputs.goals[0]} training principles.`;

  return `
ROLE: Expert Strength Coach.

EXERCISE DATABASE (JSON):
${availableExercises}

CONSTRAINTS:
- Goal: ${goalText}
- ${goalFocus}
- Duration: ${userInputs.duration}
- Equipment: ${userInputs.equipment}
- Days: ${userInputs.days}

RULES:
1. Generate EXACTLY ${userInputs.days} days.
2. Use ONLY exercise IDs from the database above.
3. Each day: 4-6 exercises.

OUTPUT (JSON only, no markdown):
{
  "schedule": [
    {
      "day_name": "Day 1 - Push",
      "exercises": [
        { "id": 1, "sets": 4, "reps": "8-10", "note": "Controlled tempo" }
      ]
    }
  ]
}
`.trim();
}

