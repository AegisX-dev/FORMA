# Contributing to FORMA

First off, thanks for taking the time to contribute! 🎉

FORMA is a "Zero-Fund" architecture project. We value efficiency, strict typing, and brutalist aesthetics.

## ⚡ Quick Start

1.  **Fork the repo** and clone it locally.
2.  **Install dependencies**: `npm install`
3.  **Set up Environment**: Copy `.env.example` to `.env.local` and add your keys.
4.  **Create a Branch**: `git checkout -b feature/amazing-feature`

## 📐 Architectural Standards

### 1. The "Zero-Fund" Rule

We operate on free tiers (Vercel, Supabase, Gemini Flash Lite).

- **Do not** introduce heavy dependencies without discussing them in an Issue.
- **Do not** remove caching layers. API calls cost tokens; DB reads are cheap.

### 2. Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict mode)
- **Database**: Supabase
- **AI**: Gemini 2.5 Flash Lite (Logic-Only pattern)
- **Styling**: Tailwind CSS v4 (Refined Brutalism system)

### 3. Design System: "Refined Brutalism"

We use a specific aesthetic:

- **Colors**: Void (`#050505`), Paper (`#111111`), Acid (`#D4FF00`).
- **Radii**: `rounded-sm` (2px). No large rounded corners.
- **Vibe**: Industrial, technical, high-contrast.

## 🚀 Pull Request Process

**⚠️ CRITICAL BRANCHING RULE:**

- **Target Branch:** You MUST submit your Pull Request to the **`dev`** branch.
- **Do NOT submit PRs to `main`.** The `main` branch is for production releases only. Any PR targeting `main` will be automatically closed.

### Checklist for Approval

1.  **Linting**: Ensure `npm run lint` passes before pushing.
2.  **Type Safety**: No `any` types allowed.
3.  **Conventional Commits**: Please use semantic commit messages:
    - `feat: add new strength algorithm`
    - `fix: resolve scrolling bug on mobile`
    - `docs: update README roadmap`

## 🛡️ Security

- **NEVER** commit environment variables.
- **NEVER** commit real user data.

## 📝 License

By contributing, you agree that your contributions will be licensed under its MIT License.
