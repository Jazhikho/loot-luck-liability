import { describe, expect, it } from "vitest";
import {
  decorateAttackOutcome,
  decorateDeathOutcome,
  decorateEmptyRoomOutcome,
  decorateEnemyAttackOutcome,
  decorateEnemyDefeatOutcome,
  decorateLootOutcome,
  decorateMonsterEncounter,
  decorateTravelOutcome,
  decorateTrapOutcome,
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

  it("keeps narration deterministic for the same input", () => {
    const resolved = { targetName: "Coin Wraith", damage: 7, highRoll: true };

    expect(decorateAttackOutcome(resolved, 8).message).toBe(decorateAttackOutcome(resolved, 8).message);
    expect(decorateEnemyAttackOutcome({ attackerName: "Pub Goblin", damage: 4 }, 5).message).toBe(
      decorateEnemyAttackOutcome({ attackerName: "Pub Goblin", damage: 4 }, 5).message
    );
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

  it("uses fourth-wall enemy dialogue at clover-cursed luck", () => {
    const encounter = decorateMonsterEncounter(
      {
        monster: { name: "Pub Goblin", hp: 12, maxHp: 12, atk: 3, def: 1 },
        floor: 1,
        rooms: 1,
      },
      8
    );
    const enemyAttack = decorateEnemyAttackOutcome({ attackerName: "Pub Goblin", damage: 4 }, 8);
    const defeat = decorateEnemyDefeatOutcome({ foeName: "Pub Goblin" }, 8);

    expect(encounter.message).toMatch(/Dev|RNG|seed|patch|algorithm/i);
    expect(enemyAttack.message).toMatch(/RNG|Dev|seed|frame|engine|procedural/i);
    expect(defeat.message).toMatch(/Dev|RNG|patch|analytics|metrics|bug report|loading screen/i);
  });

  it("adds more varied absurd text to travel, traps, and empty rooms at high luck", () => {
    const travel = decorateTravelOutcome({ kind: "potion" }, 8);
    const trap = decorateTrapOutcome({ damage: 9, fatal: false }, 8);
    const empty = decorateEmptyRoomOutcome({ baseText: "Only dust waits here." }, 8);

    expect(travel.message).toMatch(/universe|loading-screen|spawn|destiny|potion/i);
    expect(trap.message).toMatch(/barrel|stage cue|physics|hardware/i);
    expect(empty.message).toMatch(/Dev|comedian|reality|hilarious/i);
  });

  it("only reframes already-resolved death outcomes", () => {
    const death = { cause: "trap", foeName: null };

    const grounded = decorateDeathOutcome(death, 0);
    const cursed = decorateDeathOutcome(death, 8);

    expect(grounded.cause).toBe("trap");
    expect(cursed.cause).toBe("trap");
    expect(cursed.message).toMatch(/gold|lucky/i);
  });

  it("keeps grounded banter out of fourth-wall mode at low luck", () => {
    const attack = decorateAttackOutcome({ targetName: "Coin Wraith", damage: 5, highRoll: false }, 0);

    expect(attack.message).not.toMatch(/Dev|RNG|patch|seed|analytics|engine/i);
  });

  it("produces a wider variety of lines across different encounter inputs", () => {
    const encounterMessages = new Set(
      ["Pub Goblin", "Coin Wraith", "Bog Lurker", "Fae Debt Collector"].map((name, index) =>
        decorateMonsterEncounter({ monster: { name }, floor: index + 1, rooms: index + 2 }, 8).message
      )
    );
    const attackMessages = new Set(
      [4, 5, 6, 7, 8].map((damage, index) =>
        decorateAttackOutcome({ targetName: `Foe ${index}`, damage, highRoll: true }, 8).message
      )
    );

    expect(encounterMessages.size).toBeGreaterThan(2);
    expect(attackMessages.size).toBeGreaterThan(3);
  });
});
