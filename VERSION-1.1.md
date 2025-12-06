# FORMA v1.1 — Release Summary

> **Release Date:** December 3, 2025  
> **Codename:** The Patch  
> **Security Patch:** December 3, 2025 (CVE-2025-55182)  
> **Status:** ⚠️ SUPERSEDED by [v1.2](VERSION-1.2.md)

---

## 🎯 Overview

Version 1.1 is a critical patch release focused on **performance**, **logic fixes**, and **UX improvements** based on real user feedback. This release reduces API latency by ~80% and fixes multiple breaking bugs.

**Live Demo:** [forma-two.vercel.app](https://forma-two.vercel.app/)

---

## ✅ Issues Fixed

| Source   | Category        | Issue                                 | Solution                                                        | Status       |
| -------- | --------------- | ------------------------------------- | --------------------------------------------------------------- | ------------ |
| User #10 | ⚡ Performance  | Random Errors / Timeout (49s → crash) | Switched to `gemini-2.0-flash` + SQL payload optimization       | ✅ FIXED     |
| User #7  | 🧠 Logic        | "Always 4 Days" Bug                   | Strict day count enforcement in System Prompt                   | ✅ FIXED     |
| Tariq    | 🐞 Bug          | Unresponsive Scrolling                | Ghost form removal via `display: none` after animation          | ✅ FIXED     |
| Vadim    | ⚙️ Architecture | SQL Optimization                      | `.overlaps()` filter + case normalization (DUMBBELL → Dumbbell) | ✅ DONE      |
| Noor     | ⚡ Performance  | "Loading feels slow"                  | Latency reduced from 40s+ to ~8s                                | ✅ MITIGATED |

---

## 🔧 Technical Changes

### 1. Supabase Query Optimization

**Before:**

```typescript
// Fetched ALL exercises (32 rows)
const { data } = await supabase.from("exercises").select("*");
```

**After:**

```typescript
// Filter by user's equipment + case normalization
const formattedEquipment = userEquipment.map(
  (item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
);

const { data } = await supabase
  .from("exercises")
  .select("readable_id, name, target_muscle, equipment, science_note")
  .overlaps("equipment", formattedEquipment);
```

**Impact:** Reduced token payload by 50-70%, faster Gemini response.

---

### 2. Strict Prompt Constraints

Added `STRICT RULES` section to AI prompt:

```
═══════════════════════════════════════════════════════════
STRICT RULES (MUST FOLLOW — NO EXCEPTIONS):
═══════════════════════════════════════════════════════════
1. DAYS CONSTRAINT: Generate EXACTLY X days. Not X+1, not X-1.
2. EXERCISE IDS: ONLY use IDs from DATA SOURCE.
3. VOLUME: Each day MUST contain 4-6 exercises.
```

**Impact:** Eliminated "always 4 days" bug, ensured proper volume per session.

---

### 3. DOM Cleanup Fix

**Before:**

```typescript
// Form remained in DOM (invisible but blocking clicks)
animate(formRef.current, { opacity: 0 });
```

**After:**

```typescript
// Form completely removed after animation
animate(formElement, {
  opacity: 0,
  onComplete: () => {
    formElement.style.display = "none";
  },
});
```

**Impact:** Fixed unresponsive scrolling, results now fully interactive.

---

### 4. Days Per Week Selector

Added new UI component:

- **State:** `daysPerWeek` (default: 3)
- **Options:** [3, 4, 5, 6] days
- **Styling:** Inline styles for reliable background color

**Impact:** Users can now select training frequency (was hardcoded to 4).

---

## 📊 Performance Metrics

| Metric            | v1.0                   | v1.1        | Improvement       |
| ----------------- | ---------------------- | ----------- | ----------------- |
| API Response Time | 40-49s (timeout)       | ~8s         | **80% faster**    |
| Token Usage       | ~2000 tokens           | ~800 tokens | **60% reduction** |
| Error Rate        | High (timeout crashes) | Low         | **Stable**        |

---

## 📁 Files Changed

```
src/
├── app/
│   ├── api/generate-plan/route.ts  # SQL filter + case normalization
│   └── page.tsx                     # Days selector + DOM cleanup
└── lib/
    └── gemini.ts                    # Strict prompt rules + volume constraint
```

---

## 🚀 Deployment

```bash
git add .
git commit -m "Release v1.1: Perf fix (Gemini 2.0), Logic fix (SQL Filter), UX fix (Scroll bug)"
git push origin main
```

Deployed via Vercel auto-deploy on push to `main`.

---

## 🔮 What's Next (v1.2)

- [ ] Duration slider component
- [ ] Multi-goal selection (Hypertrophy + Strength)
- [ ] Visual polish (softer contrast)
- [ ] Mobile responsiveness improvements

---

## 🔒 Security Update (December 3, 2025)

| CVE ID         | Severity    | Type                        | Action                                                  |
| -------------- | ----------- | --------------------------- | ------------------------------------------------------- |
| CVE-2025-55182 | 🔴 Critical | Remote Code Execution (RCE) | Upgraded Next.js 16.0.6 → 16.0.7, React 19.2.0 → 19.2.1 |

See [SECURITY.md](SECURITY.md) for full security policy.

---

## 📜 License

Copyright © 2025 Forma. All rights reserved.

---

<p align="center">
  <strong>FORMA v1.1 — The Patch</strong><br>
  <sub>Faster. Smarter. More Reliable.</sub>
</p>
