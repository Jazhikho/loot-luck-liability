import { describe, expect, it } from "vitest";
import { ACHDEFS, DUNGEONS, EMPTY_ROOMS, EXPLORE_FLAVOR, GAME_BLURB, GAME_TAGLINE, GAME_TITLE, GREETINGS, LOOT, MONSTERS, SELL_QUOTES } from "./Constants.js";
import { resources } from "../i18n/resources.js";

const BAD_ENCODING_PATTERN = /[\u00C3\u00C2\u00F0\u00C5]|â€|â€™/;

function collectStrings(value, strings = []) {
  if (typeof value === "string") {
    strings.push(value);
    return strings;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectStrings(entry, strings));
    return strings;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((entry) => collectStrings(entry, strings));
  }

  return strings;
}

describe("content encoding", () => {
  it("keeps core game constants free of mojibake", () => {
    const strings = collectStrings([
      GAME_TITLE,
      GAME_TAGLINE,
      GAME_BLURB,
      LOOT,
      DUNGEONS,
      MONSTERS,
      ACHDEFS,
      GREETINGS,
      SELL_QUOTES,
      EXPLORE_FLAVOR,
      EMPTY_ROOMS,
    ]);

    expect(strings.some((entry) => BAD_ENCODING_PATTERN.test(entry))).toBe(false);
  });

  it("keeps localized resource strings free of mojibake", () => {
    const strings = collectStrings(resources);
    expect(strings.some((entry) => BAD_ENCODING_PATTERN.test(entry))).toBe(false);
  });
});
