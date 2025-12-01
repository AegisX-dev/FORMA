"use client";

import { useState, useRef } from "react";
import { animate } from "animejs";
import { jsPDF } from "jspdf";
import WorkoutCard from "@/components/WorkoutCard";

interface Exercise {
  id: number;
  sets: number;
  reps: string;
  note: string;
  name?: string;
  science_note?: string;
}

interface WorkoutDay {
  day_name: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  schedule: WorkoutDay[];
}

const GOALS = ["HYPERTROPHY", "STRENGTH", "ENDURANCE"] as const;
const EQUIPMENT = ["BARBELL", "DUMBBELL", "CABLES", "BODYWEIGHT"] as const;
const LOADING_SEQUENCE = [
  "CONNECTING TO NEURAL NET...",
  "ANALYZING BIOMETRICS...",
  "FETCHING RESEARCH DATA...",
  "CALCULATING VOLUME LOAD...",
  "OPTIMIZING REST INTERVALS...",
  "ASSEMBLING BLUEPRINT...",
];

export default function Home() {
  const [goal, setGoal] = useState<string>("HYPERTROPHY");
  const [duration, setDuration] = useState(45);
  const [equipment, setEquipment] = useState<string[]>(["BARBELL"]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("INITIALIZING SYSTEM...");
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [showResults, setShowResults] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleGoalSelect = (g: string) => {
    console.log("Goal selected:", g);
    setGoal(g);
  };

  const handleDurationChange = (value: number) => {
    console.log("Duration changed:", value);
    setDuration(value);
  };

  const handleEquipmentToggle = (item: string) => {
    console.log("Equipment toggled:", item);
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const handleGenerate = async () => {
    console.log("Generate clicked with:", { goal, duration, equipment });
    // Animate form out
    if (formRef.current) {
      animate(formRef.current, {
        translateY: -40,
        opacity: 0,
        duration: 400,
        ease: "inQuad",
      });
    }

    setLoading(true);
    setLoadingText("INITIALIZING SYSTEM...");

    // Start the loading sequence
    let sequenceIndex = 0;
    loadingIntervalRef.current = setInterval(() => {
      setLoadingText(LOADING_SEQUENCE[sequenceIndex % LOADING_SEQUENCE.length]);
      sequenceIndex++;
    }, 1800);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInputs: {
            goal: goal.toLowerCase(),
            duration: `${duration} minutes`,
            equipment: equipment.join(", ") || "Bodyweight",
            days: "4",
          },
        }),
      });

      const data = await response.json();
      setWorkoutPlan(data);
      setShowResults(true);

      // Animate results in after a brief delay
      setTimeout(() => {
        if (resultsRef.current) {
          animate(resultsRef.current, {
            translateY: [40, 0],
            opacity: [0, 1],
            duration: 500,
            ease: "outQuad",
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      // Clear the loading interval
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Animate results out
    if (resultsRef.current) {
      animate(resultsRef.current, {
        translateY: -40,
        opacity: 0,
        duration: 400,
        ease: "inQuad",
        onComplete: () => {
          setWorkoutPlan(null);
          setShowResults(false);

          // Animate form back in
          setTimeout(() => {
            if (formRef.current) {
              animate(formRef.current, {
                translateY: [40, 0],
                opacity: [0, 1],
                duration: 500,
                ease: "outQuad",
              });
            }
          }, 100);
        },
      });
    }
  };

  const downloadPDF = (plan: WorkoutPlan) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Set white background (default)
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");

    // Header
    doc.setFont("courier", "bold");
    doc.setFontSize(18);
    doc.setTextColor(5, 5, 5);
    doc.text("FORMA // ARCHITECTED BLUEPRINT", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;

    // Table headers
    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("EXERCISE", 20, yPosition);
    doc.text("SETS", 110, yPosition);
    doc.text("REPS", 135, yPosition);
    doc.text("REST", 165, yPosition);
    yPosition += 8;

    // Loop through days
    plan.schedule.forEach((day) => {
      // Check if we need a new page
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }

      // Day header
      doc.setFont("courier", "bold");
      doc.setFontSize(12);
      doc.setTextColor(5, 5, 5);
      yPosition += 5;
      doc.text(day.day_name.toUpperCase(), 20, yPosition);
      yPosition += 2;
      doc.setDrawColor(212, 255, 0); // Acid color
      doc.setLineWidth(0.5);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      // Exercises
      day.exercises.forEach((exercise) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        // Exercise row
        doc.setFont("courier", "normal");
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        
        const exerciseName = exercise.name || `Exercise ${exercise.id}`;
        doc.text(exerciseName.substring(0, 25), 20, yPosition);
        doc.text(String(exercise.sets), 110, yPosition);
        doc.text(exercise.reps, 135, yPosition);
        doc.text("90s", 165, yPosition);
        yPosition += 6;

        // Science note (italicized)
        const scienceNote = exercise.science_note || exercise.note;
        if (scienceNote) {
          doc.setFont("courier", "italic");
          doc.setFontSize(8);
          doc.setTextColor(120, 120, 120);
          const noteLines = doc.splitTextToSize(`// ${scienceNote}`, pageWidth - 50);
          doc.text(noteLines, 25, yPosition);
          yPosition += noteLines.length * 4 + 4;
        }

        yPosition += 4;
      });

      yPosition += 8;
    });

    // Footer with timestamp
    const timestamp = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${timestamp}`, pageWidth / 2, 285, { align: "center" });

    // Save the PDF
    doc.save("FORMA_Blueprint.pdf");
  };

  return (
    <main className="min-h-screen bg-void text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <header className="mb-20">
          <h1 className="font-display text-7xl font-bold uppercase tracking-tighter text-white md:text-8xl">
            FORMA
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-concrete">
            Sculpted by Science. Architected by AI.
          </p>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="font-mono text-sm uppercase tracking-widest text-acid animate-pulse">
                {loadingText}
              </p>
              <div className="mt-4 flex justify-center gap-1">
                <span className="h-2 w-2 bg-acid animate-pulse" style={{ animationDelay: "0ms" }}></span>
                <span className="h-2 w-2 bg-acid animate-pulse" style={{ animationDelay: "150ms" }}></span>
                <span className="h-2 w-2 bg-acid animate-pulse" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && workoutPlan && !loading && (
          <div ref={resultsRef} className="opacity-0">
            <div className="flex items-center justify-between mb-12">
              <button
                onClick={handleReset}
                className="font-mono text-xs uppercase tracking-widest text-concrete hover:text-acid transition-colors"
              >
                ← NEW PROTOCOL
              </button>
              <button
                type="button"
                onClick={() => downloadPDF(workoutPlan)}
                className="border border-white/30 bg-transparent px-6 py-2 font-mono text-xs uppercase tracking-widest text-white transition-all hover:border-acid hover:text-acid"
              >
                DOWNLOAD BLUEPRINT
              </button>
            </div>

            <div className="space-y-16">
              {workoutPlan.schedule.map((day, dayIndex) => (
                <section key={dayIndex}>
                  <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white mb-6 pb-4 border-b border-concrete/20">
                    {day.day_name}
                  </h2>
                  <div className="space-y-0">
                    {day.exercises.map((exercise, exIndex) => (
                      <WorkoutCard
                        key={exIndex}
                        index={exIndex}
                        exerciseName={exercise.name || `Exercise ${exercise.id}`}
                        sets={exercise.sets}
                        reps={exercise.reps}
                        rest="90s"
                        scienceNote={exercise.science_note || exercise.note}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {/* Form Section */}
        {!showResults && !loading && (
          <div ref={formRef} className="space-y-16">
            {/* Goal Selection */}
            <section>
              <label className="block font-mono text-xs uppercase tracking-widest text-acid mb-6">
                01 — SELECT GOAL
              </label>
              <div className="flex flex-wrap gap-6">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGoalSelect(g)}
                    className={`px-4 py-2 font-display text-3xl font-bold uppercase tracking-tight transition-all md:text-4xl border-2 ${
                      goal === g
                        ? "text-acid border-acid bg-acid/10"
                        : "text-concrete/40 border-transparent hover:text-concrete/70 hover:border-concrete/20"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </section>

            {/* Duration Selection */}
            <section>
              <label className="block font-mono text-xs uppercase tracking-widest text-acid mb-6">
                02 — SESSION LENGTH
              </label>
              <div className="flex items-end gap-4">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={duration.toString()}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+/, '') || '0';
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 0 && num <= 180) {
                      handleDurationChange(num);
                    }
                  }}
                  className="font-display text-7xl font-bold text-acid md:text-8xl border-b-2 border-acid pb-2 bg-transparent w-32 md:w-40 outline-none focus:border-white text-center"
                />
                <span className="font-mono text-sm text-concrete mb-4">MIN</span>
              </div>
            </section>

            {/* Equipment Selection */}
            <section>
              <label className="block font-mono text-xs uppercase tracking-widest text-acid mb-6">
                03 — EQUIPMENT
              </label>
              <div className="flex flex-wrap gap-3">
                {EQUIPMENT.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleEquipmentToggle(item)}
                    style={{
                      backgroundColor: equipment.includes(item) ? '#D4FF00' : 'transparent',
                      color: equipment.includes(item) ? '#050505' : '#888888',
                      borderColor: equipment.includes(item) ? '#D4FF00' : 'rgba(136, 136, 136, 0.3)',
                    }}
                    className="border-2 px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all font-bold"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            {/* Submit Button */}
            <section className="pt-8">
              <button
                type="button"
                onClick={handleGenerate}
                className="group relative border border-acid bg-transparent px-12 py-5 font-display text-lg font-bold uppercase tracking-wide text-acid transition-all hover:bg-acid hover:text-void"
              >
                <span className="relative z-10">GENERATE PROTOCOL</span>
              </button>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
