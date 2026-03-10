import { describe, expect, it } from "vitest";
import { generateDungeon, getDungeonCatalog, getGeneratedDungeonCount, getNewlyDiscoveredDungeons } from "./DungeonCatalog.js";

describe("DungeonCatalog", () => {
  it("reveals generated dungeons only after enough unlocks", () => {
    expect(getGeneratedDungeonCount([1, 2, 3])).toBe(0);
    expect(getGeneratedDungeonCount([1, 2, 3, 4])).toBe(1);
    expect(getGeneratedDungeonCount([1, 2, 3, 4, 5])).toBe(2);
  });

  it("generates deterministic St. Paddy flavored dungeon definitions", () => {
    const first = generateDungeon(1);
    const second = generateDungeon(1);

    expect(first).toEqual(second);
    expect(first.generated).toBe(true);
    expect(first.id).toBe(1001);
    expect(first.name).toMatch(/^The /);
  });

  it("reports newly discovered dungeons as the unlock list grows", () => {
    const discoveries = getNewlyDiscoveredDungeons([1, 2, 3], [1, 2, 3, 4]);

    expect(discoveries).toHaveLength(1);
    expect(discoveries[0].generated).toBe(true);
    expect(getDungeonCatalog([1, 2, 3, 4]).some((dungeon) => dungeon.id === discoveries[0].id)).toBe(true);
  });
});
