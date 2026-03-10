# Version History

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
