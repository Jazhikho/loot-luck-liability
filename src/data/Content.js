import { ACHDEFS, DUNGEONS, EMPTY_ROOMS, EXPLORE_FLAVOR, GREETINGS, LOOT, MONSTERS, SELL_QUOTES } from "./Constants.js";
import { getLocaleValue, t } from "../i18n/index.jsx";

export function getAchievementDefs() {
  return ACHDEFS.map((achievement) => ({
    ...achievement,
    name: t(`content.achievements.${achievement.id}.name`),
    desc: t(`content.achievements.${achievement.id}.desc`),
  }));
}

export function getGreetingLines() {
  return getLocaleValue("content.greetings") || GREETINGS;
}

export function getSellQuotes() {
  return getLocaleValue("content.sellQuotes") || SELL_QUOTES;
}

export function getExploreFlavor() {
  return getLocaleValue("content.exploreFlavor") || EXPLORE_FLAVOR;
}

export function getEmptyRooms() {
  return getLocaleValue("content.emptyRooms") || EMPTY_ROOMS;
}

export function getLootName(id, fallback = "") {
  return t(`content.loot.${id}.name`) || fallback;
}

export function getMonsterName(id, fallback = "") {
  return t(`content.monsters.${id}.name`) || fallback;
}

export function localizeDungeon(dungeon) {
  if (!dungeon?.key) return dungeon;
  return {
    ...dungeon,
    name: t(`content.dungeons.${dungeon.key}.name`),
    desc: t(`content.dungeons.${dungeon.key}.desc`),
  };
}

export function getLocalizedDungeons() {
  return DUNGEONS.map(localizeDungeon);
}

export function getLocalizedLootPools() {
  return Object.fromEntries(
    Object.entries(LOOT).map(([rarity, items]) => [
      rarity,
      items.map((item) => ({
        ...item,
        n: getLootName(item.id, item.n),
      })),
    ])
  );
}

export function getLocalizedMonsters() {
  return MONSTERS.map((monster) => ({
    ...monster,
    name: getMonsterName(monster.id, monster.name),
  }));
}
