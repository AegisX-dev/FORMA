# FORMA

> Sculpted by Science. Architected by AI.

<p align="center">
  <strong>Science-backed fitness programs generated in seconds.</strong>
</p>

---

## ✨ What is FORMA?

FORMA uses **Gemini AI** to create personalized workout plans based on your goals, available time, and equipment. Each exercise includes science notes explaining _why_ it's in your program.

## 🛠 Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Framework  | Next.js 14+ (App Router) |
| Styling    | Tailwind CSS             |
| Database   | Supabase                 |
| AI         | Google Gemini            |
| Animations | Anime.js                 |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/generate-plan/   # AI workout generation endpoint
│   └── page.tsx             # Main interface
├── components/
│   └── WorkoutCard.tsx      # Exercise display with tooltips
└── lib/
    ├── supabase.ts          # Database client
    └── gemini.ts            # AI client + prompt engineering
```

## ⚡ Features

- **Goal Selection** — Hypertrophy, Strength, or Endurance
- **Smart Programming** — AI selects exercises from your database
- **Science Notes** — Hover to see why each exercise is included
- **PDF Export** — Download your blueprint for offline use

---

<p align="center">
  <sub>Built with 🧠 and 💪</sub>
</p>
