"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const TARGET_MUSCLES = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Abs"] as const;
const EQUIPMENT_OPTIONS = ["Barbell", "Dumbbell", "Machine", "Cables", "Bodyweight"] as const;
const DIFFICULTY_OPTIONS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
] as const;

interface FormData {
  name: string;
  target_muscle: string;
  equipment: string[];
  difficulty_tier: number;
  science_note: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Neural Ingest state
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<{ count: number; exercises: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    target_muscle: "Chest",
    equipment: ["Barbell"],
    difficulty_tier: 2,
    science_note: "",
  });

  // PIN check on mount
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("forma_admin_auth");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  // Auto-focus name input after auth
  useEffect(() => {
    if (isAuthenticated && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isAuthenticated]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle file upload for Neural Ingest
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsIngesting(true);
    setIngestResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/ingest", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ingest failed");
      }

      setIngestResult({ count: data.count, exercises: data.exercises || [] });
      setToast({ 
        message: `✓ Success! ${data.count} exercises added to mainframe`, 
        type: "success" 
      });
    } catch (error) {
      console.error("Ingest error:", error);
      setToast({ 
        message: error instanceof Error ? error.message : "Ingest failed", 
        type: "error" 
      });
    } finally {
      setIsIngesting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN;
    
    if (!correctPin) {
      setToast({ message: "Admin PIN not configured", type: "error" });
      return;
    }
    
    if (pinInput === correctPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem("forma_admin_auth", "true");
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const handleEquipmentToggle = (item: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e: string) => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setToast({ message: "Exercise name required", type: "error" });
      return;
    }

    if (formData.equipment.length === 0) {
      setToast({ message: "Select at least one equipment type", type: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("exercises").insert({
        name: formData.name.trim(),
        target_muscle: formData.target_muscle,
        equipment: formData.equipment,
        difficulty_tier: formData.difficulty_tier,
        science_note: formData.science_note.trim() || null,
      });

      if (error) {
        throw error;
      }

      setToast({ message: "✓ Exercise Uploaded to Mainframe", type: "success" });
      
      // Reset form for rapid entry
      setFormData({
        name: "",
        target_muscle: formData.target_muscle, // Keep muscle selection
        equipment: formData.equipment, // Keep equipment selection
        difficulty_tier: formData.difficulty_tier, // Keep difficulty
        science_note: "",
      });
      
      // Re-focus name input for rapid entry
      nameInputRef.current?.focus();
    } catch (error) {
      console.error("Insert error:", error);
      setToast({ 
        message: error instanceof Error ? error.message : "Upload failed", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 font-mono text-sm">AUTHENTICATING...</div>
      </div>
    );
  }

  // PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-4">
          <div className="text-center mb-8">
            <div className="text-zinc-500 font-mono text-xs tracking-widest mb-2">
              FORMA ADMIN
            </div>
            <div className="text-zinc-300 font-mono text-sm">
              Enter Access Code
            </div>
          </div>

          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="••••"
            autoFocus
            className={`w-full bg-zinc-900 border ${
              pinError ? "border-red-500" : "border-zinc-700"
            } rounded-sm px-4 py-3 text-center text-zinc-100 font-mono text-2xl tracking-[0.5em] 
            placeholder:text-zinc-600 focus:outline-none focus:border-lime-500 transition-colors`}
          />

          {pinError && (
            <div className="text-red-500 text-xs font-mono text-center">
              ACCESS DENIED
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 
            rounded-sm px-4 py-3 text-zinc-300 font-mono text-sm tracking-wider 
            transition-colors focus:outline-none focus:border-lime-500"
          >
            AUTHENTICATE
          </button>
        </form>
      </div>
    );
  }

  // Main Admin Console
  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-sm font-mono text-sm z-50
          ${toast.type === "success" 
            ? "bg-lime-500/20 border border-lime-500 text-lime-400" 
            : "bg-red-500/20 border border-red-500 text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-zinc-100 font-mono text-lg tracking-wider">
                INPUT CONSOLE
              </h1>
              <p className="text-zinc-500 font-mono text-xs mt-1">
                Exercise Database Management
              </p>
            </div>
            <div className="text-lime-500 font-mono text-xs">● ONLINE</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exercise Name */}
          <div className="space-y-2">
            <label className="block text-zinc-400 font-mono text-xs tracking-wider">
              EXERCISE NAME
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Incline Dumbbell Press"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 
              text-zinc-100 font-mono placeholder:text-zinc-600 
              focus:outline-none focus:border-lime-500 transition-colors"
            />
          </div>

          {/* Target Muscle */}
          <div className="space-y-2">
            <label className="block text-zinc-400 font-mono text-xs tracking-wider">
              TARGET MUSCLE
            </label>
            <select
              value={formData.target_muscle}
              onChange={(e) => setFormData({ ...formData, target_muscle: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 
              text-zinc-100 font-mono focus:outline-none focus:border-lime-500 
              transition-colors cursor-pointer"
            >
              {TARGET_MUSCLES.map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment (Multi-select) */}
          <div className="space-y-2">
            <label className="block text-zinc-400 font-mono text-xs tracking-wider">
              EQUIPMENT <span className="text-zinc-600">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleEquipmentToggle(item)}
                  className={`px-4 py-2 rounded-sm font-mono text-sm transition-all
                  ${formData.equipment.includes(item)
                    ? "bg-lime-500/20 border border-lime-500 text-lime-400"
                    : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="block text-zinc-400 font-mono text-xs tracking-wider">
              DIFFICULTY TIER
            </label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty_tier: opt.value })}
                  className={`flex-1 px-4 py-2 rounded-sm font-mono text-sm transition-all
                  ${formData.difficulty_tier === opt.value
                    ? "bg-lime-500/20 border border-lime-500 text-lime-400"
                    : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Science Note / Instructions */}
          <div className="space-y-2">
            <label className="block text-zinc-400 font-mono text-xs tracking-wider">
              SCIENCE NOTE <span className="text-zinc-600">(optional)</span>
            </label>
            <textarea
              value={formData.science_note}
              onChange={(e) => setFormData({ ...formData, science_note: e.target.value })}
              placeholder="Why this exercise is effective..."
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 
              text-zinc-100 font-mono placeholder:text-zinc-600 resize-none
              focus:outline-none focus:border-lime-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-sm font-mono text-sm tracking-wider 
            transition-all focus:outline-none
            ${isSubmitting
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-lime-500 hover:bg-lime-400 text-zinc-900"
            }`}
          >
            {isSubmitting ? "UPLOADING..." : "UPLOAD TO MAINFRAME"}
          </button>
        </form>

        {/* Neural Ingest Section */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="mb-6">
            <h2 className="text-zinc-100 font-mono text-lg tracking-wider flex items-center gap-2">
              <span className="text-purple-400">◈</span> NEURAL INGEST
            </h2>
            <p className="text-zinc-500 font-mono text-xs mt-1">
              AI-powered bulk upload from PDF, CSV, or TXT
            </p>
          </div>

          <div className="space-y-4">
            {/* File Input */}
            <div 
              className={`relative border-2 border-dashed rounded-sm p-8 text-center transition-all
              ${isIngesting 
                ? "border-purple-500 bg-purple-500/5" 
                : "border-zinc-700 hover:border-zinc-500"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.csv"
                onChange={handleFileUpload}
                disabled={isIngesting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              
              {isIngesting ? (
                <div className="space-y-3">
                  <div className="text-purple-400 font-mono text-sm animate-pulse">
                    AI is analyzing document...
                  </div>
                  <div className="flex justify-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div 
                        key={i}
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-zinc-400 font-mono text-sm">
                    Drop file or click to upload
                  </div>
                  <div className="text-zinc-600 font-mono text-xs">
                    Supports: PDF, CSV, TXT
                  </div>
                </div>
              )}
            </div>

            {/* Ingest Result */}
            {ingestResult && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-mono text-xs">EXTRACTION COMPLETE</span>
                  <span className="text-lime-400 font-mono text-sm">
                    {ingestResult.count} exercises
                  </span>
                </div>
                
                {ingestResult.exercises.length > 0 && (
                  <div className="max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {ingestResult.exercises.slice(0, 10).map((name: string, i: number) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-sm 
                          text-zinc-400 font-mono text-xs"
                        >
                          {name}
                        </span>
                      ))}
                      {ingestResult.exercises.length > 10 && (
                        <span className="px-2 py-1 text-zinc-500 font-mono text-xs">
                          +{ingestResult.exercises.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-8 pt-4 border-t border-zinc-800">
          <div className="text-zinc-600 font-mono text-xs">
            <span className="text-zinc-500">TIP:</span> Press Tab to navigate, Enter to submit
          </div>
        </div>
      </div>
    </div>
  );
}
