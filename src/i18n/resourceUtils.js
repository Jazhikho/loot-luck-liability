import {
  ACHDEFS,
  DUNGEONS,
  EMPTY_ROOMS,
  EXPLORE_FLAVOR,
  GAME_BLURB,
  GAME_TAGLINE,
  GAME_TITLE,
  GREETINGS,
  LOOT,
  MONSTERS,
  SELL_QUOTES,
} from "../data/Constants.js";

const MOJIBAKE_PATTERN = /ÃƒÆ’|Ãƒ|Ã‚|Ã¢â‚¬Â¢|Ã¢â‚¬â„¢|Ã¢â‚¬Å“|Ã¢â‚¬\u009d|Ã¢â‚¬â€|Ã¢â‚¬â€œ/;
const UTF8_DECODER = new TextDecoder("utf-8", { fatal: false });

function latin1StringToBytes(value) {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }
  return bytes;
}

function normalizeMojibakeString(value) {
  if (!MOJIBAKE_PATTERN.test(value)) {
    return value;
  }

  let nextValue = value;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const decoded = UTF8_DECODER.decode(latin1StringToBytes(nextValue));
    if (decoded === nextValue) {
      break;
    }
    nextValue = decoded;
    if (!MOJIBAKE_PATTERN.test(nextValue)) {
      break;
    }
  }

  return nextValue;
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge(base, overrides) {
  if (!isRecord(base) || !isRecord(overrides)) {
    return overrides === undefined ? base : overrides;
  }

  const next = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    next[key] = key in base ? deepMerge(base[key], value) : value;
  }
  return next;
}

export function normalizeLocaleStrings(value) {
  if (typeof value === "string") {
    return normalizeMojibakeString(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeLocaleStrings(entry));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeLocaleStrings(entry)])
    );
  }

  return value;
}

export function makeMap(entries) {
  return Object.fromEntries(entries);
}

export function buildEnglishContent() {
  return {
    title: GAME_TITLE,
    tagline: GAME_TAGLINE,
    blurb: GAME_BLURB,
    loot: Object.fromEntries(
      Object.values(LOOT)
        .flat()
        .map((item) => [item.id, { name: item.n }])
    ),
    dungeons: Object.fromEntries(DUNGEONS.map((dungeon) => [dungeon.key, { name: dungeon.name, desc: dungeon.desc }])),
    monsters: Object.fromEntries(MONSTERS.map((monster) => [monster.id, { name: monster.name }])),
    achievements: Object.fromEntries(
      ACHDEFS.map((achievement) => [
        achievement.id,
        { name: achievement.name, desc: achievement.desc, hidden: Boolean(achievement.hidden) },
      ])
    ),
    greetings: GREETINGS,
    sellQuotes: SELL_QUOTES,
    exploreFlavor: EXPLORE_FLAVOR,
    emptyRooms: EMPTY_ROOMS,
  };
}
