import { DUNGEONS } from "../data/Constants.js";
import { DEF_P, DEF_RS } from "../data/Defaults.js";
import { makeId } from "./Helpers.js";

export const SAVE_VERSION = 1;

const RUN_VIEWS = new Set(["shop", "pick", "combat", "floorHub"]);
const ITEM_RARITIES = new Set(["common", "uncommon", "rare", "legendary"]);
const AFTER_FIGHT_TYPES = new Set(["enterDungeon", "goShop", "floorHub"]);
const DEFAULT_UNLOCKED = [1, 2];

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toFiniteNumber(value, fallback, min = -Infinity, max = Infinity) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function toFiniteInt(value, fallback, min = -Infinity, max = Infinity) {
  return Math.round(toFiniteNumber(value, fallback, min, max));
}

function sanitizePlayer(raw) {
  if (!isRecord(raw)) return { ...DEF_P };
  return {
    hp: toFiniteInt(raw.hp, DEF_P.hp, 0),
    mhp: toFiniteInt(raw.mhp, DEF_P.mhp, 1),
    atk: toFiniteInt(raw.atk, DEF_P.atk, 1),
    def: toFiniteInt(raw.def, DEF_P.def, 0),
    gold: toFiniteInt(raw.gold, DEF_P.gold, 0),
    wlv: toFiniteInt(raw.wlv, DEF_P.wlv, 1),
    alv: toFiniteInt(raw.alv, DEF_P.alv, 1),
    pot: toFiniteInt(raw.pot, DEF_P.pot, 0),
  };
}

function sanitizeInventory(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => isRecord(item) && typeof item.name === "string" && ITEM_RARITIES.has(item.rarity))
    .map((item, index) => ({
      id: typeof item.id === "string" || Number.isFinite(item.id) ? item.id : makeId(`item-${index}`),
      name: item.name,
      value: toFiniteInt(item.value, 0, 0),
      emoji: typeof item.emoji === "string" ? item.emoji : "📦",
      rarity: item.rarity,
    }));
}

function sanitizeDungeon(raw) {
  if (!isRecord(raw)) return null;
  return DUNGEONS.find((dungeon) => dungeon.id === raw.id) || null;
}

function sanitizeFoe(raw) {
  if (!isRecord(raw) || typeof raw.name !== "string") return null;
  const maxHp = toFiniteInt(raw.maxHp, 1, 1);
  return {
    name: raw.name,
    emoji: typeof raw.emoji === "string" ? raw.emoji : "👹",
    hp: toFiniteInt(raw.hp, maxHp, 0, maxHp),
    maxHp,
    atk: toFiniteInt(raw.atk, 1, 1),
    def: toFiniteInt(raw.def, 0, 0),
  };
}

function sanitizeAfterFight(raw, dungeon, floor) {
  if (typeof raw === "string") {
    if (!AFTER_FIGHT_TYPES.has(raw)) return null;
    return raw === "goShop"
      ? { type: raw, completedDungeon: Boolean(dungeon && floor >= dungeon.floors) }
      : { type: raw };
  }
  if (!isRecord(raw) || !AFTER_FIGHT_TYPES.has(raw.type)) return null;
  return raw.type === "goShop"
    ? {
        type: "goShop",
        completedDungeon: Boolean(raw.completedDungeon) || Boolean(dungeon && floor >= dungeon.floors),
      }
    : { type: raw.type };
}

function sanitizeUnlocked(raw) {
  if (!Array.isArray(raw)) return [...DEFAULT_UNLOCKED];
  const ids = new Set(DEFAULT_UNLOCKED);
  raw.forEach((value) => {
    if (Number.isInteger(value) && DUNGEONS.some((dungeon) => dungeon.id === value)) ids.add(value);
  });
  return [...ids].sort((a, b) => a - b);
}

function sanitizeRunStats(raw) {
  if (!isRecord(raw)) return { ...DEF_RS };
  return {
    earned: toFiniteInt(raw.earned, DEF_RS.earned, 0),
    slain: toFiniteInt(raw.slain, DEF_RS.slain, 0),
    deepest: toFiniteInt(raw.deepest, DEF_RS.deepest, 0),
    rooms: toFiniteInt(raw.rooms, DEF_RS.rooms, 0),
    clears: toFiniteInt(raw.clears, DEF_RS.clears, 0),
  };
}

function sanitizeLog(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((entry) => isRecord(entry) && typeof entry.msg === "string" && typeof entry.type === "string")
    .slice(-40)
    .map((entry, index) => ({
      msg: entry.msg,
      type: entry.type,
      id: typeof entry.id === "string" || Number.isFinite(entry.id) ? entry.id : makeId(`log-${index}`),
    }));
}

export function normalizeSave(raw) {
  if (!isRecord(raw)) return null;

  const player = sanitizePlayer(raw.p);
  player.hp = Math.min(player.hp, player.mhp);

  const dungeon = sanitizeDungeon(raw.dng);
  const floor = dungeon ? toFiniteInt(raw.fl, 0, 0, dungeon.floors) : 0;
  const foe = sanitizeFoe(raw.foe);
  const normalized = {
    version: SAVE_VERSION,
    view: RUN_VIEWS.has(raw.view) ? raw.view : "shop",
    p: player,
    inv: sanitizeInventory(raw.inv),
    dng: dungeon,
    fl: floor,
    rooms: toFiniteInt(raw.rooms, 0, 0),
    foe,
    af: sanitizeAfterFight(raw.af, dungeon, floor),
    unlocked: sanitizeUnlocked(raw.unlocked),
    rs: sanitizeRunStats(raw.rs),
    log: sanitizeLog(raw.log),
  };

  if (normalized.view === "combat" && !normalized.foe) normalized.view = dungeon ? "floorHub" : "shop";
  if (normalized.view === "floorHub" && !normalized.dng) normalized.view = "shop";

  if (normalized.view === "shop") {
    normalized.dng = null;
    normalized.fl = 0;
    normalized.rooms = 0;
    normalized.foe = null;
    normalized.af = null;
  }

  if (normalized.view !== "combat") {
    normalized.foe = null;
    normalized.af = normalized.view === "floorHub" ? normalized.af : null;
  }

  return normalized;
}
