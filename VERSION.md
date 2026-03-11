# Version History

## 1.6.0 - 2026-03-11

- Added a hidden localization scaffold for `en`, `es`, `ru`, `ja`, `ko`, and `zh-Hans` while keeping English as the only visible in-game language.
- Extracted screen/component UI text and stable content ids behind locale-aware lookup helpers, plus safer font fallbacks for future Cyrillic/CJK support.
- Added locale fallback coverage for UI copy, content tables, and luck narration without changing current gameplay behavior.

## 1.5.0 - 2026-03-11

- Greatly expanded the luck-driven comedy text with more varied encounter, attack, death, travel, trap, and empty-room narration.
- Made higher luck tiers escalate harder into surreal, self-aware, and openly fourth-wall-breaking outcomes without changing gameplay balance.
- Tightened automated coverage around narration variety, determinism, and presentation-only safety.

## 1.4.1 - 2026-03-10

- Added a playtesting credit for Joel Croteau in the title-screen credits.
- Added a prominent low-HP town warning plus a confirmation step before leaving town hurt, while keeping Hearth Rest manual.
- Reworked loot progression so deeper floors and stronger dungeons bias toward better and more advanced curios without hard-locking older finds out of the pool.
- Promoted combat and dungeon narration into larger story panels so the humorous text reads like the centerpiece instead of footer noise.

## 1.4.0 - 2026-03-10

- Reworked the play and ledger layouts to scroll internally so achievements, cargo, and the adventure log stay visible inside tighter windows.
- Promoted the flavor log into a labeled `Rumors & Wreckage` panel so the fourth-wall jokes and event text are harder to miss.
- Added cargo locking so `Cash In` only sells unlocked items, with held cargo persisting through saves.
- Made weapon and armor upgrades feel punchier with stronger per-level bonuses and clearer upgrade previews in the snug.
- Added floor-tradeoff guidance plus combat danger/death warnings so lethal moments read before the dead screen cuts in.

## 1.3.1 - 2026-03-10

- Fixed the release pipeline on Windows so Android signing arguments survive special characters in keystore passwords.
- Taught the Android release runner to prefer the installed `D:\Android` SDK and Android Studio JBR automatically.

## 1.3.0 - 2026-03-10

- Added Tauri and Capacitor release scaffolding plus scripted `release/` packaging targets for web, Windows, and Android.
- Added a reproducible `LLL.png` asset sync path for the browser favicon plus Windows and Android launcher art.
- Added a versioned credits screen, removed the jam subtitle from the main title UI, and aligned native wrapper metadata, browser title, and itch.io release commands with the live game version.

## 1.2.3 - 2026-03-10

- Added a credits view on the title screen with dev, prototype, Codex, and version attribution.

## 1.2.2 - 2026-03-10

- Greatly expanded enemy banter with more varied lines and stronger fourth-wall jokes about the Dev, seeds, and RNG.
- Made clover-cursed encounters lean harder into meta dialogue while grounded runs stay more in-world.

## 1.2.1 - 2026-03-10

- Updated the visible game title to `Loot, Luck & Liability` across the main UI.

## 1.2.0 - 2026-03-10

- Added enemy banter and more comedic combat narration so encounters feel more like a taunting tavern disaster.
- Added deterministic procedural dungeon discovery that expands the unlock list as more dungeons are opened.
- Extended save handling and tests so generated dungeons and their unlock flow restore safely.

## 1.1.0 - 2026-03-10

- Rethemed the game for the St. Paddy's jam with new dungeon, monster, loot, and UI flavor.
- Added a visible Luck stat, run-only Luck upgrades, lucky cargo bonuses, and `bestLuck` tracking.
- Introduced a presentation-only luck narration layer so high-luck runs become increasingly absurd without changing combat or reward math.
- Expanded automated coverage for luck upgrades, save normalization, render-state output, and presentation parity.

## 1.0.1 - 2026-03-10

- Hardened save loading with schema validation and safer fallbacks.
- Fixed dungeon-clear progression so clears are awarded only after a successful return from the deepest floor.
- Added confirmation dialogs for destructive actions and guarded potion use at full health.
- Added automated tests and release verification scripts.

## 1.0.0 - 2026-02-11

- Initial local prototype.
