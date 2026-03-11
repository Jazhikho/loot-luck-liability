import { afterEach, describe, expect, it } from "vitest";
import { getLocalizedDungeons, getLocalizedLootPools } from "../data/Content.js";
import { decorateAttackOutcome } from "../utils/LuckPresentation.js";
import { getLocale, setLocale, t } from "./index.jsx";

describe("i18n scaffold", () => {
  afterEach(() => {
    setLocale("en");
  });

  it("resolves English UI keys by default", () => {
    expect(getLocale()).toBe("en");
    expect(t("ui.title.creditsLabel")).toBe("Credits");
    expect(t("content.title")).toBe("Loot, Luck & Liability");
  });

  it("falls back to English when a locale placeholder has no translation yet", () => {
    setLocale("es");

    expect(t("ui.title.creditsLabel")).toBe("Credits");
    expect(t("content.loot.receipt_from_the_end_of_the_rainbow.name")).toBe("Receipt from the End of the Rainbow");
  });

  it("keeps localized content lookups valid under a placeholder locale", () => {
    setLocale("ja");

    const dungeons = getLocalizedDungeons();
    const lootPools = getLocalizedLootPools();

    expect(dungeons[0].name).toBe("The Clover Cellar");
    expect(lootPools.legendary.some((item) => item.n === "Receipt from the End of the Rainbow")).toBe(true);
  });

  it("falls back to English dialogue when a locale has no dedicated banter yet", () => {
    setLocale("ru");

    const attack = decorateAttackOutcome({ targetName: "Coin Wraith", damage: 7, highRoll: true }, 8);

    expect(attack.message).toMatch(/Coin Wraith/);
    expect(attack.message).toMatch(/7/);
  });
});
