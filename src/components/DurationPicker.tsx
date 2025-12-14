"use client";

import { useEffect, useRef, useState } from "react";

interface DurationPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

// Constants - must match CSS exactly
const ITEM_HEIGHT = 64; // h-16 = 4rem = 64px
const CONTAINER_HEIGHT = 256; // h-64 = 16rem = 256px

export default function DurationPicker({
  value,
  onChange,
  min = 20,
  max = 120,
  step = 5,
}: DurationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    // Calculate initial index from value
    return Math.round((value - min) / step);
  });

  // Generate duration options
  const options: number[] = [];
  for (let i = min; i <= max; i += step) {
    options.push(i);
  }

  // Calculate padding to center first/last items
  const paddingY = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

  // FIX #1: Scroll to initial value on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate scroll position: (value - min) / step * itemHeight
    const index = Math.round((value - min) / step);
    const scrollTop = index * ITEM_HEIGHT;
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      container.scrollTo({ top: scrollTop, behavior: "auto" });
      setActiveIndex(index);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Scroll to value when it changes externally (not from user scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isUserScrolling.current) return;

    const index = Math.round((value - min) / step);
    const scrollTop = index * ITEM_HEIGHT;
    container.scrollTo({ top: scrollTop, behavior: "smooth" });
    setActiveIndex(index);
  }, [value, min, step]);

  // FIX #2: Simple onScroll handler with reliable index calculation
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    
    // Calculate active index from scroll position
    const newIndex = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(newIndex, options.length - 1));
    
    // Update visual highlight immediately
    setActiveIndex(clampedIndex);
    
    // Mark as user scrolling
    isUserScrolling.current = true;

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Debounce: Update value and snap when scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      const newValue = options[clampedIndex];
      
      if (newValue !== value) {
        onChange(newValue);
      }

      // Snap to exact position
      container.scrollTo({
        top: clampedIndex * ITEM_HEIGHT,
        behavior: "smooth",
      });

      isUserScrolling.current = false;
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* ========== MOBILE: Ghostly Scroll Wheel (visible < md) ========== */}
      <div className="md:hidden flex justify-center">
        <div className="relative flex items-center gap-3">
          {/* Holographic Drum Picker */}
          <div 
            className="relative h-64 w-32 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
            }}
          >
            {/* Scrollable List */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto scrollbar-hide"
              style={{
                scrollSnapType: "y mandatory",
                scrollBehavior: "smooth",
                paddingTop: `${paddingY}px`,
                paddingBottom: `${paddingY}px`,
              }}
            >
              {options.map((opt, index) => {
                const isActive = index === activeIndex;
                return (
                  <div
                    key={opt}
                    className={`h-16 flex items-center justify-center font-display transition-all duration-200 cursor-pointer snap-center ${
                      isActive 
                        ? "text-5xl font-black text-white scale-110 opacity-100" 
                        : "text-3xl font-bold text-white/20 scale-90"
                    }`}
                    style={{
                      filter: isActive ? "none" : "blur(1px)",
                    }}
                    onClick={() => {
                      onChange(opt);
                      setActiveIndex(index);
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
