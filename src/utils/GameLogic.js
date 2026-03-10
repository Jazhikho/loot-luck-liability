import { makeId, pick } from "./Helpers.js";
import { LOOT, MONSTERS } from "../data/Constants.js";

const LUCK_UPGRADE_COSTS = [20, 35, 55, 80, 110, 145];
const WEAPON_ATK_BONUS = 4;
const ARMOR_DEF_BONUS = 3;
const ARMOR_HP_BONUS = 6;

const LOOT_METADATA = {
  uncommon: {
    "Moonlit Bodhran with a Cracked Skin": { minTier: 1, minFloor: 1, weight: 1.1, floorScale: 0.18, tierScale: 0.14 },
    "Cloak of the Last Call Prophet": { minTier: 2, minFloor: 2, weight: 0.9, floorScale: 0.32, tierScale: 0.42 },
    "Bottle of Rainbow Sediment": { minTier: 2, minFloor: 3, weight: 0.85, floorScale: 0.35, tierScale: 0.45 },
    "Ledger of Near-Missed Miracles": { minTier: 2, minFloor: 4, weight: 0.8, floorScale: 0.38, tierScale: 0.5 },
    "Silver Spoon of the Seventh Pour": { minTier: 3, minFloor: 4, weight: 0.65, floorScale: 0.45, tierScale: 0.58 },
  },
  rare: {
    "Leprechaun Bail Bond": { minTier: 1, minFloor: 1, weight: 1, floorScale: 0.16, tierScale: 0.14 },
    "Emerald Poker from the Kindly Folk": { minTier: 2, minFloor: 3, weight: 0.9, floorScale: 0.28, tierScale: 0.36 },
    "Crown Cork of the Golden Keg": { minTier: 2, minFloor: 3, weight: 0.9, floorScale: 0.26, tierScale: 0.32 },
    "Fae Toll Bell on a Silk Chain": { minTier: 2, minFloor: 4, weight: 0.8, floorScale: 0.34, tierScale: 0.46 },
    "Bogfire Lantern of Fortunate Missteps": { minTier: 3, minFloor: 5, weight: 0.7, floorScale: 0.4, tierScale: 0.58 },
    "Coin Harp String Wound in Moon Gold": { minTier: 3, minFloor: 6, weight: 0.6, floorScale: 0.48, tierScale: 0.64 },
  },
  legendary: {
    "Receipt from the End of the Rainbow": { minTier: 1, minFloor: 1, weight: 0.9, floorScale: 0.32, tierScale: 0.38 },
    "The Broker's Blessed Corkscrew": { minTier: 2, minFloor: 5, weight: 0.82, floorScale: 0.36, tierScale: 0.44 },
    "Clover-Cursed Treasury Seal": { minTier: 3, minFloor: 6, weight: 0.72, floorScale: 0.42, tierScale: 0.54 },
    "Keg Crown of the Lucky Wake": { minTier: 3, minFloor: 6, weight: 0.68, floorScale: 0.44, tierScale: 0.56 },
    "Harp String Cut from a Fae Moonbeam": { minTier: 3, minFloor: 7, weight: 0.62, floorScale: 0.5, tierScale: 0.62 },
    "Final Coin from Saint Brigid's Poker Table": { minTier: 3, minFloor: 8, weight: 0.58, floorScale: 0.56, tierScale: 0.7 },
  },
};

const DEFAULT_LOOT_META = {
  minTier: 1,
  minFloor: 1,
  weight: 1,
  floorScale: 0.08,
  tierScale: 0.1,
  roomScale: 0.02,
};

/**
 * Roll a loot item based on floor, tier, and rooms explored.
 * @param {number} floor
 * @param {number} tier
 * @param {number} rooms
 * @returns {{ name: string, value: number, emoji: string, rarity: string, id: number }}
 */
export function rollLoot(floor, tier, rooms) {
  const r = Math.random() * 100;
  const s = floor * 3.2 + tier * 4 + rooms * 0.8;
  let rarity;
  if (r < 2 + s * 0.85) rarity = "legendary";
  else if (r < 11 + s * 1.45) rarity = "rare";
  else if (r < 34 + s * 1.1) rarity = "uncommon";
  else rarity = "common";
  const item = pickWeighted(getLootPoolSnapshot(rarity, floor, tier, rooms));
  const mult = 1 + floor * 0.15 + (tier - 1) * 0.25 + rooms * 0.03;
  return {
    name: item.n,
    value: Math.round(item.v * mult),
    emoji: item.e,
    luck: item.luck || 0,
    rarity,
    id: makeId("loot"),
  };
}

function pickWeighted(pool) {
  if (pool.length === 0) return null;
  const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return pool[pool.length - 1].item;
}

function getLootMeta(rarity, item) {
  return {
    ...DEFAULT_LOOT_META,
    ...(LOOT_METADATA[rarity]?.[item.n] || {}),
  };
}

export function getLootPoolSnapshot(rarity, floor, tier, rooms) {
  const pool = LOOT[rarity] || [];
  const eligible = pool
    .map((item) => {
      const meta = getLootMeta(rarity, item);
      return { item, meta };
    })
    .filter(({ meta }) => tier >= meta.minTier && floor >= meta.minFloor);

  const source = eligible.length > 0 ? eligible : pool.map((item) => ({ item, meta: getLootMeta(rarity, item) }));

  return source.map(({ item, meta }) => ({
    item,
    weight:
      meta.weight *
      (1 +
        tier * meta.tierScale +
        floor * meta.floorScale +
        rooms * meta.roomScale),
  }));
}

/**
 * Spawn a monster for the given floor/tier/rooms.
 * @param {number} floor
 * @param {number} tier
 * @param {number} rooms
 * @returns {{ name: string, emoji: string, hp: number, maxHp: number, atk: number, def: number }}
 */
export function spawnMonster(floor, tier, rooms) {
  const et = rooms >= 5 && tier < 3 ? Math.min(3, tier + 1) : tier;
  const pool = MONSTERS.filter((m) => m.t <= et);
  const t = pick(pool);
  const s = 1 + (floor - 1) * 0.3 + (tier - 1) * 0.4 + rooms * 0.08;
  return {
    name: t.name,
    emoji: t.e,
    hp: Math.round(t.hp * s),
    maxHp: Math.round(t.hp * s),
    atk: Math.round(t.atk * s),
    def: Math.round(t.def * s),
  };
}

/**
 * Get danger level for floor/tier/rooms.
 * @param {number} floor
 * @param {number} tier
 * @param {number} rooms
 * @returns {{ label: string, color: string, bars: number }}
 */
export function getDanger(floor, tier, rooms) {
  const d = Math.min(10, Math.round(floor * 1.2 + tier * 1.5 + rooms * 0.7));
  if (d <= 2) return { label: "Calm", color: "text-green-400", bars: d };
  if (d <= 4) return { label: "Uneasy", color: "text-yellow-400", bars: d };
  if (d <= 6) return { label: "Dangerous", color: "text-orange-400", bars: d };
  if (d <= 8) return { label: "Perilous", color: "text-red-400", bars: d };
  return { label: "Suicidal", color: "text-red-300", bars: d };
}

/**
 * Upgrade cost for weapon/armor level (next level).
 * @param {number} lvl
 * @returns {number}
 */
export function upgCost(lvl) {
  return 30 * lvl * lvl;
}

/**
 * Luck upgrade cost for the next point of run luck.
 * @param {number} luck
 * @returns {number}
 */
export function getLuckUpgradeCost(luck) {
  if (luck < LUCK_UPGRADE_COSTS.length) return LUCK_UPGRADE_COSTS[luck];
  const overflow = luck - (LUCK_UPGRADE_COSTS.length - 1);
  return LUCK_UPGRADE_COSTS[LUCK_UPGRADE_COSTS.length - 1] + overflow * 40;
}

/**
 * Weapon upgrade gains for the next purchase.
 * @returns {{ atk: number }}
 */
export function getWeaponUpgradeBenefit() {
  return { atk: WEAPON_ATK_BONUS };
}

/**
 * Armor upgrade gains for the next purchase.
 * @returns {{ def: number, hp: number }}
 */
export function getArmorUpgradeBenefit() {
  return { def: ARMOR_DEF_BONUS, hp: ARMOR_HP_BONUS };
}

/**
 * Total active luck from player base luck plus carried lucky cargo.
 * @param {{ luck?: number }} player
 * @param {{ luck?: number }[]} inventory
 * @returns {number}
 */
export function getCurrentLuck(player, inventory) {
  const baseLuck = Number.isFinite(player?.luck) ? player.luck : 0;
  const carriedLuck = Array.isArray(inventory)
    ? inventory.reduce((sum, item) => sum + (Number.isFinite(item?.luck) ? item.luck : 0), 0)
    : 0;
  return baseLuck + carriedLuck;
}

/**
 * Count carried cargo items that grant luck.
 * @param {{ luck?: number }[]} inventory
 * @returns {number}
 */
export function getLuckyItemCount(inventory) {
  if (!Array.isArray(inventory)) return 0;
  return inventory.filter((item) => Number.isFinite(item?.luck) && item.luck > 0).length;
}

/**
 * Count cargo items marked to stay out of bulk sales.
 * @param {{ locked?: boolean }[]} inventory
 * @returns {number}
 */
export function getLockedItemCount(inventory) {
  if (!Array.isArray(inventory)) return 0;
  return inventory.filter((item) => item?.locked === true).length;
}

/**
 * Get all cargo items eligible for a bulk cash-in.
 * @param {{ locked?: boolean }[]} inventory
 * @returns {Array}
 */
export function getSellableItems(inventory) {
  if (!Array.isArray(inventory)) return [];
  return inventory.filter((item) => item?.locked !== true);
}

/**
 * Sum the value of all cargo items eligible for a bulk cash-in.
 * @param {{ value?: number, locked?: boolean }[]} inventory
 * @returns {number}
 */
export function getSellableTotal(inventory) {
  return getSellableItems(inventory).reduce((sum, item) => sum + (Number.isFinite(item?.value) ? item.value : 0), 0);
}

/**
 * Whether the player can spend a potion for a non-zero heal.
 * @param {{ hp: number, mhp: number, pot: number }} player
 * @returns {boolean}
 */
export function canUsePotion(player) {
  return Boolean(player && player.pot > 0 && player.hp < player.mhp);
}

/**
 * Highest possible damage the active foe can deal this turn.
 * @param {{ atk: number } | null} foe
 * @param {{ def: number } | null} player
 * @returns {number}
 */
export function getMaxIncomingDamage(foe, player) {
  if (!foe || !player) return 0;
  return Math.max(1, foe.atk - player.def + 2);
}

/**
 * A short warning when the player is deep in kill range.
 * @param {{ hp: number, mhp: number, def: number }} player
 * @param {{ atk: number } | null} foe
 * @returns {string}
 */
export function getCombatWarning(player, foe) {
  if (!player || !foe) return "";
  const maxHit = getMaxIncomingDamage(foe, player);
  if (player.hp <= maxHit) return "One bad hit or failed bolt ends this run.";
  if (player.hp <= Math.max(Math.ceil(player.mhp * 0.25), maxHit * 2)) return "You're in the red. The next bad roll could get ugly.";
  return "";
}

/**
 * Whether a retreat should count as a completed dungeon clear.
 * @param {number} floor
 * @param {{ floors: number } | null} dungeon
 * @returns {boolean}
 */
export function didReturnFromClearedDungeon(floor, dungeon) {
  return Boolean(dungeon && floor >= dungeon.floors);
}
