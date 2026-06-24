# Plan: Korean Curriculum Enhancement

## Overview
This plan focuses on improving the grammar curriculum for A1 & A2 levels, expanding the flashcard categories, and replacing the existing reading stories with brand-new, vocabulary-dense content.

## Project Type
WEB (Vite + React + TypeScript SPA)

## Success Criteria
1. Re-sequenced and error-free A1 and A2 JSON grammar files.
2. Introduction of 4 new grammar lessons: A1 L5 (Informal Polite Present Tense), A2 L20 (Reason -기 때문에), A2 L21 (Beginning -기 시작하다), A2 L22 (Intention -(으)려고).
3. 3 new flashcard JSON files (daily_routines.json, restaurant_ordering.json, emotions_states.json) successfully rendering in the UI.
4. Expanded adjectives.json and verbs.json.
5. Brand new stories.json containing 6 rich, interactive reading practices using the new vocabulary.
6. 100% successful build (`npm run build`) and no ESLint/TypeScript compilation issues.

## Tech Stack
- React + TypeScript
- Vite
- JSON-based content dynamic imports

## File Structure
We will modify/add the following files:
```
/src
├── content/
│   ├── flashcards/
│   │   ├── daily_routines.json       # [NEW]
│   │   ├── restaurant_ordering.json  # [NEW]
│   │   ├── emotions_states.json      # [NEW]
│   │   ├── verbs.json                # [MODIFY]
│   │   └── adjectives.json           # [MODIFY]
│   ├── grammar/
│   │   ├── a1.json                   # [MODIFY]
│   │   └── a2.json                   # [MODIFY]
│   └── stories/
│       └── stories.json              # [MODIFY] (Replace all)
└── pages/
    └── FlashcardsMenu.tsx            # [MODIFY]
```

## Task Breakdown

### Task 1: Create New and Expanded Flashcards
- **Agent**: `frontend-specialist`
- **Skill**: `clean-code`
- **Priority**: P1
- **INPUT**: Vocab lists for Daily Routines, Restaurant Ordering, Emotions, and expansions for Verbs/Adjectives.
- **OUTPUT**: 3 new JSON files under `src/content/flashcards/` and modified `verbs.json` and `adjectives.json`.
- **VERIFY**: Check that the JSON formatting is correct and syntax is valid.

### Task 2: Register New Flashcards in UI
- **Agent**: `frontend-specialist`
- **Skill**: `react-best-practices`
- **Priority**: P1
- **INPUT**: The 3 new JSON files.
- **OUTPUT**: Modified `src/pages/FlashcardsMenu.tsx` which imports and registers the decks.
- **VERIFY**: The new decks are displayed in the application UI under the "Tüm Setler" section.

### Task 3: Revise and Add Grammar Lessons
- **Agent**: `frontend-specialist`
- **Skill**: `clean-code`
- **Priority**: P1
- **INPUT**: Proposed new lessons and lesson sequence.
- **OUTPUT**: Updated `a1.json` and `a2.json` with correct ordering, ids, and content.
- **VERIFY**: Run a Node.js verification script to ensure lessons have sequential `order` numbers and correct `id` keys.

### Task 4: Rewrite Reading Stories
- **Agent**: `frontend-specialist`
- **Skill**: `clean-code`
- **Priority**: P2
- **INPUT**: Custom story scenarios utilizing the new flashcard terms.
- **OUTPUT**: Complete rewrite of `src/content/stories/stories.json` with 6 detailed A1/A2 stories.
- **VERIFY**: Check that the stories are fully loaded by the UI and display bilingual pairs and sentence breakdown correctly.

### Task 5: Final Validation & Build Check
- **Agent**: `frontend-specialist`
- **Skill**: `lint-and-validate`
- **Priority**: P3
- **INPUT**: Fully updated code and files.
- **OUTPUT**: Passing build execution.
- **VERIFY**: Run `npm run lint && npx tsc --noEmit && npm run build` to confirm everything compiles clean.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: 2026-06-24
