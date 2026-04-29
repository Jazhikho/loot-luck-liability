# Contributing

## Standards

- Follow the project workflow in [AGENTS.md](/D:/Game Creation/LootAndLiability/AGENTS.md).
- Follow the AI use policy in [AI-Use-Statement.md](/D:/Game Creation/LootAndLiability/AI-Use-Statement.md).
- Keep gameplay rules out of screen components when possible and preserve save compatibility.
- Add or update tests for save/load, progression, and any action that spends player resources.

## AI-Assisted Contributions

AI-assisted contributions are allowed, but they must remain human-directed.

Contributors using AI must:

- disclose meaningful AI assistance in contribution notes, PR descriptions, or commit context when relevant
- verify code behavior, localization accuracy, asset suitability, and text quality
- avoid submitting unverifiable factual, legal, licensing, or compatibility claims
- avoid using AI to imitate proprietary settings, copyrighted styles, or protected characters
- add or update [AI-Provenance-Log.md](/D:/Game Creation/LootAndLiability/AI-Provenance-Log.md) for significant AI-assisted artifacts
- retain human responsibility for final edits, integration, validation, and release readiness

AI-assisted output must not be committed or shipped without meaningful human review and substantive revision or testing.

## Validation

- Run `npm test` before committing gameplay changes.
- Run `npm run build` before release-prep completion.
- If a change affects public-facing materials, disclosure copy, localization, or assets, review those outputs explicitly rather than assuming AI output is correct.

## Release Expectations

Before a release or release-prep change is considered complete:

- confirm the public AI disclosure is still accurate in [README.md](/D:/Game Creation/LootAndLiability/README.md)
- update [AI-Provenance-Log.md](/D:/Game Creation/LootAndLiability/AI-Provenance-Log.md) for significant new AI-assisted artifacts
- confirm human review was performed for gameplay balance, localization, asset suitability, and licensing-sensitive decisions
- keep version fields synchronized when behavior changes require a version bump
