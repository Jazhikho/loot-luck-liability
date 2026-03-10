import { describe, expect, it } from "vitest";
import { getCurrentLuck, getLuckyItemCount, getLuckUpgradeCost } from "./GameLogic.js";

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
});
