"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative border-t border-concrete/20 bg-paper p-5 md:px-5 md:py-7 rounded-sm animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${index * 75}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Exercise Name */}
        <h3 className="font-display text-lg md:text-xl font-bold uppercase tracking-wide text-white whitespace-normal break-words leading-snug">
          {exerciseName}
        </h3>

        {/* Info Icon - Tap to Toggle */}
        <button
          type="button"
          className="relative shrink-0 p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close science note" : "Show science note"}
        >
          {isOpen ? (
            <X className="h-5 w-5 text-acid cursor-pointer transition-colors" />
          ) : (
            <Info className="h-5 w-5 text-concrete hover:text-acid cursor-pointer transition-colors" />
          )}
        </button>
      </div>

      {/* Tooltip - 100% Opaque, Tap-Only */}
      {isOpen && (
        <div 
          className="absolute right-4 top-12 z-50 w-[220px] md:w-72 border-l-2 border-acid px-4 py-3 shadow-xl rounded-sm"
          style={{ backgroundColor: "#111111" }}
        >
          <p className="font-mono text-sm md:text-xs leading-relaxed text-concrete">
            <span className="text-acid">{"//"}</span> {scienceNote}
          </p>
        </div>
      )}

      {/* Technical Specs - Data Readouts */}
      <div className="mt-3 flex items-center gap-4 md:gap-6 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-xs text-concrete/60">SETS</span>
          <span className="text-base md:text-sm text-acid">{sets}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-xs text-concrete/60">REPS</span>
          <span className="text-base md:text-sm text-acid">{reps}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-xs text-concrete/60">REST</span>
          <span className="text-base md:text-sm text-white/80">{rest}</span>
        </div>
      </div>
    </div>
  );
}
