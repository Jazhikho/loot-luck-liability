Original prompt: commit the current version as the initial commit, create an agents.md for this, and addresses the issues that you found. Be recursive - when you can test, go back and correct issues found in those tests until there is nothing left to fix. Remember to commit-as-you-go; when you're ready, we'll move on to the next major muscle movement with this game.

## 2026-03-10

- Captured the untouched prototype as the repository's initial commit.
- Started a release-prep branch for hardening work.
- Planned fixes for save validation, dungeon-clear timing, confirmation UX, and automated verification.
- Added repository guidance in `AGENTS.md` and started `VERSION.md` tracking at `1.0.1`.
- Reworked save loading with sanitization/fallbacks and moved combat/potion edge-case rules into shared utilities.
- Added confirmation dialogs for new-run overwrite and full data deletion.
- Upgraded Vite/tooling, added Vitest + Testing Library coverage, and exposed `window.render_game_to_text()` for smoke checks.
- Verification pass complete: `npm test`, `npm run build`, `npm audit`, and a Playwright smoke run all passed.
