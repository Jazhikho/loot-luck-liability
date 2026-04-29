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
- For significant AI-assisted artifacts, add or update `AI-Provenance-Log.md`.
- For public-facing changes, ensure `README.md` disclosure text remains accurate.
- Do not treat AI output as authoritative for balance, localization, legal, licensing, or release approval decisions.

## Release Notes

- Update `VERSION.md` whenever behavior changes.
- Treat `VERSION.md` and `package.json` `appVersion` as the canonical four-part app version.
- Keep semver-limited fields in sync with the first three parts of that version: `package.json` `version`, `package-lock.json`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`, and `src-tauri/tauri.conf.json`.
- Keep `android/app/build.gradle` `versionName` on the canonical four-part version.
- Encode Android `versionCode` from the four-part app version as `major * 1000000 + minor * 10000 + feature * 100 + bugfix`.
- Prefer reading the visible app version from `package.json` `appVersion` in tests and UI rather than hardcoding version strings.
- Before release, confirm AI disclosure is still accurate in public-facing materials and that `AI-Provenance-Log.md` is current for significant AI-assisted work.
- Before release, ensure a human has explicitly reviewed localization quality, asset suitability, and any licensing-sensitive outputs touched by AI assistance.
