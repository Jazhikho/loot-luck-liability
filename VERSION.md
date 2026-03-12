# Version History

## 1.8.0.2 - 2026-03-11

- Removed the visible current luck-band label from the player-facing luck summaries while keeping the underlying presentation bands active.
- Greatly expanded monster quote pools and generic combat narration variety, with broader topic spread so repeated actions stop cycling through near-identical lines.
- Tightened danger warnings so combat only flags lethal incoming turns, while town departure warnings now advise below 75% HP and hard-stop departures only below 50%.

## 1.8.0.1 - 2026-03-11

- Fixed combat and encounter narration rotation so repeated actions draw from the dialogue pool instead of reusing the same line back-to-back.
- Threaded runtime narration sequencing through combat, trap, loot, travel, and room commentary, with regression coverage for consecutive-turn variety.

## 1.8.0.0 - 2026-03-11

- Replaced the old four-step luck cap with a ten-band absurdity ladder, including new high-luck cosmetic surfaces and a hidden achievement for reaching the top band.
- Expanded language support to surfaced regional Spanish choices, plus Brazilian Portuguese and Japanese, with browser autodetect and locale fallback chains.
- Extended combat/log/render-state output so the richer luck-band metadata, cosmetic encounter labels, and locale-aware presentation survive saves and testing.

## 1.7.1.3 - 2026-03-11

- Removed the separate floor-only `Dungeon Commentary` panel and routed floor narration through the main `Rumors & Wreckage` log instead.
- Fixed the stale post-combat floor-view story leak and added regression coverage for floor-hub log rendering.

## 1.7.1.2 - 2026-03-11

- Replaced the server-only mojibake repair path with a browser-safe UTF-8 decoder so the web build no longer crashes on startup.
- Added a regression test that loads locale resources with `Buffer` unavailable, matching the real browser runtime.

## 1.7.1.1 - 2026-03-11

- Fixed corrupted emoji/icon data so dungeon, monster, loot, and achievement glyphs render normally again instead of showing mojibake.
- Repaired the damaged visible version wiring and added encoding regression coverage for core content tables and localized resource strings.

## 1.7.1.0 - 2026-03-11

- Added diminishing returns to repeated room farming on the same floor so shallow endless runs dry up instead of outpaying deeper content.
- Reworked room outcome weighting so overfarmed floors skew much harder toward empty rooms, monsters, and trouble while legitimate deeper pushes stay rewarding.
- Flattened the room-based loot quality/value bonus after a floor is effectively picked clean and added regression coverage for the new balance rules.

## 1.7.0.0 - 2026-03-11

- Added browser-aware English/Spanish language support with a visible manual override on the title screen and ledger.
- Reworked combat and floor layouts so the story panel scrolls internally while the action buttons stay pinned in view.
- Expanded the luck banter into monster-specific dialogue pools, forced a first-room resolution on first floor entry, and localized the main run/shop log text.

## 1.6.0.0 - 2026-03-11

- Added a hidden localization scaffold for `en`, `es`, `ru`, `ja`, `ko`, and `zh-Hans` while keeping English as the only visible in-game language.
- Extracted screen/component UI text and stable content ids behind locale-aware lookup helpers, plus safer font fallbacks for future Cyrillic/CJK support.
- Added locale fallback coverage for UI copy, content tables, and luck narration without changing current gameplay behavior.

## 1.5.0.0 - 2026-03-11

- Greatly expanded the luck-driven comedy text with more varied encounter, attack, death, travel, trap, and empty-room narration.
- Made higher luck tiers escalate harder into surreal, self-aware, and openly fourth-wall-breaking outcomes without changing gameplay balance.
- Tightened automated coverage around narration variety, determinism, and presentation-only safety.

## 1.4.1.0 - 2026-03-10

- Added a playtesting credit for Joel Croteau in the title-screen credits.
- Added a prominent low-HP town warning plus a confirmation step before leaving town hurt, while keeping Hearth Rest manual.
- Reworked loot progression so deeper floors and stronger dungeons bias toward better and more advanced curios without hard-locking older finds out of the pool.
- Promoted combat and dungeon narration into larger story panels so the humorous text reads like the centerpiece instead of footer noise.

## 1.4.0.0 - 2026-03-10

- Reworked the play and ledger layouts to scroll internally so achievements, cargo, and the adventure log stay visible inside tighter windows.
- Promoted the flavor log into a labeled `Rumors & Wreckage` panel so the fourth-wall jokes and event text are harder to miss.
- Added cargo locking so `Cash In` only sells unlocked items, with held cargo persisting through saves.
- Made weapon and armor upgrades feel punchier with stronger per-level bonuses and clearer upgrade previews in the snug.
- Added floor-tradeoff guidance plus combat danger/death warnings so lethal moments read before the dead screen cuts in.

## 1.3.1.0 - 2026-03-10

- Fixed the release pipeline on Windows so Android signing arguments survive special characters in keystore passwords.
- Taught the Android release runner to prefer the installed `D:\Android` SDK and Android Studio JBR automatically.

## 1.3.0.0 - 2026-03-10

- Added Tauri and Capacitor release scaffolding plus scripted `release/` packaging targets for web, Windows, and Android.
- Added a reproducible `LLL.png` asset sync path for the browser favicon plus Windows and Android launcher art.
- Added a versioned credits screen, removed the jam subtitle from the main title UI, and aligned native wrapper metadata, browser title, and itch.io release commands with the live game version.

## 1.2.3.0 - 2026-03-10

- Added a credits view on the title screen with dev, prototype, Codex, and version attribution.

## 1.2.2.0 - 2026-03-10

- Greatly expanded enemy banter with more varied lines and stronger fourth-wall jokes about the Dev, seeds, and RNG.
- Made clover-cursed encounters lean harder into meta dialogue while grounded runs stay more in-world.

## 1.2.1.0 - 2026-03-10

- Updated the visible game title to `Loot, Luck & Liability` across the main UI.

## 1.2.0.0 - 2026-03-10

- Added enemy banter and more comedic combat narration so encounters feel more like a taunting tavern disaster.
- Added deterministic procedural dungeon discovery that expands the unlock list as more dungeons are opened.
- Extended save handling and tests so generated dungeons and their unlock flow restore safely.

## 1.1.0.0 - 2026-03-10

- Rethemed the game for the St. Paddy's jam with new dungeon, monster, loot, and UI flavor.
- Added a visible Luck stat, run-only Luck upgrades, lucky cargo bonuses, and `bestLuck` tracking.
- Introduced a presentation-only luck narration layer so high-luck runs become increasingly absurd without changing combat or reward math.
- Expanded automated coverage for luck upgrades, save normalization, render-state output, and presentation parity.

## 1.0.1.0 - 2026-03-10

- Hardened save loading with schema validation and safer fallbacks.
- Fixed dungeon-clear progression so clears are awarded only after a successful return from the deepest floor.
- Added confirmation dialogs for destructive actions and guarded potion use at full health.
- Added automated tests and release verification scripts.

## 1.0.0.0 - 2026-02-11

- Initial local prototype.
