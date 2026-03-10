# Version History

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
