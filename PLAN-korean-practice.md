# Project Plan: Korean Practice Web App

## Overview
A fast, frontend-only Korean language learning application for Turkish-speaking learners. The project consists of a grammar section (A1 & A2), flashcards with native Korean numbers support, and an interactive deterministic short content generator for level-appropriate reading. 

## Project Type
WEB Explicitly (Frontend-only, no backend).

## Success Criteria
1. Sub-100ms route transitions.
2. 100% Client-side operation (No backend/database).
3. Easily editable JSON/MD content architecture.
4. Clean deployment as a static site on Netlify.
5. High readability and UX with strong aesthetic appeal specifically optimized for Turkish-Korean bilingual reading.

## Tech Stack & Justifications
- **Core Framework**: Vite + React + TypeScript. *Justification: Vite provides the absolute fastest dev server and optimized production build for SPA static sites.*
- **Routing**: React Router (DOM) with Lazy Loading. *Justification: Code-splitting and dynamic imports via React.lazy will keep the initial bundle small as A1/A2 grammar data expands.*
- **Styling**: Vanilla CSS Modules. *Justification: Component-level isolation keeps styles predictable. A minimal `index.css` handles CSS variables, resets, and typography.*
- **State Management**: Minimal `localStorage` interaction for tracking flashcard mastery/completion state, the last opened deck, and current index. 
- **Content Strategy**: Static JSON / MD files loaded via dynamic imports. *Justification: Allows authoring grammar files without rebuilding the entire app if eventually moved to a public fetch, while remaining 100% static.*

## V1 Story Generation Strategy
**Constraint**: Free + No Backend + Netlify.
**Strategy**: "Pedagogical Mad-Libs" Engine. 
- **Implementation**: Instead of relying on a real LLM (which requires paid APIs or heavy in-browser models like WebLLM that ruin initial load time and battery life), we define `Sentence Templates` with slots (e.g., `[Subject] 은/는 [Location] 에 갑니다`).
- **Execution**: The engine randomly selects a template based on the grammar level, pulls words from the user's unlocked flashcard pool, handles post-positional particles (은/는, 이/가 based on batchim/final consonant), and outputs a completely deterministic story.
- **Future Proofing**: An `Adapter` pattern will wrap the generation logic (`generateStory(level)`). In V2, we can simply swap the `DeterministicGenerator` class with `WebLLMGenerator` or a free-tier API adapter without touching UI components.

## File Structure
```
/
├── public/
│   ├── _redirects         # Crucial for Netlify SPA routing
│   └── fonts/             # Legible Korean fonts (e.g. Noto Sans KR)
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/        # Navbar, Footer
│   │   ├── typography/    # Bilingual Text Block, Color-coded Grammar
│   │   └── flashcards/    # 3D Flip Card components
│   ├── content/
│   │   ├── grammar/       # A1.json, A2.json
│   │   ├── flashcards/    # fruits.json, numbers.json
│   │   └── story-templates/ # mad-libs JSON
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── GrammarMenu.tsx
│   │   ├── GrammarLesson.tsx
│   │   ├── FlashcardsMenu.tsx
│   │   ├── FlashcardDeck.tsx
│   │   ├── StoryBuilder.tsx
│   │   └── Contact.tsx
│   ├── utils/
│   │   ├── koreanParticles.ts # Batchim detection for 은/는/이/가
│   │   └── storyEngine.ts 
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
└── README.md
```

## Task Breakdown

### Task 1: Initialize Project & Core Infrastructure
- **Agent**: `frontend-specialist`
- **Skill**: app-builder
- **Priority**: P0
- **INPUT**: Vite React TS template initialization.
- **OUTPUT**: Running skeleton React app with React Router config, Netlify `_redirects`, and strict ESLint/TypeScript.
- **VERIFY**: Successful `npm run build` and smooth navigation between stub pages.

### Task 2: Implement Design System & Global Styles
- **Agent**: `frontend-specialist`
- **Skill**: frontend-design
- **Priority**: P1
- **INPUT**: User requirement for premium learner UX with strong typography.
- **OUTPUT**: `index.css` featuring premium gradients, CSS variables for color-coded grammar (e.g. roots vs particles), and imported Hangul fonts.
- **VERIFY**: UX audit via `ux_audit.py` passes; UI feels vibrant and spacing is consistent.

### Task 3: Content Data Architecture & Utilities
- **Agent**: `frontend-specialist`
- **Skill**: clean-code
- **Priority**: P1
- **INPUT**: Grammar and Flashcard mock data sets.
- **OUTPUT**: TypeScript interfaces for `GrammarLesson`, `FlashcardWord`, plus `koreanParticles.ts` utility.
- **VERIFY**: Unit tests check that batchim resolver correctly assigns 을 vs 를.

### Task 4: Flashcards Feature Implementation
- **Agent**: `frontend-specialist`
- **Skill**: frontend-design
- **Priority**: P2
- **INPUT**: Flashcards component specs (3D Flip, 20 items per deck).
- **OUTPUT**: `FlashcardsMenu` and `FlashcardDeck` components with lightweight CSS transitions.
- **VERIFY**: Clicking flips card; mobile touch targets > 44px.

### Task 5: Grammar Lessons Implementation
- **Agent**: `frontend-specialist`
- **Skill**: clean-code
- **Priority**: P2
- **INPUT**: Grammar feature requirements (color-coded bilingual explanations).
- **OUTPUT**: `GrammarLesson` page utilizing custom typography components to highlight roots and endings securely mapped to Turkish text.
- **VERIFY**: Content visually matches the A1/A2 learning specs without hardcoding in components.

### Task 6: Deterministic Story Engine (V1)
- **Agent**: `frontend-specialist`
- **Skill**: clean-code
- **Priority**: P2
- **INPUT**: Story builder specs (Mad-libs logic).
- **OUTPUT**: `StoryBuilder.tsx` and `storyEngine.ts` handling grammar injection and Turkish translation pairing.
- **VERIFY**: Clicking "Generate" yields grammatically sound, dynamic Korean outputs with 0 backend requests.

### Task 7: Contact Page & Final Polish
- **Agent**: `frontend-specialist`
- **Skill**: clean-code
- **Priority**: P3
- **INPUT**: Contact page requirements.
- **OUTPUT**: `Contact.tsx` containing social placeholders; README instructions updated.
- **VERIFY**: Forms exist (if any), mailto links are valid.

## ✅ Phase X: Final Verification
Must sequentially execute:
1. `npm run lint` & `tsc --noEmit`
2. `npm run build` validation
3. Manual Mobile/Responsive Emulation Review
4. Readme completeness check
5. Run tests (if applicable)

---
END OF PLAN
