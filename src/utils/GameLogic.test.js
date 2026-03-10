import { describe, expect, it } from "vitest";
import {
  getArmorUpgradeBenefit,
  getCombatWarning,
  getCurrentLuck,
  getLockedItemCount,
  getLuckyItemCount,
  getLuckUpgradeCost,
  getSellableTotal,
  getWeaponUpgradeBenefit,
} from "./GameLogic.js";

describe("GameLogic luck helpers", () => {
  it("uses the fixed luck upgrade cost curve", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7].map(getLuckUpgradeCost)).toEqual([20, 35, 55, 80, 110, 145, 185, 225]);
  });

  it("computes active luck from base luck and carried lucky cargo", () => {
    expect(
      getCurrentLuck(
        { luck: 2 },
        [
          { name: "Charm", luck: 1 },
          { name: "Crate", luck: 0 },
          { name: "Seal", luck: 3 },
        ]
      )
    ).toBe(6);
    expect(getLuckyItemCount([{ luck: 1 }, { luck: 0 }, {}, { luck: 2 }])).toBe(2);
  });

  it("tracks locked cargo separately from bulk sale totals", () => {
    const inventory = [
      { value: 10, locked: false },
      { value: 20, locked: true },
      { value: 15 },
    ];

    expect(getLockedItemCount(inventory)).toBe(1);
    expect(getSellableTotal(inventory)).toBe(25);
  });

  it("returns the stronger upgrade bundles and lethal combat warnings", () => {
    expect(getWeaponUpgradeBenefit()).toEqual({ atk: 4 });
    expect(getArmorUpgradeBenefit()).toEqual({ def: 3, hp: 6 });
    expect(getCombatWarning({ hp: 6, mhp: 50, def: 2 }, { atk: 6 })).toMatch(/ends this run/i);
  });
});
