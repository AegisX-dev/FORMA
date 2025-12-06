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
| User #10 | Random Errors / Timeout | Users see errors, retry works. Vercel/Gemini hits 10s timeout limit. | **Vadim's Optimization:** Filter exercises in Supabase first to reduce payload size before sending to AI. | ✅     |
| User #7  | "Always 4 Days" Bug     | App generates 4 days even if user selects 3. Prompt logic is weak.   | **Prompt Engineering:** Strict enforcement in `prompts.ts` with explicit day count validation.            | ✅     |
| Tariq    | Unresponsive Scrolling  | Page freezes after generation.                                       | **DOM Cleanup:** Fix anime.js ghost element via `display: none`.                                          | ✅     |
| Vadim    | Terminology             | Docs say "RAG" but strictly it is "Context Injection".               | Update README to use accurate architectural terminology.                                                  | ✅     |

---

## 🎨 Phase 2: UX Polish — v1.2 "The Professional"

> **Priority:** HIGH  
<<<<<<< HEAD
> **Goal:** Make the app feel premium  
> **Status:** ✅ RELEASED (December 6, 2025)

| Source      | Feature               | Implementation                                                                                                           | Status         |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------- |
| User #3     | Session Scroll Wheel  | Adaptive **Duration Picker** — iOS-style drum wheel (mobile) + horizontal slider (desktop).                              | ✅             |
| User #2     | Multi-Goal Selection  | Allow users to select "Hypertrophy" AND "Strength" simultaneously. Hybrid training prompt logic.                         | ✅             |
| Design Team | Interactive Grid      | Replace static background with **Cursor-Tracking Spotlight Grid** using CSS variables + mask-image.                      | ✅             |
| README      | Mobile Responsiveness | Responsive fonts, tap-to-toggle tooltips, high-contrast PDF, improved WorkoutCard layout.                                | ✅             |
=======
> **Goal:** Fix usability issues and make the app feel "Premium"  
> **Status:** 🚧 IN PROGRESS

| Source          | Issue                   | Problem                                                                 | Solution                                                                                   | Status |
| :-------------- | :---------------------- | :---------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- | :----- |
| **Mobile User** | **Mobile Overlap** | **Text overwrites itself on small screens and in PDF exports.** | **Responsiveness Fix:** Switch grid cols to 1 on mobile; fix PDF autoTable text wrapping.  | 🚧     |
| **Mobile User** | **Small Fonts** | **Users report text is hard to read (too small).** | **Readability Bump:** Increase base font scale by 10% (`text-sm` → `text-base`).           | 🚧     |
| User #3         | Session Scroll Wheel    | Text input for "Minutes" is ugly/hard to use.                           | Replace with a visual **Slider** or **Stepper** component.                                 | 📋     |
| User #2         | Multi-Goal Selection    | Users want "Hypertrophy + Strength".                                    | Update UI to allow multi-select and update Prompt logic to handle hybrid goals.            | 📋     |
| Design Team     | Visual Polish           | The "Void" theme is too harsh/dark.                                     | Soften the background contrast and adjust accent colors.                                   | 📋     |
>>>>>>> e41811d857374222a3f408998c35d01a5c2e050e

---

## 🏋️ Phase 3: Content Expansion — v1.3 "The Value"

> **Priority:** MEDIUM  
> **Goal:** Increase plan variety and retention

| Source       | Issue              | Description                                                            | Status             |
| :----------- | :----------------- | :--------------------------------------------------------------------- | :----------------- |
| **User #11** | **More Exercises** | **Add 20+ exercises to cover gaps: Abs, Forearms, specific machines.** | **✅ DONE (v1.1)** |
| User #6      | Demo Videos        | Add "Watch" button linking to video tutorials.                         | 📋 Planned         |
| Internal     | Admin Dashboard    | UI to add exercises without SQL access.                                | 📋 Planned         |

---

## 🔮 Phase 4: The Startup Pivot — v2.0 "The Upgrade"

> **Priority:** FUTURE  
> **Goal:** User Retention & Monetization (Requires Auth)

| Source | Feature | Technical Requirement |
| :--- | :--- | :--- |
| **Friend** | **Custom Split Selection** | **Allow users to define specific muscles per day (e.g., Day 1: Chest).** |
| User #8 | Tracker & History | Requires `user_logs` table & Supabase Auth. |
| User #1 | Diet Generator | New AI Prompt + `foods` database. |
| Amrith | Chat/Edit | Interface to "Swap" exercises via chat. |

---

## 📊 Release Timeline (Updated)

```text
v1.0 ──────────────────────────────────────────────────────── ✅ RELEASED
  │   December 2, 2025
  │
v1.1 "The Patch" ─────────────────────────────────────────── ✅ RELEASED
  │   December 3, 2025
  │   • Timeout fixes (SQL Filter)
  │   • 4-day bug fix (Strict Prompt)
  │   • Days selector UI
  │   • Data Expansion (30+ new exercises)
  │
v1.2 "The Professional" ──────────────────────────────────── 🚧 IN PROGRESS
  │   • Mobile Layout Fix (Text Overlap)
  │   • Readability Update (Font Size +10%)
  │   • Duration Slider
  │   • Multi-Goal Selection
  │
v1.3 "The Value" ─────────────────────────────────────────── 📋 PLANNED
  │   • Exercise videos
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
