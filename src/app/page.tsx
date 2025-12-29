"use client";

import { useState, useRef } from "react";
import { animate } from "animejs";
import { jsPDF } from "jspdf";
import WorkoutCard from "@/components/WorkoutCard";
import DurationPicker from "@/components/DurationPicker";
import IntelLoader from "@/components/IntelLoader";

interface Exercise {
  id: number;
  sets: number;
  reps: string;
  note: string;
  name?: string;
  science_note?: string;
  video_url?: string;
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

const DAYS_OPTIONS = [3, 4, 5, 6] as const;

export default function Home() {
  const [goals, setGoals] = useState<string[]>(["HYPERTROPHY"]);
  const [duration, setDuration] = useState(45);
  const [equipment, setEquipment] = useState<string[]>(["BARBELL"]);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [loading, setLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGoalSelect = (g: string) => {
    console.log("Goal toggled:", g);
    setGoals((prev) => {
      // If already selected, remove it (but keep at least one)
      if (prev.includes(g)) {
        if (prev.length === 1) return prev; // Keep at least one goal
        return prev.filter((goal) => goal !== g);
      }
      // Add the new goal
      return [...prev, g];
    });
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
    console.log("Generate clicked with:", { goals, duration, equipment });
    // Animate form out and hide it completely when done
    if (formRef.current) {
      const formElement = formRef.current;
      animate(formElement, {
        translateY: -40,
        opacity: 0,
        duration: 400,
        ease: "inQuad",
        onComplete: () => {
          formElement.style.display = "none";
        },
      });
    }

    setLoading(true);
    setIsError(false);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInputs: {
            goals: goals.map((g) => g.toLowerCase()),
            duration: `${duration} minutes`,
            equipment: equipment.join(", ") || "Bodyweight",
            days: String(daysPerWeek),
          },
        }),
      });

      if (!response.ok) {
        // Check status code before throwing to set appropriate message
        if (response.status === 429) {
          throw new Error("RATE_LIMIT");
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setWorkoutPlan(data);
      setShowResults(true);

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Animate results in after a brief delay
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.style.display = "block";
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
      setIsError(true);
      
      // Check if it's a rate limit error (429)
      if (error instanceof Error && (error.message === "RATE_LIMIT" || error.message.includes("429"))) {
        setErrorMessage("⚠️ AI System Busy. Please wait 60s and try again.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
      
      // Show form again so user can retry
      if (formRef.current) {
        formRef.current.style.display = "block";
        formRef.current.style.opacity = "1";
        formRef.current.style.transform = "translateY(0)";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Animate results out
    if (resultsRef.current) {
      const resultsElement = resultsRef.current;
      animate(resultsElement, {
        translateY: -40,
        opacity: 0,
        duration: 400,
        ease: "inQuad",
        onComplete: () => {
          resultsElement.style.display = "none";
          setWorkoutPlan(null);
          setShowResults(false);

          // Animate form back in
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.style.display = "block";
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
    const doc = new jsPDF({ orientation: "portrait" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = 20;

    // Helper function to check and add new page if needed
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Header - HIGH CONTRAST
    doc.setFont("courier", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("FORMA // ARCHITECTED BLUEPRINT", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 14;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 14;

    // Loop through days
    plan.schedule.forEach((day) => {
      checkNewPage(50);

      // Day header - BOLD, LARGE, BLACK
      doc.setFont("courier", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(day.day_name.toUpperCase(), margin, yPosition);
      yPosition += 4;
      doc.setDrawColor(212, 255, 0);
      doc.setLineWidth(0.8);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Column headers - DARK GREY BACKGROUND
      doc.setFillColor(220, 220, 220);
      doc.rect(margin, yPosition - 4, contentWidth, 8, "F");
      doc.setFont("courier", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("EXERCISE", margin + 2, yPosition);
      doc.text("SETS", margin + 95, yPosition);
      doc.text("REPS", margin + 115, yPosition);
      doc.text("REST", margin + 140, yPosition);
      yPosition += 10;

      // Exercises
      day.exercises.forEach((exercise) => {
        const exerciseName = exercise.name || `Exercise ${exercise.id}`;
        const scienceNote = exercise.science_note || exercise.note;

        // Calculate space needed for this exercise
        const noteLines = scienceNote 
          ? doc.splitTextToSize(`// ${scienceNote}`, contentWidth - 10)
          : [];
        const exerciseHeight = 10 + (noteLines.length * 5) + 8;

        checkNewPage(exerciseHeight);

        // Exercise row - BLACK TEXT, LARGER FONT
        doc.setFont("courier", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // Wrap exercise name if too long
        const nameMaxWidth = 88;
        const wrappedName = doc.splitTextToSize(exerciseName, nameMaxWidth);
        doc.text(wrappedName, margin + 2, yPosition);
        
        doc.setFont("courier", "bold");
        doc.text(String(exercise.sets), margin + 95, yPosition);
        doc.text(exercise.reps, margin + 115, yPosition);
        doc.text("90s", margin + 140, yPosition);
        doc.text(exercise.reps, margin + 115, yPosition);
        doc.text("90s", margin + 140, yPosition);
        
        // Adjust yPosition based on wrapped name height
        yPosition += Math.max(wrappedName.length * 5, 6);

        // Science note (on new line, indented) - DARKER FOR READABILITY
        if (scienceNote) {
          doc.setFont("courier", "italic");
          doc.setFontSize(9);
          doc.setTextColor(60, 60, 60);
          doc.text(noteLines, margin + 5, yPosition);
          yPosition += noteLines.length * 4 + 4;
        }

        yPosition += 5;
      });

      yPosition += 6;
    });

    // Footer with timestamp
    const timestamp = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    // Add footer to last page
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${timestamp}`, pageWidth / 2, pageHeight - 10, { align: "center" });

    // Save the PDF
    doc.save("FORMA_Blueprint.pdf");
  };

  return (
    <main className="min-h-screen bg-void text-white">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        {/* Header */}
        <header className="mb-20">
          <h1 className="font-display text-7xl font-bold uppercase tracking-tighter text-white md:text-8xl">
            FORMA
          </h1>
          <p className="mt-2 font-mono text-sm uppercase tracking-widest text-concrete">
            Sculpted by Science. Architected by AI.
          </p>
        </header>

        {/* Error State */}
        {isError && !loading && (
          <div className="mb-8 border border-red-500/50 bg-red-500/10 px-6 py-4 rounded-sm">
            <p className="font-mono text-sm uppercase tracking-widest text-red-400">
              {errorMessage || "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {/* Loading State - Intel Loader */}
        {loading && <IntelLoader goals={goals} />}

        {/* Results Section */}
        {showResults && workoutPlan && !loading && (
          <div ref={resultsRef} className="opacity-0">
            <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
              <button
                onClick={handleReset}
                className="font-mono text-sm uppercase tracking-widest text-concrete hover:text-acid transition-colors"
              >
                ← NEW PROTOCOL
              </button>
              <button
                type="button"
                onClick={() => downloadPDF(workoutPlan)}
                className="border border-white/30 bg-transparent px-6 py-2 font-mono text-sm uppercase tracking-widest text-white transition-all hover:border-acid hover:text-acid rounded-sm"
              >
                DOWNLOAD BLUEPRINT
              </button>
            </div>

            <div className="space-y-16">
              {Array.isArray(workoutPlan.schedule) && workoutPlan.schedule.length > 0 ? (
                workoutPlan.schedule.map((day, dayIndex) => (
                  <section key={dayIndex}>
                    <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-6 pb-4 border-b border-concrete/20">
                      {day.day_name}
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                      {Array.isArray(day.exercises) && day.exercises.length > 0 ? (
                        day.exercises.map((exercise, exIndex) => (
                          <WorkoutCard
                            key={exIndex}
                            index={exIndex}
                            exerciseName={exercise.name || `Exercise ${exercise.id}`}
                            sets={exercise.sets}
                            reps={exercise.reps}
                            rest="90s"
                            scienceNote={exercise.science_note || exercise.note}
                            videoUrl={exercise.video_url}
                          />
                        ))
                      ) : null}
                    </div>
                  </section>
                ))
              ) : null}
            </div>
          </div>
        )}

        {/* Form Section */}
        {!showResults && !loading && (
          <div ref={formRef} className="space-y-16">
            {/* Goal Selection - Multi-Select */}
            <section>
              <label className="block font-mono text-sm uppercase tracking-widest text-acid mb-6">
                01 — SELECT GOAL(S)
              </label>
              <div className="flex flex-wrap gap-6">
                {GOALS.map((g) => {
                  const isSelected = goals.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleGoalSelect(g)}
                      className={`px-4 py-2 font-display text-3xl font-bold uppercase tracking-tight transition-all md:text-4xl border-2 ${
                        isSelected
                          ? "text-acid border-acid bg-acid/10"
                          : "text-concrete/40 border-transparent hover:text-concrete/70 hover:border-concrete/20"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
              {goals.length > 1 && (
                <p className="mt-4 font-mono text-xs text-acid/60 uppercase tracking-wider">
                  Hybrid Mode: {goals.join(" + ")}
                </p>
              )}
            </section>

            {/* Duration Selection - Drum Picker */}
            <section>
              <label className="block font-mono text-sm uppercase tracking-widest text-acid mb-6">
                02 — SESSION LENGTH
              </label>
              <DurationPicker
                value={duration}
                onChange={handleDurationChange}
                min={20}
                max={120}
                step={5}
              />
            </section>

            {/* Frequency Selection */}
            <section>
              <label className="block font-mono text-sm uppercase tracking-widest text-acid mb-6">
                03 — FREQUENCY
              </label>
              <div className="flex flex-wrap gap-3">
                {DAYS_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDaysPerWeek(d)}
                    style={{
                      backgroundColor: daysPerWeek === d ? '#D4FF00' : 'transparent',
                      color: daysPerWeek === d ? '#050505' : '#888888',
                      borderColor: daysPerWeek === d ? '#D4FF00' : 'rgba(136, 136, 136, 0.3)',
                    }}
                    className="border-2 px-6 py-3 font-mono text-base uppercase tracking-widest transition-all font-bold rounded-sm"
                  >
                    {d} DAYS
                  </button>
                ))}
              </div>
            </section>

            {/* Equipment Selection */}
            <section>
              <label className="block font-mono text-sm uppercase tracking-widest text-acid mb-6">
                04 — EQUIPMENT
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
                    className="border-2 px-6 py-3 font-mono text-sm uppercase tracking-widest transition-all font-bold rounded-sm"
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
                className="group relative border border-acid bg-transparent px-12 py-5 font-display text-lg font-bold uppercase tracking-wide text-acid transition-all hover:bg-acid hover:text-void rounded-sm"
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
