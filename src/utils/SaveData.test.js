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
});
