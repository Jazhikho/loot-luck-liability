import { describe, expect, it } from "vitest";
import {
  decorateAttackOutcome,
  decorateDeathOutcome,
  decorateLootOutcome,
  decorateMonsterEncounter,
  getLuckTier,
} from "./LuckPresentation.js";

describe("LuckPresentation", () => {
  it("maps the published luck tiers correctly", () => {
    expect(getLuckTier(0).key).toBe("grounded");
    expect(getLuckTier(2).key).toBe("fortunate");
    expect(getLuckTier(5).key).toBe("uncanny");
    expect(getLuckTier(8).key).toBe("clover-cursed");
  });

  it("changes combat narration without changing resolved damage", () => {
    const resolved = { targetName: "Coin Wraith", damage: 7, highRoll: true };

    const grounded = decorateAttackOutcome(resolved, 0);
    const cursed = decorateAttackOutcome(resolved, 8);

    expect(grounded.damage).toBe(7);
    expect(cursed.damage).toBe(7);
    expect(grounded.message).not.toBe(cursed.message);
  });

  it("keeps loot payloads identical across luck tiers", () => {
    const loot = { item: { name: "Receipt", value: 185, rarity: "legendary" }, source: "drop" };

    const grounded = decorateLootOutcome(loot, 0);
    const cursed = decorateLootOutcome(loot, 8);

    expect(grounded.item).toEqual(cursed.item);
    expect(grounded.item.value).toBe(185);
    expect(grounded.message).not.toBe(cursed.message);
  });

  it("adds lucky boss-style presentation without changing monster stats", () => {
    const encounter = {
      monster: { name: "Bog King on a Bad Night", hp: 40, maxHp: 40, atk: 12, def: 6 },
      floor: 4,
      rooms: 3,
    };

    const grounded = decorateMonsterEncounter(encounter, 0);
    const cursed = decorateMonsterEncounter(encounter, 8);

    expect(grounded.monster).toEqual(cursed.monster);
    expect(cursed.encounterTitle).toBe("Lucky Find!");
    expect(grounded.encounterTitle).toBe("");
  });

  it("only reframes already-resolved death outcomes", () => {
    const death = { cause: "trap", foeName: null };

    const grounded = decorateDeathOutcome(death, 0);
    const cursed = decorateDeathOutcome(death, 8);

    expect(grounded.cause).toBe("trap");
    expect(cursed.cause).toBe("trap");
    expect(cursed.message).toMatch(/gold|lucky/i);
  });
});
