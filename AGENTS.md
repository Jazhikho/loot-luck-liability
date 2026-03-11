# Loot & Liability Agent Guide

## Stack

- React 18 + Vite + Tailwind CSS.
- Main game state currently lives in [src/Game.jsx](/D:/Game Creation/LootAndLiability/src/Game.jsx).
- Shared game rules belong in `src/utils/`.

## Working Rules

- Keep gameplay rules out of screen components when possible; move reusable logic into `src/utils/`.
- Preserve backwards compatibility for local saves. If the save shape changes, update the sanitizer in `src/utils/SaveData.js`.
- Treat destructive player actions as confirmable UX, not one-click actions.
- Keep automated coverage for save/load, progression, and any action that spends player resources.

## Validation

- Run `npm test` before committing gameplay changes.
- Run `npm run build` before finishing a release-prep task.
- For browser smoke tests, use `window.render_game_to_text()` and the Playwright workflow from the local `develop-web-game` skill.

## Release Notes

- Update `VERSION.md` whenever behavior changes.
- Keep the shipped app version in lockstep across `package.json`, `package-lock.json`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`, `src-tauri/tauri.conf.json`, and `android/app/build.gradle` `versionName`.
- Derive Android `versionCode` directly from the semantic version as `major * 100 + minor * 10 + patch` (for example, `1.7.1` -> `171`).
- Prefer reading the app version from `package.json` in tests and UI rather than hardcoding version strings.
