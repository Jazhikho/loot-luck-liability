import { describe, expect, it } from "vitest";
import { normalizeSave } from "./SaveData.js";

describe("normalizeSave", () => {
  it("returns null for non-object payloads", () => {
    expect(normalizeSave(null)).toBeNull();
    expect(normalizeSave("bad")).toBeNull();
  });

  it("normalizes invalid combat saves back to a safe shop state", () => {
    const normalized = normalizeSave({
      view: "combat",
      p: { hp: 40, mhp: 50, atk: 5, def: 2, gold: 10, wlv: 1, alv: 1, pot: 1 },
      inv: [],
      dng: null,
      fl: 0,
      rooms: 0,
      foe: null,
      af: null,
      unlocked: [1, 2, 2, 999],
      rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
      log: [],
    });

    expect(normalized.view).toBe("shop");
    expect(normalized.dng).toBeNull();
    expect(normalized.foe).toBeNull();
    expect(normalized.unlocked).toEqual([1, 2]);
  });

  it("defaults missing player and inventory luck fields to zero", () => {
    const normalized = normalizeSave({
      view: "shop",
      p: { hp: 40, mhp: 50, atk: 5, def: 2, gold: 10, wlv: 1, alv: 1, pot: 1 },
      inv: [{ id: "item-1", name: "Charm", value: 12, emoji: "C", rarity: "common" }],
      dng: null,
      fl: 0,
      rooms: 0,
      foe: null,
      af: null,
      unlocked: [1, 2],
      rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
      log: [],
    });

    expect(normalized.p.luck).toBe(0);
    expect(normalized.inv[0].luck).toBe(0);
  });

  it("preserves cosmetic foe presentation fields in combat saves", () => {
    const normalized = normalizeSave({
      view: "combat",
      p: { hp: 40, mhp: 50, atk: 5, def: 2, gold: 10, wlv: 1, alv: 1, pot: 1, luck: 2 },
      inv: [],
      dng: { id: 1 },
      fl: 1,
      rooms: 2,
      foe: {
        name: "Coin Wraith",
        displayName: "Coin Wraith",
        encounterTitle: "Lucky Find!",
        emoji: "W",
        hp: 8,
        maxHp: 10,
        atk: 4,
        def: 2,
      },
      af: { type: "floorHub" },
      unlocked: [1, 2],
      rs: { earned: 0, slain: 0, deepest: 0, rooms: 0, clears: 0 },
      log: [],
    });

    expect(normalized.view).toBe("combat");
    expect(normalized.foe.displayName).toBe("Coin Wraith");
    expect(normalized.foe.encounterTitle).toBe("Lucky Find!");
  });

  it("restores generated dungeons when their ids are in the unlocked list", () => {
    const normalized = normalizeSave({
      view: "floorHub",
      p: { hp: 40, mhp: 50, atk: 5, def: 2, gold: 10, wlv: 1, alv: 1, pot: 1, luck: 0 },
      inv: [],
      dng: { id: 1001 },
      fl: 2,
      rooms: 1,
      foe: null,
      af: { type: "floorHub" },
      unlocked: [1, 2, 3, 4, 1001],
      rs: { earned: 0, slain: 0, deepest: 2, rooms: 1, clears: 0 },
      log: [],
    });

    expect(normalized.view).toBe("floorHub");
    expect(normalized.dng.id).toBe(1001);
    expect(normalized.dng.generated).toBe(true);
  });
});
