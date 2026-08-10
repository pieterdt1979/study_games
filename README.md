# Study Games

Interactive browser-based study tools for university-level mathematics and computer science. Each game is a self-contained HTML file — no build step, no framework, just open and play.

**Live site**: Deployed on Netlify from the `public/` folder.  
**Repository**: [github.com/pieterdt1979/study_games](https://github.com/pieterdt1979/study_games)

## Tech Stack

- Static HTML/CSS/JS (no framework)
- Express server (`server.js`) for local dev only
- Netlify deployment (`netlify.toml`)
- i18n support: English, Afrikaans, Zulu

## Running Locally

```bash
npm install
npm start
# Open http://localhost:3000
```

## Structure

```
public/
├── index.html          # Hub page with fuzzy search and 5 sections
├── css/style.css       # Shared responsive styles
├── js/                 # Shared JS (i18n loader, game-specific modules)
├── i18n/               # Translation JSON files per game
└── games/              # 27 self-contained game HTML files
```

## Current Games (27)

### Exam Trainers (2)

| Game | Description |
|------|-------------|
| `proof-trainer-discrete.html` | MAT3707 MCQ exam trainer — 32 questions, 5 options (A-E), full exam mode matching Oct/Nov 2025 paper |
| `proof-trainer-computation.html` | COS3701 MCQ exam trainer — 55 questions covering CFG, PDA, TM, decidability, plus procedural exam-style (Theorem 21, 42, CWL, ALAN, CNF steps, TM tracing) |

### Graph Theory (7)

| Game | Topic |
|------|-------|
| `graph-colouring.html` | Chromatic number, Brooks' theorem, 10 levels |
| `euler-hamilton.html` | Euler/Hamilton paths with degree analysis |
| `spanning-tree.html` | Kruskal's/Prim's, 6 levels, circuit detection |
| `isomorphism.html` | Vertex mapping, 8 levels |
| `planarity.html` | Drag-to-untangle, Euler formula, 10 levels |
| `circle-chord.html` | Non-planarity proofs (K5, K3,3, Petersen) |
| `trees.html` | BFS/DFS, traversals, m-ary properties |

### Counting & Combinatorics (10)

| Game | Topic |
|------|-------|
| `codebreaker.html` | Mastermind with counting connections |
| `counting-quiz.html` | 15 MCQ counting problems |
| `perms-combs-quiz.html` | Applied P(n,r)/C(n,r) problems |
| `binomial-identities.html` | Block walking, Pascal's triangle |
| `generating-functions.html` | OGF builder, 8 problems |
| `egf.html` | Exponential generating functions |
| `recurrence.html` | 9 problems, characteristic equations |
| `inclusion-exclusion.html` | Venn diagrams, derangements |
| `pigeonhole.html` | 8 problems with visual pigeons/holes |
| `permutation-cycles.html` | Cycle notation, transpositions, parity |

### Formal Languages & Automata (6)

| Game | Topic |
|------|-------|
| `regex-builder.html` | 8 regex challenges with auto-testing |
| `cfg-derivation.html` | 6 grammars, click-to-derive simulator |
| `cnf-converter.html` | Step-by-step CNF conversion (2 grammars) |
| `pda-simulator.html` | Animated stack execution, 3 PDAs |
| `pumping-lemma.html` | 4 languages, decompose + pump |
| `language-hierarchy.html` | 12 Chomsky hierarchy questions |

### Logic & Proofs (2)

| Game | Topic |
|------|-------|
| `natural-deduction.html` | 8 proofs (MP, MT, DS, HS, DN) |
| `proof-flashcards.html` | 7 proofs, step-ordering from shuffled options |

## Known Gaps

### Content Gaps (COS3701 exam coverage)

These are exam question types that the current tools don't fully cover:

| Exam Task | Marks | What's Missing |
|-----------|-------|----------------|
| Draw a DFA | 4 | No interactive DFA builder exists |
| Build a DPDA from spec | 10-14 | PDA simulator only runs pre-built PDAs; needs exam-style languages |
| Full pumping lemma proof | 12 | Only 4 practice languages; needs exam-style like {a^(n+1) b^(2n) a^(n-1)} |
| Build a Turing Machine | 12 | No TM construction tool at all |
| CNF conversion (full) | 6-8 | Only 2 practice grammars; needs 4-5 more from past papers |
| 2PDA tracing/completion | 6-14 | Not covered anywhere |

### Quick Wins

- Add 4-5 exam grammars to `cnf-converter.html`
- Add exam-style languages to `pumping-lemma.html`
- Add exam-style regex descriptions to `regex-builder.html`
- Add more DPDA languages to `pda-simulator.html`

### Translation Gaps

The site supports three languages (English, Afrikaans, Zulu) via JSON files in `public/i18n/`. Current status:

| Area | en | af | zu |
|------|----|----|-----|
| Hub page (`index.json`) | Complete | Complete | Complete |
| Game-specific i18n files | Partial | Partial | Partial |

Most game HTML files have `data-i18n` attributes on key elements (title, how-to-play, description) but the **inline question text and explanations are English-only**. Translating the question banks (especially the 55-question computation trainer and 32-question discrete trainer) would be a large effort.

Games with i18n JSON files but limited translation coverage:
- All 27 games have corresponding `.json` files in `public/i18n/`
- Hub-level text (titles, descriptions, unit labels) is translated in all 3 languages
- In-game content (questions, explanations, hints, theory boxes) is English-only across all games
- The `common.json` file provides shared UI strings (buttons, labels) in all 3 languages

**Priority for translation**: The hub page and game headers are already translated. The highest-impact next step would be translating the theory/explanation boxes in the Formal Languages games, since those contain exam-relevant conceptual content that Afrikaans-speaking students would benefit from reading in their home language.

## Design Principles

- One HTML file per game — no build step, no bundler
- Self-contained: each game works without the others
- Shared CSS only (`style.css`) — no shared JS frameworks
- Mobile-responsive (breakpoints at 768px and 480px)
- Pedagogical: success messages explain *why* the answer works, not just that it's correct

## Licence

Private educational project.
