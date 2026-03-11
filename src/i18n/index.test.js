import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getLocalizedDungeons, getLocalizedLootPools } from "../data/Content.js";
import { decorateAttackOutcome } from "../utils/LuckPresentation.js";
import {
  getLocale,
  getLocaleSource,
  resetLocaleState,
  setLocalePreference,
  t,
} from "./index.jsx";

const originalLanguage = window.navigator.language;

function setBrowserLanguage(language) {
  Object.defineProperty(window.navigator, "language", {
    configurable: true,
    value: language,
  });
}

describe("i18n scaffold", () => {
  beforeEach(() => {
    localStorage.clear();
    setBrowserLanguage("en-US");
    resetLocaleState();
  });

  afterEach(() => {
    localStorage.clear();
    setBrowserLanguage(originalLanguage);
    resetLocaleState();
  });

  it("resolves English UI keys by default for non-Spanish browsers", () => {
    expect(getLocale()).toBe("en");
    expect(getLocaleSource()).toBe("auto");
    expect(t("ui.title.creditsLabel")).toBe("Credits");
    expect(t("content.title")).toBe("Loot, Luck & Liability");
  });

  it("autodetects Spanish on first launch for Spanish browsers", () => {
    setBrowserLanguage("es-MX");
    resetLocaleState();

    expect(getLocale()).toBe("es");
    expect(getLocaleSource()).toBe("auto");
    expect(t("ui.title.startAdventure")).toMatch(/Empezar/i);
  });

  it("lets a manual override beat browser autodetect", () => {
    setBrowserLanguage("es-ES");
    resetLocaleState();

    setLocalePreference("en");

    expect(getLocale()).toBe("en");
    expect(getLocaleSource()).toBe("manual");
    expect(JSON.parse(localStorage.getItem("ll_locale_pref"))).toEqual({ source: "manual", locale: "en" });
  });

  it("resolves localized Spanish content lookups", () => {
    setLocalePreference("es");

    const dungeons = getLocalizedDungeons();
    const lootPools = getLocalizedLootPools();

    expect(dungeons[0].name).toMatch(/Bodega/i);
    expect(lootPools.legendary.some((item) => /Recibo|Sacacorchos|Sello/.test(item.n))).toBe(true);
  });

  it("falls back to English when a placeholder locale has no translation yet", () => {
    setLocalePreference("ja");

    expect(t("ui.title.creditsLabel")).toBe("Credits");
    expect(t("content.loot.receipt_from_the_end_of_the_rainbow.name")).toBe("Receipt from the End of the Rainbow");
  });

  it("keeps localized content lookups valid under a placeholder locale", () => {
    setLocalePreference("ru");

    const dungeons = getLocalizedDungeons();
    const lootPools = getLocalizedLootPools();

    expect(dungeons[0].name).toBe("The Clover Cellar");
    expect(lootPools.legendary.some((item) => item.n === "Receipt from the End of the Rainbow")).toBe(true);
  });

  it("routes dialogue through the active locale", () => {
    setLocalePreference("es");

    const attack = decorateAttackOutcome(
      { targetId: "coin_wraith", targetName: "Espectro de Moneda", damage: 7, highRoll: true },
      8
    );

    expect(attack.message).toMatch(/Espectro|damage|golpe|motor|universo|fortuna/i);
  });
});
