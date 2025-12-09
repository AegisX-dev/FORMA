"use client";

import { useEffect, useState, useRef } from "react";
import { animate } from "animejs";

interface IntelLoaderProps {
  goals: string[];
}

// Goal-based science tips dictionary
const INTEL_TIPS: Record<string, string[]> = {
  HYPERTROPHY: [
    "INTEL: Volume is the primary driver of muscle growth.",
    "TIP: Control the eccentric phase for 3 seconds to maximize tension.",
    "SCIENCE: 8-12 reps creates optimal metabolic stress for hypertrophy.",
    "FACT: Mechanical tension + metabolic stress = muscle protein synthesis.",
    "NOTE: Progressive overload is non-negotiable for growth.",
  ],
  STRENGTH: [
    "INTEL: Strength is a neural adaptation, not just muscular.",
    "TIP: Rest 3-5 minutes on heavy compounds to recharge ATP stores.",
    "SCIENCE: Low reps (1-5) maximize motor unit recruitment.",
    "FACT: The CNS adapts faster than muscles in early training.",
    "NOTE: Intent to move fast recruits more muscle fibers.",
  ],
  ENDURANCE: [
    "INTEL: Type I muscle fibers respond best to high rep ranges.",
    "TIP: Short rest periods (30-60s) increase metabolic capacity.",
    "SCIENCE: Capillary density improves with sustained time under tension.",
    "FACT: Lactate threshold is trainable with proper programming.",
    "NOTE: Aerobic base supports all other fitness qualities.",
  ],
};

// Hybrid tips for multi-goal selection
const HYBRID_TIPS = [
  "HYBRID MODE: Blending training stimuli for maximum adaptation.",
  "INTEL: Periodization allows you to train multiple qualities.",
  "TIP: Heavy compounds for strength, isolation for volume.",
  "SCIENCE: Concurrent training requires smart recovery management.",
  "NOTE: Your body adapts to the demands you place on it.",
];

export default function IntelLoader({ goals }: IntelLoaderProps) {
  const [currentTip, setCurrentTip] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const tipRef = useRef<HTMLParagraphElement>(null);

  // Get tips based on selected goals
  const getTips = (): string[] => {
    if (goals.length > 1) {
      // Multiple goals = hybrid mode
      const combinedTips = goals.flatMap(
        (goal) => INTEL_TIPS[goal.toUpperCase()] || []
      );
      return [...HYBRID_TIPS, ...combinedTips];
    }
    // Single goal
    const goalKey = goals[0]?.toUpperCase() || "HYPERTROPHY";
    return INTEL_TIPS[goalKey] || INTEL_TIPS.HYPERTROPHY;
  };

  const tips = getTips();

  // Set first tip immediately on mount
  useEffect(() => {
    setCurrentTip(tips[0]);
  }, []);

  // Cycle through tips every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [tips.length]);

  // Animate tip change when tipIndex changes (skip index 0 since it's set on mount)
  useEffect(() => {
    if (tipIndex === 0) return; // Skip animation on mount
    
    // Set new tip immediately, then animate in
    setCurrentTip(tips[tipIndex]);
    
    if (tipRef.current) {
      // Animate in from below
      animate(tipRef.current, {
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 300,
        easing: "easeOutQuad",
      });
    }
  }, [tipIndex, tips]);

  // Pulsating core animation (continuous) - using CSS animation instead of anime.js loop
  // to avoid stack overflow from recursive complete callbacks

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      {/* Pulsating Core */}
      <div className="relative mb-12">
        {/* Outer glow ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-acid/10 blur-xl animate-pulse" />
        </div>

        {/* Main SVG Core */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="relative z-10"
        >
          {/* Outer ring */}
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke="rgba(212, 255, 0, 0.2)"
            strokeWidth="1"
          />
          {/* Middle ring */}
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="rgba(212, 255, 0, 0.3)"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="animate-spin"
            style={{ animationDuration: "20s" }}
          />
          {/* Core circle - CSS animation for breathing effect */}
          <circle
            cx="60"
            cy="60"
            r="25"
            fill="rgba(212, 255, 0, 0.1)"
            stroke="#D4FF00"
            strokeWidth="2"
            className="animate-pulse"
            style={{ 
              transformOrigin: "60px 60px",
              animation: "breathe 2s ease-in-out infinite"
            }}
          />
          {/* Inner dot */}
          <circle cx="60" cy="60" r="4" fill="#D4FF00" className="animate-pulse" />
        </svg>

        {/* Corner brackets */}
        <div className="absolute -top-2 -left-2 h-4 w-4 border-l-2 border-t-2 border-acid/50" />
        <div className="absolute -top-2 -right-2 h-4 w-4 border-r-2 border-t-2 border-acid/50" />
        <div className="absolute -bottom-2 -left-2 h-4 w-4 border-l-2 border-b-2 border-acid/50" />
        <div className="absolute -bottom-2 -right-2 h-4 w-4 border-r-2 border-b-2 border-acid/50" />
      </div>

      {/* Status text */}
      <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-acid/60">
        Building Protocol
      </p>

      {/* Intel tip display */}
      <div className="max-w-md px-4 text-center">
        <p
          ref={tipRef}
          className="font-mono text-sm leading-relaxed text-white/80"
        >
          {currentTip}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-acid animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
