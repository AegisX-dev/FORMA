"use client";

import { useEffect, useRef, useCallback } from "react";

interface DurationPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function DurationPicker({
  value,
  onChange,
  min = 20,
  max = 120,
  step = 5,
}: DurationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate duration options
  const options: number[] = [];
  for (let i = min; i <= max; i += step) {
    options.push(i);
  }

  const ITEM_HEIGHT = 64; // Height of each item in pixels (taller for mobile)

  // Scroll to value on mount and when value changes externally
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isScrollingRef.current) return;

    const index = options.indexOf(value);
    if (index !== -1) {
      const scrollTop = index * ITEM_HEIGHT;
      container.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  }, [value, options]);

  // Handle scroll to detect center value
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    isScrollingRef.current = true;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce to detect when scrolling stops
    timeoutRef.current = setTimeout(() => {
      const scrollTop = container.scrollTop;
      const centerIndex = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(centerIndex, options.length - 1));
      const newValue = options[clampedIndex];

      if (newValue !== value) {
        onChange(newValue);
      }

      // Snap to center
      container.scrollTo({
        top: clampedIndex * ITEM_HEIGHT,
        behavior: "smooth",
      });

      isScrollingRef.current = false;
    }, 100);
  }, [options, value, onChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate which item is in center for styling (Mobile)
  const getItemStyle = (optionValue: number) => {
    const isSelected = optionValue === value;
    return {
      opacity: isSelected ? 1 : 0.25,
      transform: isSelected ? "scale(1)" : "scale(0.7)",
      color: isSelected ? "#ffffff" : "#888888",
    };
  };

  return (
    <>
      {/* ========== MOBILE: Ghostly Scroll Wheel (visible < md) ========== */}
      <div className="md:hidden flex justify-center">
        <div className="relative flex items-center gap-3">
          {/* Holographic Drum Picker */}
          <div 
            className="relative h-65 w-30 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
            }}
          >
            {/* Scrollable List */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto scrollbar-hide scroll-smooth"
              style={{
                scrollSnapType: "y mandatory",
                paddingTop: "112px", // (288 - 64) / 2
                paddingBottom: "112px",
              }}
            >
              {options.map((opt) => {
                const isActive = opt === value;
                return (
                  <div
                    key={opt}
                    className={`h-16 flex items-center justify-end pr-8 font-display transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? "text-5xl font-black text-white scale-110" 
                        : "text-3xl font-bold text-white/20 scale-90"
                    }`}
                    style={{
                      scrollSnapAlign: "center",
                      filter: isActive ? "none" : "blur(1px)",
                    }}
                    onClick={() => {
                      onChange(opt);
                      const index = options.indexOf(opt);
                      containerRef.current?.scrollTo({
                        top: index * ITEM_HEIGHT,
                        behavior: "smooth",
                      });
                    }}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unit Label - Ghostly */}
          <span className="font-mono text-lg text-white/40 uppercase tracking-widest">min</span>
        </div>
      </div>

      {/* ========== DESKTOP: Horizontal Slider (visible >= md) ========== */}
      <div className="hidden md:block">
        <div className="flex flex-col gap-6">
          {/* Large Value Display */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-7xl lg:text-8xl font-bold text-acid">
              {value}
            </span>
            <span className="font-mono text-lg text-concrete uppercase">min</span>
          </div>

          {/* Horizontal Range Slider */}
          <div className="relative w-full max-w-md">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value, 10))}
              className="w-full h-2 appearance-none cursor-pointer bg-transparent rounded-full"
              style={{
                background: `linear-gradient(to right, #D4FF00 0%, #D4FF00 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            {/* Min/Max Labels */}
            <div className="flex justify-between mt-3 font-mono text-xs text-concrete/60">
              <span>{min} min</span>
              <span>{max} min</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
