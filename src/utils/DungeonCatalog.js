import { DUNGEONS } from "../data/Constants.js";
import { localizeDungeon } from "../data/Content.js";

export const GENERATED_DUNGEON_ID_START = 1000;
export const MAX_GENERATED_DUNGEONS = 12;
const GENERATED_DISCOVERY_UNLOCK_THRESHOLD = 4;

const GENERATED_EMOJIS = ["🍀", "🪙", "🕯️", "🌈", "🍺", "🧾", "🔔", "🪵", "🪦", "🔥"];
const GENERATED_PREFIXES = [
  "Crooked",
  "Moonlit",
  "Shamrock",
  "Whistling",
  "Kegbound",
  "Bogglass",
  "Lantern-Lit",
  "Clover-Cursed",
  "Staggering",
  "Gold-Drenched",
];
const GENERATED_PLACES = [
  "Vault",
  "Warren",
  "Stair",
  "Cellars",
  "Crypt",
  "Crossroads",
  "Storehouse",
  "Catacombs",
  "Brewhall",
  "Hollow",
];
const GENERATED_SUFFIXES = [
  "Last Orders",
  "Bent Rainbows",
  "Kindly Debt",
  "Coin Weather",
  "Second Chances",
  "Miscounted Blessings",
  "Bad Bargains",
  "The Green Moon",
  "Unpaid Toasts",
  "Foolish Omens",
];
const GENERATED_DESCRIPTORS = [
  "Locals swear the treasure here is honest, which is how you know it isn't.",
  "Each chamber smells of wet gold, old ale, and a promise nobody remembers making.",
  "The broker calls it a fresh lead. The broker also lies recreationally.",
  "Every wall hums like a pub tune that has forgotten the right ending.",
  "Maps refuse to stay accurate for more than one floor at a time.",
  "Something inside keeps applauding bad decisions.",
];

function seededValue(index, salt) {
  const source = `${index}:${salt}`;
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 33 + source.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickSeeded(options, index, salt) {
  return options[seededValue(index, salt) % options.length];
}

export function getGeneratedDungeonCount(unlocked) {
  const unlockedCount = Array.isArray(unlocked) ? unlocked.length : 0;
  if (unlockedCount < GENERATED_DISCOVERY_UNLOCK_THRESHOLD) return 0;
  return Math.min(MAX_GENERATED_DUNGEONS, unlockedCount - GENERATED_DISCOVERY_UNLOCK_THRESHOLD + 1);
}

export function generateDungeon(index) {
  const tier = index <= 2 ? 2 : 3;
  const floors = Math.min(8, tier === 2 ? 5 + (seededValue(index, "floors") % 2) : 6 + (seededValue(index, "floors") % 3));
  const baseCost = tier === 2 ? 240 : 460;
  return {
    id: GENERATED_DUNGEON_ID_START + index,
    generated: true,
    tier,
    floors,
    cost: baseCost + index * (tier === 2 ? 90 : 140),
    e: pickSeeded(GENERATED_EMOJIS, index, "emoji"),
    name: `The ${pickSeeded(GENERATED_PREFIXES, index, "prefix")} ${pickSeeded(GENERATED_PLACES, index, "place")} of ${pickSeeded(GENERATED_SUFFIXES, index, "suffix")}`,
    desc: pickSeeded(GENERATED_DESCRIPTORS, index, "desc"),
  };
}

export function getDungeonCatalog(unlocked = [1, 2]) {
  const generatedCount = getGeneratedDungeonCount(unlocked);
  return [
    ...DUNGEONS.map(localizeDungeon),
    ...Array.from({ length: generatedCount }, (_, offset) => generateDungeon(offset + 1)),
  ];
}

export function getNewlyDiscoveredDungeons(previousUnlocked = [1, 2], nextUnlocked = [1, 2]) {
  const previousIds = new Set(getDungeonCatalog(previousUnlocked).map((dungeon) => dungeon.id));
  return getDungeonCatalog(nextUnlocked).filter((dungeon) => !previousIds.has(dungeon.id));
}

export function isKnownDungeonId(id) {
  return DUNGEONS.some((dungeon) => dungeon.id === id) || (Number.isInteger(id) && id > GENERATED_DUNGEON_ID_START && id <= GENERATED_DUNGEON_ID_START + MAX_GENERATED_DUNGEONS);
}
