# Changelog

All notable changes to FORMA will be documented in this file.

---

## [1.2.1] — 2025-12-09 — "The Ironclad"

> **Focus:** Production-grade stability and user engagement

### 🛡️ Backend & Stability

#### API Key Rotation (Failover Engine)

- Implemented 3-key rotation system (`GEMINI_API_KEY_1`, `_2`, `_3`)
- Automatically bypasses 429 Rate Limit errors by switching to backup keys
- Console logging shows which key is active: `✓ Success with Key 1 (Primary)`

#### Payload Optimization

- Refactored AI context injection to "minify" Supabase data
- Now sends only `{id, name, muscle}` instead of full exercise objects
- **Result:** ~60% token reduction, faster `gemini-2.5-flash` responses

#### Crash Prevention

- Added comprehensive `try/catch` guards in `page.tsx` and `route.ts`
- App no longer white-screens on 500 errors
- Graceful "System Busy" UI states with user-friendly messaging
- Specific messaging for 429 errors: "⚠️ AI System Busy. Please wait 60s and try again."

#### Supabase Fix

- Disabled session persistence (`persistSession: false`) in `supabase.ts`
- Fixes "Access to storage is not allowed" error in privacy browsers
- Works in incognito mode and strict privacy browser configurations

### 🧠 UX & Engagement

#### Intel Loader (New Feature)

- Replaced generic loading spinner with **Goal-Based Science Feed**
- Users see relevant science tips while waiting (~15-30s generation time)
- Tips are specific to selected goal(s):
  - **Hypertrophy:** "Control the eccentric phase for 3 seconds..."
  - **Strength:** "Rest 3-5 minutes on heavy compounds..."
  - **Endurance:** "Short rest periods increase metabolic capacity..."
- Hybrid mode shows combined tips from all selected goals

#### Visual Feedback

- **Pulsating Core Animation:** CSS `@keyframes breathe` for heartbeat effect
- **Spinning Dashed Ring:** Subtle rotation animation
- **Corner Brackets:** Tactical HUD aesthetic
- Tips cycle every **4 seconds** with instant swap animation

### 📁 Files Changed

```
src/
├── app/
│   ├── api/generate-plan/route.ts  # API key rotation, error handling
│   ├── page.tsx                    # Error states, Intel Loader integration
│   └── globals.css                 # @keyframes breathe animation
├── components/
│   └── IntelLoader.tsx             # NEW — Goal-based science tips loader
└── lib/
    ├── supabase.ts                 # persistSession: false
    └── gemini.ts                   # Removed old API key check
```

### 🔧 Environment Variables

```env
# Before (v1.2)
GEMINI_API_KEY=your_key

# After (v1.2.1) — Supports up to 3 keys for failover
GEMINI_API_KEY_1=your_primary_key
GEMINI_API_KEY_2=your_backup_key      # Optional
GEMINI_API_KEY_3=your_tertiary_key    # Optional
```

---

## [1.2.0] — 2025-12-06 — "The Professional"

> **Focus:** UX polish and premium feel

### Added

- 🎡 **Adaptive Duration Picker** — iOS-style drum wheel (mobile) + horizontal slider (desktop)
- 🎯 **Multi-Goal Selection** — Select "Hypertrophy + Strength" for hybrid training
- 🌌 **Interactive Grid Background** — Cursor-tracking spotlight effect
- 📱 **Mobile Responsiveness** — Tap-to-toggle tooltips, responsive fonts
- 📄 **High-Contrast PDF** — Larger fonts, darker text for gym readability

### Changed

- WorkoutCard tooltips now use `onClick` instead of hover for mobile
- PDF generation uses larger font sizes and darker colors

---

## [1.1.0] — 2025-12-03 — "The Patch"

> **Focus:** Critical bug fixes

### Fixed

- ⏱️ **Timeout Issues** — SQL filtering in Supabase reduces payload size
- 🗓️ **"Always 4 Days" Bug** — Strict prompt enforcement for day count
- 📜 **Scroll Freeze** — Fixed anime.js ghost element cleanup

### Added

- Days selector UI (3, 4, 5, 6 days)
- 30+ new exercises covering Abs, Forearms, and machines

---

## [1.0.0] — 2025-12-02 — "Genesis"

> **Focus:** Initial release

### Features

- AI-powered workout plan generation
- Goal selection (Hypertrophy, Strength, Endurance)
- Equipment filtering
- PDF export
- Science notes for each exercise

---

<p align="center">
  <sub>FORMA Changelog — Tracking the evolution of AI fitness programming.</sub>
</p>
