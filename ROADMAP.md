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
> **Goal:** Make the app feel premium  
> **Status:** ✅ RELEASED (December 6, 2025)

| Source      | Feature               | Implementation                                                                                      | Status |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------- | ------ |
| User #3     | Session Scroll Wheel  | Adaptive **Duration Picker** — iOS-style drum wheel (mobile) + horizontal slider (desktop).         | ✅     |
| User #2     | Multi-Goal Selection  | Allow users to select "Hypertrophy" AND "Strength" simultaneously. Hybrid training prompt logic.    | ✅     |
| Design Team | Interactive Grid      | Replace static background with **Cursor-Tracking Spotlight Grid** using CSS variables + mask-image. | ✅     |
| README      | Mobile Responsiveness | Responsive fonts, tap-to-toggle tooltips, high-contrast PDF, improved WorkoutCard layout.           | ✅     |

---

## 🛡️ Phase 2.1: Stability Patch — v1.2.1 "The Ironclad"

> **Priority:** CRITICAL  
> **Goal:** Production-grade stability and UX engagement  
> **Status:** ✅ RELEASED (December 9, 2025)

| Category    | Feature              | Implementation                                                                                | Status |
| ----------- | -------------------- | --------------------------------------------------------------------------------------------- | ------ |
| Stability   | API Key Rotation     | Failover engine rotates through 3 API keys (`GEMINI_API_KEY_1/2/3`) to bypass 429 rate limits | ✅     |
| Performance | Payload Optimization | Minified AI context (ID, Name, Muscle only) — **60% token reduction**                         | ✅     |
| Performance | Model Upgrade        | Switched to **Gemini 2.5 Flash Lite** — latency reduced from ~25s to ~10s                     | ✅     |
| Stability   | Crash Prevention     | `try/catch` guards in `page.tsx` + `route.ts` — graceful "System Busy" UI states              | ✅     |
| Stability   | Supabase Fix         | Disabled `persistSession` for privacy browsers (incognito mode support)                       | ✅     |
| UX          | Intel Loader         | Goal-based science tips feed during loading with pulsating core animation                     | ✅     |
| UX          | Instant Tips         | Tips cycle every 4s with instant swap animation                                               | ✅     |
| Design      | Visual Polish        | **Refined Brutalism** — micro-radii (`rounded-sm`) applied per user feedback (Mahesh)         | ✅     |

---

## 🏋️ Phase 3: Content Expansion — v1.3 "The Value"

> **Priority:** MEDIUM  
> **Goal:** Increase plan variety and retention

| Source       | Issue               | Description                                                            | Status             |
| :----------- | :------------------ | :--------------------------------------------------------------------- | :----------------- |
| **User #11** | **More Exercises**  | **Add 20+ exercises to cover gaps: Abs, Forearms, specific machines.** | **✅ DONE (v1.1)** |
| User #6      | Demo Videos         | Add "Watch" button linking to video tutorials.                         | 📋 Planned         |
| **Internal** | **Admin Dashboard** | **Neural Ingestor: AI-powered PDF parsing for bulk exercise uploads.** | **✅ DONE (v1.3)** |

---

## 🏗️ Phase 3.1: Zero-Fund Architecture — v1.3.1 "The Architect"

> **Priority:** HIGH  
> **Goal:** Achieve $0 operating costs through intelligent caching  
> **Status:** ✅ RELEASED (December 14, 2025)

| Category     | Feature           | Implementation                                                  | Status |
| ------------ | ----------------- | --------------------------------------------------------------- | ------ |
| Architecture | DNA Hashing       | Deterministic SHA-256 input hashing for cache key generation    | ✅     |
| Performance  | Zero-Fund Caching | Cache-first API route — **~90% reduction** in Gemini API costs  | ✅     |
| Database     | Input Hash Index  | B-Tree indexed `input_hash` column for O(1) lookups             | ✅     |
| DevEx        | Cache Logging     | Console output: `⚡ CACHE HIT` vs `🤖 CACHE MISS` for debugging | ✅     |

---

## 🌐 Phase 3.5: Open Source Governance

> **Priority:** HIGH  
> **Goal:** Establish community standards and contribution workflows  
> **Status:** 🟡 IN PROGRESS

| Category   | Item                      | Description                                           | Status |
| ---------- | ------------------------- | ----------------------------------------------------- | ------ |
| Governance | Public Repo Migration     | Repository moved from Private to Public on GitHub     | ✅     |
| Governance | MIT License               | Permissive open source license for community adoption | ✅     |
| Governance | Contributing Guidelines   | `CONTRIBUTING.md` with PR standards and code style    | ✅     |
| Governance | Environment Template      | `.env.example` for secure onboarding                  | ✅     |
| DevEx      | Community Issue Templates | Bug report and feature request templates              | 📋     |
| CI/CD      | PR Checks Pipeline        | Automated linting and build verification on PRs       | 📋     |

---

## 🔮 Phase 4: The Startup Pivot — v2.0 "The Upgrade"

> **Priority:** FUTURE  
> **Goal:** User Retention & Monetization (Requires Auth)

| Source     | Feature                    | Technical Requirement                                                    |
| :--------- | :------------------------- | :----------------------------------------------------------------------- |
| **Friend** | **Custom Split Selection** | **Allow users to define specific muscles per day (e.g., Day 1: Chest).** |
| User #8    | Tracker & History          | Requires `user_logs` table & Supabase Auth.                              |
| User #1    | Diet Generator             | New AI Prompt + `foods` database.                                        |
| Amrith     | Chat/Edit                  | Interface to "Swap" exercises via chat.                                  |

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
v1.2 "The Professional" ──────────────────────────────────── ✅ RELEASED
  │   December 6, 2025
  │   • Adaptive Duration Picker (mobile wheel + desktop slider)
  │   • Multi-Goal Hybrid Training
  │   • Interactive Grid Background
  │   • Mobile Responsiveness & High-Contrast PDF
  │
v1.2.1 "The Ironclad" ────────────────────────────────────── ✅ RELEASED
  │   December 9, 2025
  │   • API Key Rotation (3-key failover for rate limits)
  │   • 60% Token Reduction (minified AI payload)
  │   • Crash Prevention (graceful error handling)
  │   • Intel Loader (goal-based science tips)
  │
v1.3 "The Brain" ─────────────────────────────────────────── ✅ RELEASED
  │   December 12, 2025
  │   • Admin Dashboard (PIN-protected /admin route)
  │   • Neural Ingestor (AI-powered PDF → DB pipeline)
  │   • Smart Deduplication (prevents duplicate exercises)
  │   • Batch Processing (100k+ chars in <10s)
  │v1.3.1 "The Architect" ───────────────────────────── ✅ RELEASED
  │   December 14, 2025
  │   • Zero-Fund Caching (DNA Hashing)
  │   • ~90% API cost reduction
  │   • Open Source Launch (MIT License)
  │   • Contributing Guidelines
  │v1.4 "The Value" ─────────────────────────────────────────── 📋 PLANNED
  │   • Exercise videos
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

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>FORMA Roadmap</strong><br>
  <sub>Building the future of AI fitness programming.</sub>
</p>
