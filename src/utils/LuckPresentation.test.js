import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { dialogueResources } from "../i18n/dialogueResources.js";
import { resetLocaleState, setLocalePreference } from "../i18n/index.jsx";
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

const MONSTER_EVENT_CATEGORIES = ["encounterQuote", "hurtQuote", "enemyAttackQuote", "defeatQuote"];

describe("LuckPresentation", () => {
  beforeEach(() => {
    localStorage.clear();
    resetLocaleState();
  });

  afterEach(() => {
    localStorage.clear();
    resetLocaleState();
  });

  it("maps the published luck tiers correctly", () => {
    expect(getLuckTier(0).key).toBe("grounded");
    expect(getLuckTier(5).key).toBe("fortunate");
    expect(getLuckTier(10).key).toBe("uncanny");
    expect(getLuckTier(20).key).toBe("clover-cursed");
    expect(getLuckTier(35).key).toBe("reality-slippery");
    expect(getLuckTier(73).key).toBe("probability-fraud");
    expect(getLuckTier(80).key).toBe("narrative-leak");
    expect(getLuckTier(110).key).toBe("engine-haunted");
    expect(getLuckTier(145).key).toBe("patch-note-saint");
    expect(getLuckTier(185).key).toBe("luck-event-horizon");
  });

  it("gives every monster at least ten lines per monster-driven event pool", () => {
    for (const localeId of ["en", "es"]) {
      const monsters = dialogueResources[localeId].monsterQuotes;
      for (const [monsterId, quoteSet] of Object.entries(monsters)) {
        for (const category of MONSTER_EVENT_CATEGORIES) {
          for (const tierKey of ["grounded", "fortunate", "uncanny", "clover-cursed"]) {
            expect(quoteSet[category][tierKey].length, `${localeId}:${monsterId}:${category}:${tierKey}`).toBeGreaterThanOrEqual(10);
          }
        }
      }
    }
  });

  it("changes combat narration without changing resolved damage", () => {
    const resolved = { targetId: "coin_wraith", targetName: "Coin Wraith", damage: 7, highRoll: true };

    const grounded = decorateAttackOutcome(resolved, 0);
    const cursed = decorateAttackOutcome(resolved, 8);

    expect(grounded.damage).toBe(7);
    expect(cursed.damage).toBe(7);
    expect(grounded.message).not.toBe(cursed.message);
  });

  it("keeps narration deterministic for the same input", () => {
    const resolved = { targetId: "coin_wraith", targetName: "Coin Wraith", damage: 7, highRoll: true };

    expect(decorateAttackOutcome(resolved, 8).message).toBe(decorateAttackOutcome(resolved, 8).message);
    expect(
      decorateEnemyAttackOutcome({ attackerId: "pub_goblin", attackerName: "Pub Goblin", damage: 4 }, 5).message
    ).toBe(decorateEnemyAttackOutcome({ attackerId: "pub_goblin", attackerName: "Pub Goblin", damage: 4 }, 5).message);
  });

  it("rotates combat quotes across consecutive turns when a sequence is provided", () => {
    const firstAttack = decorateAttackOutcome(
      { targetId: "pub_goblin", targetName: "Pub Goblin", damage: 3, highRoll: false, sequence: 1 },
      0
    );
    const secondAttack = decorateAttackOutcome(
      { targetId: "pub_goblin", targetName: "Pub Goblin", damage: 3, highRoll: false, sequence: 3 },
      0
    );
    const firstEnemy = decorateEnemyAttackOutcome(
      { attackerId: "pub_goblin", attackerName: "Pub Goblin", damage: 1, sequence: 2 },
      0
    );
    const secondEnemy = decorateEnemyAttackOutcome(
      { attackerId: "pub_goblin", attackerName: "Pub Goblin", damage: 1, sequence: 4 },
      0
    );

    expect(firstAttack.message).not.toBe(secondAttack.message);
    expect(firstEnemy.message).not.toBe(secondEnemy.message);
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
      monster: { id: "bog_king_on_a_bad_night", name: "Bog King on a Bad Night", hp: 40, maxHp: 40, atk: 12, def: 6 },
      floor: 4,
      rooms: 3,
    };

    const grounded = decorateMonsterEncounter(encounter, 0);
    const cursed = decorateMonsterEncounter(encounter, 145);

    expect(grounded.monster).toEqual(cursed.monster);
    expect(cursed.encounterTitle).toMatch(/Lucky Find|Patch Blessing|Hotfixed Encounter/i);
    expect(grounded.encounterTitle).toBe("");
  });

  it("uses fourth-wall enemy dialogue at clover-cursed luck", () => {
    const encounter = decorateMonsterEncounter(
      {
        monster: { id: "pub_goblin", name: "Pub Goblin", hp: 12, maxHp: 12, atk: 3, def: 1 },
        floor: 1,
        rooms: 1,
      },
      145
    );
    const enemyAttack = decorateEnemyAttackOutcome({ attackerId: "pub_goblin", attackerName: "Pub Goblin", damage: 4 }, 145);
    const defeat = decorateEnemyDefeatOutcome({ foeId: "pub_goblin", foeName: "Pub Goblin" }, 145);

    expect([encounter.message, encounter.bannerLabel, encounter.systemNotice, encounter.cosmeticSubtitle].join(" ")).toMatch(
      /Dev|seed|patch|analytics|geometry|QA|FORTUNE|PATCH/i
    );
    expect([enemyAttack.message, enemyAttack.systemNotice].join(" ")).toMatch(/RNG|Dev|seed|frame|engine|patch/i);
    expect([defeat.message, defeat.systemNotice, defeat.narratorAside].join(" ")).toMatch(
      /Dev|RNG|patch|analytics|metrics|bug report|tooltips|intended behavior|joke landed|patch/i
    );
  });

  it("adds more varied absurd text to travel, traps, and empty rooms at high luck", () => {
    const travel = decorateTravelOutcome({ kind: "potion" }, 185);
    const trap = decorateTrapOutcome({ damage: 9, fatal: false }, 185);
    const empty = decorateEmptyRoomOutcome({ baseText: "Only dust waits here." }, 185);

    expect([travel.message, travel.systemNotice, travel.narratorAside].join(" ")).toMatch(
      /universe|loading-screen|spawn|destiny|fortune|cause and effect|bug report/i
    );
    expect([trap.message, trap.systemNotice, trap.narratorAside].join(" ")).toMatch(
      /barrel|stage cue|physics|hardware|engine|fortune|patch/i
    );
    expect([empty.message, empty.systemNotice, empty.narratorAside].join(" ")).toMatch(
      /Dev|comedian|reality|hilarious|universe|spec/i
    );
  });

  it("only reframes already-resolved death outcomes", () => {
    const death = { cause: "trap", foeName: null };

    const grounded = decorateDeathOutcome(death, 0);
    const cursed = decorateDeathOutcome(death, 185);

    expect(grounded.cause).toBe("trap");
    expect(cursed.cause).toBe("trap");
    expect([cursed.message, cursed.systemNotice, cursed.narratorAside].join(" ")).toMatch(/gold|lucky|fortune|reality/i);
  });

  it("keeps grounded banter out of fourth-wall mode at low luck", () => {
    const attack = decorateAttackOutcome({ targetId: "coin_wraith", targetName: "Coin Wraith", damage: 5, highRoll: false }, 0);

    expect(attack.message).not.toMatch(/Dev|RNG|patch|seed|analytics|engine/i);
  });

  it("surfaces Spanish writing when Spanish is active", () => {
    setLocalePreference("es");

    const encounter = decorateMonsterEncounter(
      {
        monster: { id: "fae_debt_collector", name: "Cobrador de Deudas Feérico", hp: 12, maxHp: 12, atk: 3, def: 1 },
        floor: 2,
        rooms: 2,
      },
      145
    );

    expect(encounter.message).toMatch(/Dev|sala|algoritmo|semilla|fortuna|clip/i);
  });
});
