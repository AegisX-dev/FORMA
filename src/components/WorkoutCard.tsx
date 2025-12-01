"use client";

import { useState } from "react";
import { Info } from "lucide-react";

interface WorkoutCardProps {
  exerciseName: string;
  sets: number;
  reps: string;
  rest: string;
  scienceNote: string;
  index?: number;
}

export default function WorkoutCard({
  exerciseName,
  sets,
  reps,
  rest,
  scienceNote,
  index = 0,
}: WorkoutCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative border-t border-concrete/20 bg-paper px-5 py-7 animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 75}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Exercise Name */}
        <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
          {exerciseName}
        </h3>

        {/* Info Icon with Tooltip */}
        <div
          className="relative shrink-0"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info className="h-4 w-4 text-concrete hover:text-acid cursor-pointer transition-colors" />

          {/* Tooltip - Code Comment Style */}
          {showTooltip && (
            <div className="absolute right-6 top-0 z-20 w-80 border-l-2 border-acid bg-void px-4 ">
              <p className="font-mono text-xs leading-relaxed text-concrete">
                <span className="text-acid">{"//"}</span> {scienceNote}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Technical Specs - Data Readouts */}
      <div className="mt-3 flex items-center gap-6 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-concrete/60">SETS</span>
          <span className="text-acid">{sets}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-concrete/60">REPS</span>
          <span className="text-acid">{reps}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-concrete/60">REST</span>
          <span className="text-white/80">{rest}</span>
        </div>
      </div>
    </div>
  );
}
