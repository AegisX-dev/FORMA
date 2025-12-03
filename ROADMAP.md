# FORMA Roadmap

> From MVP to Startup-Ready

---

## 📋 Overview

This document outlines the development roadmap from **v1.0** (current) through **v1.1** (The Patch) to **v2.0** (The Upgrade), based on user feedback and technical debt analysis.

---

## 🚨 Phase 1: Critical Fixes — v1.1 "The Patch"

> **Priority:** IMMEDIATE  
> **Goal:** Fix breaking issues before adding features  
> **Status:** ✅ RELEASED (December 3, 2025)

| Source   | Issue                   | Problem                                                              | Solution                                                                                                  | Status |
| -------- | ----------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------ |
| User #10 | Random Errors / Timeout | Users see errors, retry works. Vercel/Gemini hits 10s timeout limit. | **Vadim's Optimization:** Filter exercises in Supabase first to reduce payload size before sending to AI. | ✅ |
| User #7  | "Always 4 Days" Bug     | App generates 4 days even if user selects 3. Prompt logic is weak.   | **Prompt Engineering:** Strict enforcement in `prompts.ts` with explicit day count validation.            | ✅ |
| Tariq    | Unresponsive Scrolling  | Page freezes after generation.                                       | **DOM Cleanup:** Fix anime.js ghost element issue — ensure proper cleanup on unmount.                     | ✅ |
| Vadim    | Terminology Error       | Docs say "RAG" but implementation is actually "Context Injection."   | **Docs Update:** Correct terminology in README.md to be technically accurate.                             | ✅ |
| Noor     | Latency Complaint       | "Loading feels slow" (40s+).                                         | **SQL Optimization + Gemini 2.0:** Reduced to ~8s response time.                                          | ✅ |

---

## 🎨 Phase 2: UX Polish — v1.2 "The Professional"

> **Priority:** HIGH  
> **Goal:** Make the app feel premium

| Source      | Feature               | Implementation                                                                                                           |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| User #3     | Session Scroll Wheel  | Replace raw number input with a custom **Dial** or **Slider** component for session duration.                            |
| User #2     | Multi-Goal Selection  | Allow users to select "Hypertrophy" AND "Strength" simultaneously. Update System Prompt to handle hybrid training logic. |
| User #4, #5 | Visual Tweaks         | The "Void" aesthetic is too dark/harsh on some screens. Soften contrast and improve color grading.                       |
| README      | Mobile Responsiveness | Ensure Slider and Cards render perfectly on iPhone SE and Android devices.                                               |

---

## 🏋️ Phase 3: Content Expansion — v1.3 "The Value"

> **Priority:** MEDIUM  
> **Goal:** Make workout plans actually better

| Source   | Feature         | Implementation                                                                      |
| -------- | --------------- | ----------------------------------------------------------------------------------- |
| User #6  | Demo Videos     | Add a "Watch" button to exercise cards that links to `video_url` field in database. |
| User #11 | More Exercises  | Add 20+ exercises to cover gaps: **Abs**, **Forearms**, specific machines.          |
| README   | Admin Dashboard | Build a simple `/admin` page to add exercises without writing SQL scripts.          |

---

## 🚀 Phase 4: The Startup Pivot — v2.0 "The Upgrade"

> **Priority:** FUTURE  
> **Goal:** Transform from tool to platform  
> **Prerequisite:** v1.x must be stable first

| Source  | Feature              | Technical Requirement                                                                              |
| ------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| README  | User Authentication  | Implement **Supabase Auth** (Google Login, Email/Password).                                        |
| User #8 | Tracker & Progress   | New `user_logs` table to save daily workout completions. Matches README "History & Progress" item. |
| User #1 | Diet Generator       | Entirely new AI prompt logic + new `foods` database table. Major feature expansion.                |
| README  | Weekly Periodization | Move from single plan generation to **4-Week Progressive Overload Cycles**.                        |
| Amrith  | Chat/Edit Feature    | Allow users to "talk" to their plan to swap exercises via conversational UI.                       |

---

## 🗑️ Rejected Ideas

| Source  | Suggestion         | Reason                                                                                                                                                    |
| ------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User #9 | Train Custom Model | **Rejected.** Too expensive and rigid. Our Context Injection approach is superior for this use case — faster iteration, lower cost, no training required. |

---

## 📊 Release Timeline

```
v1.0 ──────────────────────────────────────────────────────── ✅ RELEASED
  │   December 2, 2025
  │
v1.1 "The Patch" ─────────────────────────────────────────── ✅ RELEASED
  │   December 3, 2025
  │   • Timeout fixes (40s → 8s)
  │   • 4-day bug fix (strict prompt)
  │   • DOM cleanup (ghost form)
  │   • Days selector UI
  │   • SQL filter optimization
  │
v1.2 "The Professional" ──────────────────────────────────── 📋 PLANNED
  │   • Duration slider
  │   • Multi-goal selection
  │   • Visual polish
  │   • Mobile responsive
  │
v1.3 "The Value" ─────────────────────────────────────────── 📋 PLANNED
  │   • Exercise videos
  │   • 20+ new exercises
  │   • Admin dashboard
  │
v2.0 "The Upgrade" ───────────────────────────────────────── 🔮 FUTURE
      • User authentication
      • Progress tracking
      • Diet generation
      • Weekly programs
      • Chat interface
```

---

## 📜 License

Copyright © 2025 Forma. All rights reserved.

---

<p align="center">
  <strong>FORMA Roadmap</strong><br>
  <sub>Building the future of AI fitness programming.</sub>
</p>
