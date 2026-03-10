import { makeId, pick } from "./Helpers.js";
import { LOOT, MONSTERS } from "../data/Constants.js";

const LUCK_UPGRADE_COSTS = [20, 35, 55, 80, 110, 145];

/**
 * Roll a loot item based on floor, tier, and rooms explored.
 * @param {number} floor
 * @param {number} tier
 * @param {number} rooms
 * @returns {{ name: string, value: number, emoji: string, rarity: string, id: number }}
 */
export function rollLoot(floor, tier, rooms) {
  const r = Math.random() * 100;
  const s = (floor + tier - 1) * 3 + rooms * 0.5;
  let rarity;
  if (r < 3 + s * 0.8) rarity = "legendary";
  else if (r < 14 + s * 1.2) rarity = "rare";
  else if (r < 40 + s) rarity = "uncommon";
  else rarity = "common";
  const item = pick(LOOT[rarity]);
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
 * Whether the player can spend a potion for a non-zero heal.
 * @param {{ hp: number, mhp: number, pot: number }} player
 * @returns {boolean}
 */
export function canUsePotion(player) {
  return Boolean(player && player.pot > 0 && player.hp < player.mhp);
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
