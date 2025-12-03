# FORMA v1.0 — Release Summary

> **Release Date:** December 2, 2025  
> **Codename:** Genesis

---

## 🎯 Overview

Version 1.0 marks the initial public release of FORMA — an AI-powered workout architecture system that generates science-backed fitness programs in seconds.

**Live Demo:** [forma-two.vercel.app](https://forma-two.vercel.app/)

---

## ✨ Core Features

| Feature                    | Description                                                         |
| -------------------------- | ------------------------------------------------------------------- |
| **Goal-Based Programming** | Three training modes: Hypertrophy, Strength, Endurance              |
| **AI Exercise Selection**  | Gemini Flash AI selects optimal exercises based on user constraints |
| **Science Notes**          | Each exercise includes research-backed explanations on hover        |
| **Equipment Filtering**    | Support for Barbell, Dumbbell, Cables, and Bodyweight               |
| **Session Duration**       | Customizable workout length (in minutes)                            |
| **PDF Export**             | Download workout blueprints for offline use                         |
| **Dynamic Loading**        | Tactical loading sequence masks API latency                         |

---

## 🏗 Architecture

### Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI Engine:** Google Gemini Flash
- **Animations:** Anime.js v4
- **PDF Generation:** jsPDF
- **Deployment:** Vercel

### Design System — "Void Brutalism"

| Token      | Value     | Usage          |
| ---------- | --------- | -------------- |
| `void`     | `#050505` | Background     |
| `paper`    | `#111111` | Card surfaces  |
| `acid`     | `#D4FF00` | Primary accent |
| `concrete` | `#888888` | Muted text     |

**Typography:**

- Display: Syne (bold, uppercase)
- Mono: JetBrains Mono

---

## 🧠 Key Technical Decisions

### 1. Logic-Only AI Pattern

The AI returns **exercise IDs only** (integers), not content. All exercise names, instructions, and science notes are fetched from Supabase. This eliminates hallucinations and reduces token usage by ~90%.

### 2. Readable ID System

Uses integer `readable_id` instead of UUIDs for AI context. Reduces token consumption and improves Gemini response latency.

### 3. Hybrid RAG Pipeline

Research papers → NotebookLM extraction → Human review → Supabase storage. The AI never generates exercise content — it only orchestrates selection logic.

---

## 📊 Database

**Total Exercises:** 32 (Base 12 + Expansion Pack 20)

### Coverage by Muscle Group

| Muscle Group             | Exercise Count |
| ------------------------ | -------------- |
| Chest                    | 3              |
| Back                     | 5              |
| Legs (Quads/Glutes/Hams) | 8              |
| Shoulders                | 6              |
| Arms (Biceps/Triceps)    | 8              |
| Calves                   | 2              |

### Schema Highlights

- `exercises` table with RLS policies for public read access
- `generated_plans` table for caching AI responses
- GIN indexes on equipment arrays for fast filtering
- Full seed data in `src/sql/schema.sql`

---

## 📁 File Structure

```
src/
├── app/
│   ├── api/generate-plan/route.ts   # POST endpoint for AI generation
│   ├── page.tsx                      # Main UI with form + results
│   ├── layout.tsx                    # Root layout with noise overlay
│   └── globals.css                   # Tailwind base styles
├── components/
│   └── WorkoutCard.tsx               # Exercise card with tooltip
├── lib/
│   ├── supabase.ts                   # Supabase client
│   └── gemini.ts                     # Gemini client + prompt builder
└── sql/
    └── schema.sql                    # Database schema + seed data
```

---

## ⚠️ Known Limitations

| Limitation                                    | Status                          |
| --------------------------------------------- | ------------------------------- |
| Cold start latency (2-3s) on Vercel Free Tier | Mitigated with loading sequence |
| Static exercise database                      | Manual curation only            |
| No user authentication                        | Guest-only access               |
| No workout history                            | Single session only             |

---

## 🛣 Roadmap for v2.0

- [ ] User authentication (Supabase Auth)
- [ ] Workout history and progress tracking
- [ ] Admin dashboard for exercise management
- [ ] Weekly program generation (not just single sessions)
- [ ] Exercise video integration
- [ ] Mobile-responsive improvements

---

## 📜 License

Copyright © 2025 Forma. All rights reserved.

---

<p align="center">
  <strong>FORMA v1.0</strong><br>
  <sub>Sculpted by Science. Architected by AI.</sub>
</p>
