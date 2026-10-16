# Implementation report — TRONWELL KIDS GAME ZONE (MVP)

Date: 2026-10-16 · Status: playable MVP, verified locally, **not yet published**.

## What was built

* A standalone React + TypeScript + Phaser 3 app in `Downloads/tronwell_game_zone`, designed to sit next to the existing Tronwell Kids Practice Zone on GitHub Pages and read its level.
* Responsive arcade lobby (4 cabinets, pilot card with rank/XP/coins/streak, level badge, settings, link back to the Practice Zone).
* Four complete games sharing one lifecycle, content model, scoring, rewards and persistence:
  * **Grammar Blaster:** ship movement, firing, lock-on shots (tap or 1–4), falling answer asteroids, enemy ships, shields with auto-repair (no game over), quick-shot bonus, 10 waves.
  * **Word Jumper:** arcade physics (gravity, variable jump, coyote time, jump buffer), procedurally built level per session, word-group and ordered-spelling missions, energy gates, flag checkpoints, spikes, patrolling enemies, coins, UFO exit.
  * **Tense Racer:** 3-lane racer with auto speed, lane steering, gate challenges (steer into the answer or press 1–3), pit stops with a tap-to-order sentence builder, turbo, obstacles, three pace-relative rivals, live position, finish line and podium bonus.
  * **English Detective:** walkable room, suspects with statements, evidence with descriptions, questions that unlock as you examine things, hidden evidence revealed by answers, accusation + proof, case notebook usable by keyboard.
* Start, pause (Esc/P, tab hidden), resume, restart, quit (keeps correct-answer XP), results with 1–3 stars, score, accuracy, XP/coin breakdown, achievements, save status and a full learning review.
* Progress page: totals, rank, streak, accuracy and best score by game, recent games, "practise again" categories, achievements, reset.
* Content bank (draft): 450 challenge items + 10 detective cases across A0–B2, with an automated validator.
* Integration with the Practice Zone: the Game Zone reads the portal's placement-test level (`twk2_level`) and accepts the portal's `?level=` ids. The portal (`Downloads/tronwell_kids/index.html`) got a "Game Zone" banner on its home page and on every level page, which links to `../tronwell-game-zone/?level=<id>`.

## Files and modules

* Created: everything under `Downloads/tronwell_game_zone/` (see README "Architecture").
* Modified outside the project: `Downloads/tronwell_kids/index.html` (+1 CSS block `.gzone`, +`GAMEZONE_URL`/`gameZoneHtml()`, two insertions in `renderHome()` and `renderLevel()`). A backup of the previous file is in the session scratchpad.
* Assets copied into `public/assets/` from `Tronwell_Kids_Game_Zone_PNG_Assets` and `Tronwell_Kids_Game_Zone_Screens_Backgrounds`. The concept screens were used only as visual references, not shipped.

## Architecture decisions

* **Separate app instead of rewriting the portal.** The portal is one hand-edited HTML file with no build step; the Game Zone needs TypeScript, Phaser, tests and a content validator. Same GitHub Pages domain ⇒ shared `localStorage` ⇒ real level integration without a backend.
* **React for UI, Phaser for gameplay**, connected by a typed `GameBridge`. HUD text lives in React (readable, accessible, never covers the play area); the canvas only draws the world.
* **Lazy Phaser:** the lobby loads ~136 kB gzip; Phaser (~340 kB gzip) and each scene load only when a game starts.
* **Content separate from mechanics:** games only receive validated items through `questionEngine`; banks are plain TypeScript files.
* **Persistence behind an interface** (`ProgressRepository`); the MVP uses the device. Nothing pretends to be remote.
* **Tense Racer is a side-view lane racer** (not top-down) because the asset pack's cars are drawn from the side.
* **Non-punishing design:** no negative points, no game over; mistakes show the rule and the correct answer.

## Tests and checks

* `npm test`: **66 tests pass** (Vitest) —
  * content bank: zero validation issues; every game × level has content;
  * question engine: level filtering, invalid answer keys skipped, empty banks fail gracefully, shuffling keeps answers, word-order alternatives;
  * validator: catches bad ids, level mismatches, gap errors, duplicate options, weak feedback, impossible detective cases;
  * scoring/combo/bonus cap, XP/coins/ranks, achievements, streaks, stats;
  * ProgressService: saves once, duplicate/concurrent submissions award nothing twice, impossible results rejected, non-persistent storage reported, reload from storage, personal bests;
  * level resolution (teacher link, portal key, chosen level, corrupted storage);
  * registry: every game builds a session at every level; all textures exist;
  * **every detective case is solvable from its clues and still finishes with wrong answers**; spelling logic; level generator reachability/spacing.
* `npm run typecheck` (TypeScript strict): clean. No linter is configured; strict TypeScript is the static check.
* `npm run build`: succeeds.
* Browser verification (dev server, built-in browser):
  * all four games played to the results screen (scripted runs answering correctly: Blaster 10/10, Jumper 4 missions + exit, Racer 8/8, Detective 7/7 "case solved"); XP, achievements and "Saved on this device" confirmed;
  * keyboard input, lock-on keys, pit-stop panel, case notebook, pause overlay;
  * layouts at desktop 1280×800, tablet 768×1024 (detective panel below the room) and phone 375×812 (lobby single column, no horizontal overflow; Blaster with touch buttons);
  * no console errors during the runs.

## Not verified / known limitations

* **Not tested on real phones/tablets or with real touch input** (only the browser's mobile emulation and scripted input). Phone **landscape** layouts and iOS Safari were not checked.
* Gameplay balance (asteroid fall speed, race pace, jump difficulty) was tuned by reasoning and scripted runs, not with students.
* Racer and Detective use a fixed 16:9 canvas, so on tall phones they are letterboxed.
* Content is **draft**: written for this MVP and validated automatically, not pedagogically reviewed (see below). 450 + 10 cases is below the ~600 planning target; the schema and validator are ready for more.
* Progress is per browser/device; clearing site data or changing device loses it. No teacher dashboard (out of MVP scope).
* Sound/music are synthesised; no voice-over or listening tasks.
* Some art from the packs is unused (UI panel frames, extra track pieces, power-ups); a few detective clues and the vocabulary picture icons use the project's own pixel art because the packs have no matching sprite.
* Not published: creating the GitHub repository and pushing need the account owner's go-ahead (see `COMO_PUBLICAR.txt`).

## Content to review (notes from the writers)

* Grammar Blaster: gb-b2-023 accepts only "were" ("I wish I were taller"); gb-a2-019 and gb-b1-026 (will vs going to) treat one form as the rule; "used to" and "wish" items are filed under past simple / conditionals (no dedicated category yet).
* Tense Racer: tr-b1-019 lists the end position of "already" as a second correct order; tr-b1-028 and tr-a2-008 are the closest calls on a single answer; tr-a0-014 feedback compares with Spanish "tengo hambre"; inversion (Not only / Hardly) only in B2.
* Word Jumper: A0 "rubber" (British for eraser, has a hint); B1 "do a test", "arrest"; B2 "plasma", "minor"; "tired"/"necessary" have same-length synonyms (only the letters on screen rule them out).
* English Detective: "The Salty Birthday Cake" (B1) turns on the Spanish words AZÚCAR/SAL; in some A0/A1 cases the last question nearly names the culprit.

## Next steps

1. Publish (repo + `npm run deploy`) and upload the updated portal `index.html`.
2. Teacher review of the content bank; mark reviewed items `status: 'reviewed'`.
3. Play-test with students on school devices (especially phones in landscape); tune speeds.
4. Expand to ~30 items per game/level for Tense Racer/Word Jumper variety and 3+ cases per level.
5. Optional: a school backend implementing `ProgressRepository` for teacher reports.
