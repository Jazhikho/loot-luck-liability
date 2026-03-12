import { describe, expect, it, vi } from "vitest";
import {
  getArmorUpgradeBenefit,
  getCombatWarning,
  getCombatWarningState,
  getCurrentLuck,
  getLockedItemCount,
  getLootPoolSnapshot,
  getLuckyItemCount,
  getLuckUpgradeCost,
  getRoomOutcomeChances,
  getSellableTotal,
  getTownDepartureState,
  getWeaponUpgradeBenefit,
  rollLoot,
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

  it("returns the stronger upgrade bundles and only warns in combat when the foe can actually kill you", () => {
    expect(getWeaponUpgradeBenefit()).toEqual({ atk: 4 });
    expect(getArmorUpgradeBenefit()).toEqual({ def: 3, hp: 6 });
    expect(getCombatWarning({ hp: 6, mhp: 50, def: 2 }, { atk: 6 })).toMatch(/ends this run/i);
    expect(getCombatWarningState({ hp: 7, mhp: 50, def: 2 }, { atk: 6 })).toBe("");
  });

  it("uses yellow and red town departure thresholds at seventy-five and fifty percent", () => {
    expect(getTownDepartureState({ hp: 50, mhp: 50 })).toBe("");
    expect(getTownDepartureState({ hp: 37, mhp: 50 })).toBe("caution");
    expect(getTownDepartureState({ hp: 25, mhp: 50 })).toBe("caution");
    expect(getTownDepartureState({ hp: 24, mhp: 50 })).toBe("critical");
  });

  it("opens deeper, higher-tier loot within a rarity while keeping earlier loot eligible", () => {
    const earlyRare = getLootPoolSnapshot("rare", 1, 1, 0).map((entry) => entry.item.n);
    const deepRare = getLootPoolSnapshot("rare", 6, 3, 6);
    const deepRareNames = deepRare.map((entry) => entry.item.n);

    expect(earlyRare).toContain("Leprechaun Bail Bond");
    expect(earlyRare).not.toContain("Coin Harp String Wound in Moon Gold");
    expect(deepRareNames).toContain("Leprechaun Bail Bond");
    expect(deepRareNames).toContain("Coin Harp String Wound in Moon Gold");
    expect(
      deepRare.find((entry) => entry.item.n === "Coin Harp String Wound in Moon Gold").weight
    ).toBeGreaterThan(deepRare.find((entry) => entry.item.n === "Leprechaun Bail Bond").weight);
  });

  it("biases deeper runs toward better loot while keeping lower-tier finds possible", () => {
    let seed = 123456789;
    const randomSpy = vi.spyOn(Math, "random").mockImplementation(() => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    });

    const rarityScore = { common: 1, uncommon: 2, rare: 3, legendary: 4 };
    const early = Array.from({ length: 400 }, () => rollLoot(1, 1, 0));
    const deep = Array.from({ length: 400 }, () => rollLoot(7, 3, 6));
    randomSpy.mockRestore();

    const averageScore = (drops) =>
      drops.reduce((sum, item) => sum + rarityScore[item.rarity], 0) / drops.length;

    expect(averageScore(deep)).toBeGreaterThan(averageScore(early));
    expect(deep.some((item) => item.rarity === "common")).toBe(true);
  });

  it("dries up shallow floor farming while keeping deeper pushes worthwhile", () => {
    const freshCellar = getRoomOutcomeChances(1, 1, 1);
    const overfarmedCellar = getRoomOutcomeChances(1, 1, 18);
    const deeperPush = getRoomOutcomeChances(5, 3, 6);

    expect(overfarmedCellar.loot).toBeLessThan(freshCellar.loot / 4);
    expect(overfarmedCellar.empty).toBeGreaterThan(freshCellar.empty);
    expect(deeperPush.loot).toBeGreaterThan(overfarmedCellar.loot);
  });

  it("stops room count from inflating shallow loot quality forever", () => {
    let seed = 246813579;
    const randomSpy = vi.spyOn(Math, "random").mockImplementation(() => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    });

    const rarityScore = { common: 1, uncommon: 2, rare: 3, legendary: 4 };
    const freshShallow = Array.from({ length: 400 }, () => rollLoot(1, 1, 2));
    const overfarmedShallow = Array.from({ length: 400 }, () => rollLoot(1, 1, 18));
    const deep = Array.from({ length: 400 }, () => rollLoot(7, 3, 6));
    randomSpy.mockRestore();

    const averageScore = (drops) =>
      drops.reduce((sum, item) => sum + rarityScore[item.rarity], 0) / drops.length;
    const averageValue = (drops) => drops.reduce((sum, item) => sum + item.value, 0) / drops.length;

    expect(averageScore(overfarmedShallow)).toBeLessThan(averageScore(freshShallow));
    expect(averageValue(overfarmedShallow)).toBeLessThan(averageValue(freshShallow));
    expect(averageScore(deep)).toBeGreaterThan(averageScore(overfarmedShallow));
    expect(averageValue(deep)).toBeGreaterThan(averageValue(overfarmedShallow));
  });
});
