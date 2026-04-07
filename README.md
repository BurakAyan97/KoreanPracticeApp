# Korean Practice App

A premium, fast, frontend-only Korean language learning application built for Turkish-speaking learners.

## Features
- **Grammar Lessons**: Color-coded syntax breakdown (Roots, Particles, Verb Endings) mapped directly to Turkish explanations.
- **Flashcards**: Interactive 3D flip cards with Native and Sino-Korean numbers, verbs, and nouns.
- **Story Engine**: A 100% deterministic, local "Mad-Libs" style engine that generates grammatically correct Korean sentences and matches them with Turkish translations using learned vocabulary.

## Tech Stack
- Frontend: React 19 + TypeScript
- Build Tool: Vite
- Routing: React Router v7
- Icons: Lucide React
- CSS: Vanilla CSS with HSL variables (Glassmorphism layout)

## Local Development

```bash
# Install dependencies
npm install

# Start the local development server (Vite)
npm run dev

# Run TypeScript compilation check
npm run build

# Run linter
npm run lint
```

## Deployment (Netlify)

This project is optimized for static hosting on Netlify. It includes a `public/_redirects` file which is absolutely essential for React Router to function properly as a Single Page Application (SPA).

1. Connect your GitHub repository to Netlify.
2. Build Settings:
   - **Framework**: Vite
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Hit Deploy! 

*(No backend configuration or environment variables are required, the app is 100% client side).*
