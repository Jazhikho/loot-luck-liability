# Loot & Liability

## AI Use Statement and Disclosure Guide

### Purpose

This document defines how AI may be used in the development of Loot & Liability, including code, tests, localization drafts, design notes, release materials, store copy, and supporting assets.

The goal is not to ban AI use. The goal is to keep AI inside a human-directed workflow so that authorship, judgment, validation, accountability, and release decisions remain human responsibilities.

---

## 1. Core Principle

Loot & Liability uses AI as an assistive tool inside a human-led development process.

AI may assist with:

- exploration
- drafting
- transformation
- testing
- critique
- formatting
- structured ideation

AI may not be treated as the final authority for:

- gameplay design decisions
- balance decisions
- factual claims
- localization correctness
- cultural framing
- legal or licensing judgments
- publication decisions
- release approval

Human agency remains mandatory at every decisive stage.

---

## 2. Policy Statement

AI-assisted work may be included in Loot & Liability only when all of the following are true:

1. A human defined the task, constraints, and success criteria.
2. A human reviewed the output critically rather than accepting it automatically.
3. A human revised, integrated, tested, or otherwise substantively transformed the output.
4. A human accepted responsibility for the final form.
5. AI use is disclosed where disclosure is relevant, appropriate, or expected.

AI output must never be presented as independent human work when the role of AI was substantial enough that a reasonable player, collaborator, reviewer, or publisher would expect disclosure.

---

## 3. Allowed Uses

### 3.1 Generally Allowed Uses

AI may be used for:

- code scaffolding
- refactoring suggestions
- unit test drafts
- bug-hunting suggestions
- documentation cleanup
- release-note drafting
- text transformation
- summary generation from human-authored notes
- brainstorming structured alternatives
- UI microcopy drafts
- non-final joke, flavor, and narration ideation
- adversarial test cases
- save-shape review assistance
- export and packaging checklist assistance

### 3.2 Conditionally Allowed Uses

AI may be used with increased human oversight for:

- gameplay balance ideas
- combat, economy, and progression tuning suggestions
- localization drafts and translation alternatives
- monster, dungeon, and loot naming alternatives
- store-page or product-description drafts
- visual asset concept prompts
- comparative analysis drafts

These uses require substantive human review and revision before they become project material.

---

## 4. Restricted and Prohibited Uses

AI must not be treated as the primary authority or autonomous producer for:

- core gameplay philosophy
- final balance decisions
- final localization claims
- legal conclusions
- licensing compatibility judgments
- final publication claims
- final release approval
- citations or source claims presented without verification
- content that imitates protected settings, characters, or distinctive proprietary material

AI-assisted output must not be shipped if it has not been substantively reviewed by a human.

---

## 5. Human Review Standard

All meaningful AI-assisted outputs must pass through this chain:

**Human task definition -> AI assistance -> human review -> human revision/integration -> validation -> human approval**

This sequence is mandatory for shipped code, public-facing text, localized strings, release assets, and store or repository materials.

---

## 6. Substantive Transformation Rule

An AI-assisted output may be incorporated into Loot & Liability only if it has undergone at least one of the following forms of meaningful human contribution:

- substantial rewriting
- structural reorganization
- integration into a larger human-authored system
- explicit testing and correction against defined criteria
- selection among alternatives using human judgment and rationale
- adaptation into a form not determined solely by the AI output

Minor cleanup alone is not enough when the AI contribution is substantial.

---

## 7. Provenance and Recordkeeping

For significant AI-assisted artifacts, maintain a lightweight provenance record in [AI-Provenance-Log.md](/D:/Game Creation/LootAndLiability/AI-Provenance-Log.md).

Each entry should include:

- date
- tool or model used
- task purpose
- input materials used
- summary of AI contribution
- what the human accepted
- what the human rejected
- what the human changed
- validation method used
- final approver

The record may be brief, but it must be sufficient to show that the project retained human direction and review.

---

## 8. Project-Specific Guidance

### 8.1 Gameplay Systems and Saves

Because Loot & Liability has stateful progression and local saves, human oversight is mandatory for:

- save-data schema changes
- sanitizer updates
- progression logic
- resource-spending actions
- reward tables
- combat outcomes
- unlock and achievement logic

AI may assist with implementation and test drafts, but humans remain responsible for behavioral correctness and backwards compatibility for saves.

### 8.2 Localization and Player-Facing Writing

Because the project ships multiple languages and leans heavily on humor and narration, AI use must be more tightly controlled for:

- translated UI text
- combat and flavor narration
- jokes, idioms, and tone
- culture-specific phrasing

AI may assist with alternatives and cleanup, but humans must retain direct control over tone, correctness, and cultural appropriateness.

### 8.3 Release Materials and Public Messaging

AI may assist with README, store-page, and release-note drafting, but humans must approve:

- release positioning
- version claims
- support statements
- player-facing disclosures

### 8.4 Visual and Audio Assets

If AI is used for icons, logos, illustrations, audio, or promotional material, humans must verify:

- the asset is disclosed where appropriate
- the asset does not imitate protected third-party material
- the licensing and distribution posture has been reviewed by a human
- the final shipped asset was selected and approved by a human

---

## 9. Bias, Slop, and Release Review

Before release, AI-assisted outputs must be checked for:

- hallucinated facts
- shallow or generic prose
- broken or unverified gameplay logic
- save compatibility regressions
- weak or unnatural localization
- cultural flattening or stereotype drift
- accidental imitation of copyrighted settings or styles
- polished but unusable output
- contradictions with project rules or tone

Any output that fails these checks must be revised or discarded.

---

## 10. Disclosure Standard

Loot & Liability does not hide meaningful AI use, and it does not treat AI assistance as equivalent to authorship.

Disclosure should be proportionate to context.

### 10.1 Minimum Disclosure Rule

A disclosure should be made when AI played a meaningful role in creating:

- public-facing product materials
- repository policy or contributor guidance
- shipped code in a collaborative codebase
- localized player-facing content
- generated or edited visual assets offered as part of the product

### 10.2 Disclosure Goals

Disclosures should make clear:

- what AI was used for
- what humans remained responsible for
- whether output was reviewed and revised
- whether final decisions remained human-led

---

## 11. Short Disclosure Template

Use when a concise note is appropriate for the README, itch page, storefront, or credits.

> **AI-assisted development note:** AI tools were used for bounded support tasks such as code scaffolding, refactoring suggestions, test drafting, documentation support, localization alternatives, and structured ideation. Gameplay design, balance, validation, integration, final edits, localization approval, and release approval remained human-led. No AI-assisted output was shipped without human review and substantive revision or testing.

---

## 12. Repository Disclosure Template

> This project permits AI-assisted contributions, but all such contributions must be human-reviewed, tested where appropriate, and compatible with the project's standards for originality, licensing, localization quality, and gameplay correctness. Contributors remain responsible for verifying code, text, translations, assets, sources, and compatibility claims. AI-generated content must not be committed without meaningful human oversight.

---

## 13. Contributor Rules

Contributors using AI on Loot & Liability must:

- disclose meaningful AI assistance in contribution notes when relevant
- verify code behavior, localization accuracy, and text quality
- avoid submitting unverifiable claims or licensing judgments
- avoid using AI to imitate proprietary settings or copyrighted styles
- ensure submissions meet project standards without relying on AI authority
- add or update provenance entries for significant AI-assisted artifacts

Contributors may not use AI assistance as an excuse for:

- broken code
- fabricated documentation
- shallow writing
- unverified localization
- unreviewed balance changes
- culturally careless output
- licensing contamination

---

## 14. Review Checklist

Before accepting meaningful AI-assisted material, ask:

- Did a human define the task clearly?
- Is the result actually useful, or only polished-looking?
- Was it reviewed critically rather than accepted by default?
- Was it substantively revised, integrated, or tested?
- Does it conflict with gameplay goals, save compatibility, tone, or localization quality?
- Does it create licensing or attribution problems?
- Does it introduce bias, stereotype drift, or factual instability?
- Is the final responsibility clearly human?

If the answer to any of the last four questions is problematic, do not ship it.

---

## 15. Final Standard

If asked what part of the work is genuinely human, the project should be able to answer clearly:

- the human defined the problem
- the human set the constraints
- the human evaluated the options
- the human selected what to keep
- the human rewrote, integrated, tested, or corrected the result
- the human decided what was publishable
- the human accepted responsibility for the final work

If that cannot be said honestly, the process is too dependent on AI and should be revised.

---

## 16. One-Paragraph Summary

Loot & Liability uses AI as a tool inside a human-led workflow. AI may support drafting, coding, testing, formatting, localization alternatives, and ideation, but it does not replace authorship, judgment, validation, localization review, or release accountability. All meaningful AI-assisted outputs must be reviewed, revised, integrated, or tested by a human before release, and meaningful AI use should be disclosed where relevant.
