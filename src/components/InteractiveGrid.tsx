"use client";

import { useEffect, useRef } from "react";

export default function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Update CSS variables for cursor position (high performance, no re-renders)
      container.style.setProperty("--x", `${e.clientX}px`);
      container.style.setProperty("--y", `${e.clientY}px`);
    };

    // Track mouse movement on the entire window
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
      style={
        {
          "--x": "50%",
          "--y": "50%",
          backgroundColor: "#050505",
        } as React.CSSProperties
      }
    >
      {/* Base Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(212, 255, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212, 255, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Spotlight Reveal Layer - Brighter grid that shows near cursor */}
      <div
        className="absolute inset-0 transition-opacity duration-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(212, 255, 0, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212, 255, 0, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: `radial-gradient(circle 200px at var(--x) var(--y), black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 200px at var(--x) var(--y), black 0%, transparent 100%)`,
        }}
      />

      {/* Glow Effect - Soft acid glow around cursor */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle 150px at var(--x) var(--y), rgba(212, 255, 0, 0.08) 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
