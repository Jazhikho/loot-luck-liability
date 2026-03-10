/** Default player state. */
export const DEF_P = {
  hp: 50,
  mhp: 50,
  atk: 5,
  def: 2,
  gold: 10,
  wlv: 1,
  alv: 1,
  pot: 2,
};

/** Default run stats (reset each run). */
export const DEF_RS = {
  earned: 0,
  slain: 0,
  deepest: 0,
  rooms: 0,
  clears: 0,
};

/** Default lifetime stats (persisted). */
export const DEF_LT = {
  gold: 0,
  slain: 0,
  deaths: 0,
  clears: 0,
  rooms: 0,
  items: 0,
  potions: 0,
  runs: 0,
  bestFloor: 0,
};

/** Rarity text colors for items. */
export const RC = {
  common: "text-gray-300",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  legendary: "text-yellow-300",
};

/** Log message type colors. */
export const LC = {
  info: "text-blue-300",
  ok: "text-green-300",
  bad: "text-red-300",
  warn: "text-yellow-300",
  gold: "text-yellow-400",
  hit: "text-orange-300",
  normal: "text-gray-300",
  dim: "text-gray-500",
};
