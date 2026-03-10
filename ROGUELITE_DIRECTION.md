# Roguelite Direction

## Goal

Shift `Loot & Liability` from a short run-based prototype into a roguelite with:

- meaningful permanent progression across failed runs
- stronger run-to-run build variety
- higher-stakes extraction decisions
- content hooks that can grow without rewriting the whole game loop

## Best Candidate Shift Points

### 1. Split permanent meta progression from run progression

Current state:

- Run state and lifetime counters are mixed in [src/Game.jsx](/D:/Game Creation/LootAndLiability/src/Game.jsx).
- Lifetime state in [src/data/Defaults.js](/D:/Game Creation/LootAndLiability/src/data/Defaults.js) is mostly statistics, not progression.

Roguelite direction:

- Add a real `meta` layer for permanent currency, permanent unlocks, merchant upgrades, unlocked relic pools, and dungeon modifiers.
- Keep `run` state focused on the current attempt: HP, gold, inventory, temporary buffs, current route, current relics.

Why this is the highest-value pivot:

- Roguelites live or die on what failure still gives the player.
- This is the foundation for every later system.

Recommended implementation shape:

- Add a persisted `meta` object in a new utility module alongside [src/utils/SaveData.js](/D:/Game Creation/LootAndLiability/src/utils/SaveData.js).
- Keep `ll_save` for active run state only.
- Introduce a new persistent key for meta progression, separate from stats.

### 2. Turn loot into build-defining relics, not just resale value

Current state:

- Loot is almost entirely vendor value from [src/utils/GameLogic.js](/D:/Game Creation/LootAndLiability/src/utils/GameLogic.js) and [src/data/Constants.js](/D:/Game Creation/LootAndLiability/src/data/Constants.js).
- The player build barely changes during a run except via simple gear upgrades in the shop.

Roguelite direction:

- Split loot into:
  - `cargo` items for selling
  - `relics` that modify combat or economy for the current run
  - rare `blueprints` or `permits` that unlock future content permanently

Examples:

- `Merchant's Favor`: first sale each run gives bonus gold
- `Blood Ledger`: gain attack after each kill, lose it on retreat
- `Last-Ditch Contract`: potion also grants armor this combat

Why it matters:

- Run identity becomes "what build did I assemble" instead of "how much gold did I bring back."

### 3. Replace linear floor progression with route choice

Current state:

- The floor loop in [src/screens/FloorHubView.jsx](/D:/Game Creation/LootAndLiability/src/screens/FloorHubView.jsx) is basically `explore / descend / retreat`.

Roguelite direction:

- Give each floor a small route map or room draft:
  - combat room
  - elite room
  - treasure room
  - event room
  - merchant service room
  - extraction shortcut

Why this is a strong fit:

- The current UI is already menu-driven, so route selection can be added without building a map-rendering heavy game.
- Choice density increases immediately without changing the core presentation style.

Recommended first version:

- Replace `exploreRoom()` with `chooseEncounter(nodeId)`.
- Generate 2-4 room choices at each step instead of random blind exploration.

### 4. Make retreat the center of the run, not a safety valve

Current state:

- Retreat is useful, but mostly binary: leave now or continue.

Roguelite direction:

- Build the game around extraction pressure:
  - carried cargo is lost on death
  - banked meta currency is safe
  - some relics reward greed
  - some contracts reward early extraction

Good systems to add:

- `insured cargo` slots
- `merchant bailouts` unlocked permanently
- `heat` or `danger debt` that rises the longer you stay
- exit rooms that are not always immediately available

Why this fits the current fantasy:

- The merchant/employment framing already supports "haul back value alive" better than a pure kill-everything loop.

### 5. Convert the shop into a between-run meta hub

Current state:

- The shop in [src/screens/ShopView.jsx](/D:/Game Creation/LootAndLiability/src/screens/ShopView.jsx) serves both run preparation and permanent game structure.

Roguelite direction:

- Split it into:
  - run prep: consumables, starting loadout tweaks, contract selection
  - meta progression: unlock permanent perks, new relic pools, service tiers, starter bonuses

High-value permanent unlock examples:

- start each run with +1 potion
- unlock black market room type
- unlock relic rerolls
- unlock insurance slot for one cargo item
- increase chance of uncommon relics

### 6. Add contracts to define run goals

Current state:

- Every run has the same objective: survive and extract loot.

Roguelite direction:

- Offer 2-3 contracts before each run:
  - slay quota
  - return with rare cargo
  - clear an elite floor
  - extract below half HP

Rewards:

- meta currency
- unlock tokens
- temporary run modifiers

Why this matters:

- Contracts create replayable goals without requiring a huge content footprint.
- They fit the merchant-employer tone naturally.

### 7. Add enemy tags, elites, and bosses before adding many more monsters

Current state:

- Monsters mostly differ by basic stats from [src/data/Constants.js](/D:/Game Creation/LootAndLiability/src/data/Constants.js).

Roguelite direction:

- Add behavior tags first:
  - `fragile`
  - `armored`
  - `berserker`
  - `venomous`
  - `thief`
- Then layer elite modifiers and floor bosses on top of the same base roster.

Why this is better than just adding more enemies:

- It increases combinatorial variety faster.
- It creates relic and contract hooks.

### 8. Introduce run events with choices, not just outcomes

Current state:

- Travel and exploration events are mostly random outcomes applied to the player.

Roguelite direction:

- Convert events into choice-driven nodes:
  - pay gold for a cursed relic
  - trade HP for cargo
  - destroy cargo to escape an ambush
  - accept a merchant side deal that changes future room odds

Implementation note:

- This wants a small data-driven event schema in `src/data/`.

### 9. Add a second currency

Current state:

- Gold currently does everything.

Roguelite direction:

- Keep `gold` as run currency.
- Add a permanent currency earned from contracts, bosses, or insured extraction.

Why this is necessary:

- If one currency does both run economy and permanent progression, balance gets muddy fast.

### 10. Prepare the codebase for content growth

Current state:

- [src/Game.jsx](/D:/Game Creation/LootAndLiability/src/Game.jsx) still owns too much orchestration for a content-heavy roguelite.

Roguelite direction:

- Split into:
  - `run state`
  - `meta progression`
  - `encounter resolution`
  - `reward generation`
  - `contract generation`

Recommended next refactors before major feature work:

- move run transitions into a reducer or state machine
- make encounter/reward data-driven
- keep screens dumb and state transitions centralized

## Priority Order

If we want the smallest path to "this is now a roguelite", the order should be:

1. Meta progression layer
2. Contract system
3. Relic system
4. Route choice instead of blind room exploration
5. Extraction-risk tuning
6. Elites and bosses

## Concrete Next Build Slice

The best next implementation step is:

1. Add a persistent meta currency.
2. Add pre-run contract selection.
3. Award meta currency on death/extraction based on the contract and run performance.
4. Surface meta currency and contract state in the profile/shop UI.

That is the smallest change that makes failed runs still advance the player, which is the first real roguelite threshold.
