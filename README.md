# TRONWELL KIDS GAME ZONE

A retro space arcade for English practice (students aged 10–16). Four short games (1–3 minutes each) share one content model, one scoring system and one progress profile:

| Game | Genre | Practises |
| --- | --- | --- |
| **Grammar Blaster** | Space shooter | Verb forms, auxiliaries, negatives, questions, tense choice |
| **Word Jumper** | Side-scrolling platformer | Vocabulary, word groups, spelling, picture words |
| **Tense Racer** | Lane racer with pit stops | Tense choice from context, word order |
| **English Detective** | Point-and-click mystery | Reading for detail, inference, dialogue |

It is a companion to the **Tronwell Kids Practice Zone** (`../tronwell_kids/index.html`, published at `laboratorio-cmd.github.io/tronwell-kids/`). That portal is a single static HTML file with no accounts or server, so the Game Zone is a separate static app meant to be published on the same GitHub Pages domain (`laboratorio-cmd.github.io/tronwell-game-zone/`). Both apps then share the browser storage of that domain.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # unit + content tests (Vitest)
npm run typecheck    # TypeScript strict mode
npm run validate:content
npm run build        # production build in dist/
npm run preview      # serve dist/ locally
```

Node 20+ is required (developed with Node 24).

## Student level

The games never invent a level and never treat arcade scores as a CEFR assessment. The level is resolved in this order (`src/services/level.ts`):

1. **Teacher link:** `?level=rocket` (any Practice Zone level id: `tiny`, `moon`, `rocket`, `planet`, `comet`, `galaxy`) or `?level=A2` (a CEFR code). It is remembered on the device.
2. **Practice Zone placement test:** the portal saves the result in `localStorage` key `twk2_level`. Because both sites live on `laboratorio-cmd.github.io`, the Game Zone reads it directly.
3. **Level chosen in Game Zone settings.** A newer placement test in the portal takes over again.
4. If nothing is known, the student is asked which Tronwell Kids level they are in.

Portal level → content band: Tiny Stars A0 · Moon Walkers A1 · Rocket Riders A1 · Planet Explorers A2 · Comet Chasers B1 · Galaxy Masters B2.

## Architecture

```
src/
  app/                 App shell, hash router (works as static files), AppContext (services)
  components/          PixelSprite, Modal
  features/
    lobby/             Arcade lobby with four cabinets + pilot card
    play/              PlayScreen (lifecycle), HUD, start/pause/results/error overlays, touch controls
    progress/          Student progress page
    settings/          Sound, music, motion, level
    level/             First-run level question (only when no level is known)
  games/
    registry.ts        The four GameDefinitions
    shared/            BaseScene, createGame, audio (Web Audio synth), input, store/channel, types
      pixel/           assets.ts (asset table, no Phaser), manifest.ts (loading), art.ts (original pixel art)
    grammar-blaster/   definition.ts + BlasterScene.ts
    word-jumper/       definition.ts + JumperScene.ts + levelGen.ts + spelling.ts
    tense-racer/       definition.ts + RacerScene.ts + PitStopPanel.tsx
    english-detective/ definition.ts + DetectiveScene.ts + DetectivePanel.tsx + caseMachine.ts
  education/
    types.ts           Content schema (CEFR levels, skill categories, item kinds, detective cases)
    content/           Content banks: one file per game and level
    questionEngine.ts  Selection, shuffling, answer checking, recent-content rotation
    validation/        Validator + tests over the whole bank
  services/
    progress/          ScoreKeeper, rewards (XP/coins/ranks), achievements, ProgressService, repository, stats
    level.ts, settings.ts, storage.ts
```

**React** renders menus, HUD, prompts, feedback, results and the two game panels (pit stop, case notebook). **Phaser 3** renders gameplay. They talk through a `GameBridge` (`src/games/shared/types.ts`): the scene writes HUD state into small external stores (no React re-render per frame), records answers through the shared `ScoreKeeper`, and calls `bridge.finish()` once. `PlayScreen` turns that into a `GameResult`, validates it and saves it with `ProgressService`.

Every game implements the same `GameDefinition` contract: metadata, `buildSession(level)` (content selection), `loadScene()` (lazy, so Phaser only downloads when a game starts) and an optional React panel.

Lifecycle: `intro → loading → playing ⇄ paused → results` (or `error`). Esc/P pauses, leaving the tab pauses, restart and quit destroy the Phaser instance, so a game never runs twice.

## Content

`src/education/content/<game>/<level>.ts`, all marked `status: 'draft'` (sample content written for the MVP, **not yet reviewed by a Tronwell teacher**; set `status: 'reviewed'` after review).

| Bank | A0 | A1 | A2 | B1 | B2 |
| --- | --- | --- | --- | --- | --- |
| Grammar Blaster (gap-fill) | 30 | 30 | 30 | 30 | 30 |
| Word Jumper (15 word groups + 15 spellings) | 30 | 30 | 30 | 30 | 30 |
| Tense Racer (18 gates + 12 word-order) | 30 | 30 | 30 | 30 | 30 |
| English Detective (cases) | 2 | 2 | 2 | 2 | 2 |

450 challenge items + 10 complete cases (each with 4–5 questions, an accusation and a proof question). British spelling, Tronwell crew characters, no textbook names.

To add content, copy an item in the right file and run `npm run validate:content`. The validator rejects: missing fields, ids that don't match the file's game/level, invalid answer indexes, duplicate ids or questions, ambiguous option lists, feedback that only repeats the answer, word-order alternatives that aren't permutations, spelling clues that contain the word, and detective cases that cannot be completed (a question requiring hidden evidence before it is revealed, evidence that is never revealed…). At runtime invalid items are skipped, never served.

## Scoring, XP and achievements

* **Score** (`services/progress/scoring.ts`): correct answer = (100 + 0/25/50 for difficulty 1/2/3) × combo multiplier (×1, ×2 from 3 in a row, ×3 from 6, ×4 from 10). Wrong answers give 0 and reset the combo (never negative). Only the first attempt at an item counts. Gameplay bonuses (quick shots, coins, pit-stop speed, race position, solving the case) are capped at 3,000 per session.
* **XP / coins** (`rewards.ts`): 10 XP + 2 coins per correct answer; +20 XP +5 coins for finishing; +10 XP for 80 %+ accuracy or +20 XP +5 coins for 100 % (needs 5+ answers). Quitting keeps only the correct-answer rewards. Ranks: Space Cadet → Star Pilot (200) → Navigator (600) → Commander (1,500) → Star Captain (3,000) → Galaxy Legend (6,000). No shop.
* **Achievements:** First Mission, Space Explorer (all four games), Accuracy Ace (90 %+, 8+ answers), Personal Best, Combo Master (8 in a row), Case Closed, Practice Streak (3 days in a row), Rising Star (1,000 XP).
* A session is recorded once: double submissions return the first outcome and award nothing again. Results are validated before rewards (counts must match the answer log, the score must be possible, the game/level must match the session).

## Persistence and privacy

The Practice Zone has no accounts or backend, so progress is stored **in this browser on this device** (`localStorage` key `twgz1_profile`, anonymous random id, no names). If storage is blocked, the app says so and nothing is claimed as saved. `ProgressRepository` (`services/progress/repository.ts`) is the seam for a future school backend: a remote implementation must authenticate students and validate results on the server.

## Art and assets

* `public/assets/<game>/`, `public/assets/shared-ui/` – the **Tronwell Kids Game Zone PNG asset pack** (transparent sprites). Sprites that carried fragments of neighbouring atlas pieces (UFO, crab, ice spikes, one portrait) are cleaned at load time (only the largest shape is kept).
* `public/assets/backgrounds/` – the **Screens & Backgrounds pack** (opaque pixel-art scenes). A 10-pixel frame is trimmed at load time because some panels include the concept sheet's border.
* `src/games/shared/pixel/art.ts` – original ASCII pixel art for things the packs don't include: 32 vocabulary icons for picture clues, some detective clues, and fallbacks.
* Every texture is listed in `src/games/shared/pixel/assets.ts`, so art can be swapped without touching game code.
* Sound: retro effects and four chiptune loops synthesised with Web Audio (no audio files). Fonts are bundled (`@fontsource`).

## Accessibility

Keyboard play everywhere (arrows/WASD, Space, number keys to pick answers, Esc/P to pause), on-screen touch buttons on phones/tablets, a case notebook that makes every room object reachable with Tab/Enter, `aria-live` feedback, visible focus, reduced-motion support (system setting or Settings → Motion), mute/volume/music controls, no flashing effects, fixed-height prompt panel so the game never jumps under the reader.

## Development helpers

* `?timerloop` (dev server only) drives Phaser with timers so a game keeps running in a background tab during automated testing.
* `window.__gz` (dev server only) exposes the running game and bridge for debugging.

## Publishing (GitHub Pages)

`vite.config.ts` uses `base: './'`, so the `dist/` folder works from any sub-path. See `COMO_PUBLICAR.txt` (Spanish) for the step-by-step publishing guide.
