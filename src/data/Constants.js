/** Title screen theme copy. */
export const GAME_TAGLINE = "Delve the green dark. Haul back cursed gold. Blame your luck.";
export const GAME_BLURB =
  "A clover-chasing broker keeps sending you into moonlit vaults, fae warrens, and rowdy cellar crypts. Bring home treasure if fortune smiles. If fortune grins, things get weird.";

/** Loot tables by rarity. Lucky cargo adds presentation-only luck while carried. */
export const LOOT = {
  common: [
    { n: "Rain-Soaked Clover Pin", v: 5, e: "☘", luck: 1 },
    { n: "Pub Token of Dubious Blessing", v: 4, e: "🪙" },
    { n: "Bog Bread Wrapped in a Bar Tab", v: 3, e: "🍞" },
    { n: "Bent Horseshoe That Might Be Lucky", v: 6, e: "🧲" },
    { n: "Tin Whistle Full of Marsh Water", v: 5, e: "🎶" },
    { n: "Green Ribbon from a Fae Wake", v: 7, e: "🎗️" },
    { n: "Pocket Saint of Coincidental Fortune", v: 8, e: "🕯️", luck: 1 },
    { n: "Cellar Key Nobody Claims", v: 4, e: "🗝️" },
    { n: "Half Map to a Rainbow Shortcut", v: 6, e: "🗺️" },
  ],
  uncommon: [
    { n: "Shamrock Flask of Good Intentions", v: 20, e: "🍀", luck: 1 },
    { n: "Fae Dice That Roll Sideways", v: 22, e: "🎲", luck: 1 },
    { n: "Moonlit Bodhran with a Cracked Skin", v: 24, e: "🥁" },
    { n: "Bog Oak Club from a Pub Brawl Saint", v: 25, e: "🪵" },
    { n: "Cloak of the Last Call Prophet", v: 28, e: "🧥" },
    { n: "Bottle of Rainbow Sediment", v: 30, e: "🧪" },
    { n: "Ledger of Near-Missed Miracles", v: 26, e: "📒" },
    { n: "Silver Spoon of the Seventh Pour", v: 23, e: "🥄" },
  ],
  rare: [
    { n: "Leprechaun Bail Bond", v: 58, e: "📜", luck: 2 },
    { n: "Emerald Poker from the Kindly Folk", v: 62, e: "💚" },
    { n: "Crown Cork of the Golden Keg", v: 55, e: "👑" },
    { n: "Fae Toll Bell on a Silk Chain", v: 65, e: "🔔", luck: 2 },
    { n: "Bogfire Lantern of Fortunate Missteps", v: 60, e: "🏮" },
    { n: "Coin Harp String Wound in Moon Gold", v: 70, e: "🪙", luck: 2 },
  ],
  legendary: [
    { n: "Receipt from the End of the Rainbow", v: 185, e: "🌈", luck: 3 },
    { n: "The Broker's Blessed Corkscrew", v: 170, e: "🌀", luck: 3 },
    { n: "Clover-Cursed Treasury Seal", v: 190, e: "🔒", luck: 3 },
    { n: "Keg Crown of the Lucky Wake", v: 180, e: "🍺" },
    { n: "Harp String Cut from a Fae Moonbeam", v: 200, e: "✨", luck: 3 },
    { n: "Final Coin from Saint Brigid's Poker Table", v: 175, e: "🪙", luck: 3 },
  ],
};

/** Dungeon definitions. */
export const DUNGEONS = [
  { id: 1, name: "The Clover Cellar", tier: 1, floors: 3, cost: 0, e: "🍀", desc: "Barrels, ghosts, and damp luck." },
  { id: 2, name: "The Gilded Bog Warrens", tier: 1, floors: 4, cost: 0, e: "🪙", desc: "Coins sink here. So do fools." },
  { id: 3, name: "Crossroads of the Kindly Folk", tier: 2, floors: 5, cost: 75, e: "🕯️", desc: "Never accept the third bargain." },
  { id: 4, name: "The Coinfall Catacombs", tier: 2, floors: 6, cost: 200, e: "💀", desc: "Gold drips from the ceiling like rain." },
  { id: 5, name: "The Greenfire Treasury", tier: 3, floors: 7, cost: 500, e: "🔥", desc: "Everything glows. Nothing is free." },
  { id: 6, name: "Rainbow's Last Stair", tier: 3, floors: 8, cost: 1000, e: "🌈", desc: "Fortune waits at the top and laughs on the way down." },
];

/** Monster definitions; t = tier. */
export const MONSTERS = [
  { name: "Pub Goblin", hp: 12, atk: 3, def: 1, t: 1, e: "👺" },
  { name: "Cellar Rat of Ill Omen", hp: 8, atk: 2, def: 0, t: 1, e: "🐀" },
  { name: "Coin Wraith", hp: 15, atk: 4, def: 2, t: 1, e: "👻" },
  { name: "Bog Lurker", hp: 10, atk: 3, def: 1, t: 1, e: "🍄" },
  { name: "Fae Debt Collector", hp: 25, atk: 7, def: 3, t: 2, e: "🧾" },
  { name: "Wakehouse Spirit", hp: 20, atk: 8, def: 2, t: 2, e: "🕊️" },
  { name: "Overdressed Lepre-Bruiser", hp: 22, atk: 6, def: 4, t: 2, e: "🎩" },
  { name: "Barrel-Kicking Revenant", hp: 18, atk: 9, def: 2, t: 2, e: "🪵" },
  { name: "Bog King on a Bad Night", hp: 40, atk: 12, def: 6, t: 3, e: "👑" },
  { name: "Treasury Drake", hp: 50, atk: 14, def: 5, t: 3, e: "🐉" },
  { name: "The Last Toast", hp: 45, atk: 13, def: 7, t: 3, e: "🥂" },
  { name: "Rainbow Mimic", hp: 35, atk: 15, def: 4, t: 3, e: "📦" },
];

/** Achievement definitions. */
export const ACHDEFS = [
  { id: "first_blood", name: "First Blood", desc: "Slay your first monster", e: "🗡️" },
  { id: "hoarder", name: "Professional Hoarder", desc: "Carry 10+ items at once", e: "📦" },
  { id: "deep_pockets", name: "Deep Pockets", desc: "Have 500+ gold at once", e: "💰" },
  { id: "big_earner", name: "Big Earner", desc: "Earn 1,000g lifetime", e: "🏦" },
  { id: "tycoon", name: "Dungeon Tycoon", desc: "Earn 5,000g lifetime", e: "👑" },
  { id: "hunter", name: "Monster Hunter", desc: "Slay 50 monsters lifetime", e: "🏹" },
  { id: "exterminator", name: "Exterminator", desc: "Slay 200 monsters lifetime", e: "☠️" },
  { id: "legendary", name: "Legendary!", desc: "Find a legendary item", e: "⭐" },
  { id: "clear", name: "Dungeon Crawler", desc: "Reach the bottom of a dungeon", e: "🏆" },
  { id: "spelunker", name: "Spelunker", desc: "Complete 5 dungeon clears", e: "⛏️" },
  { id: "deep", name: "Going Deep", desc: "Reach floor 5 in any dungeon", e: "⬇️" },
  { id: "abyss", name: "Rock Bottom", desc: "Reach floor 8 in any dungeon", e: "🕳️" },
  { id: "close_call", name: "Close Call", desc: "Return to shop with <=5 HP", e: "😰" },
  { id: "thorough", name: "Thorough Explorer", desc: "Explore 8+ rooms on one floor", e: "🔍" },
  { id: "persistent", name: "Cockroach", desc: "Die 5 times total", e: "🪲" },
  { id: "upgraded", name: "Arms Dealer", desc: "Reach weapon or armor level 5", e: "🔨" },
];

/** Merchant greeting lines. */
export const GREETINGS = [
  "Back from the green dark, are you? Mind the dripping luck on my floorboards.",
  "If you found a rainbow receipt, I buy those by the inch.",
  "The kindly folk still owe me three favors and half a keg. Welcome in.",
  "Show me your haul before your luck turns and starts charging rent.",
  "You've got the look of someone who survived on accident. I respect that.",
];

/** Merchant sell confirmation lines. */
export const SELL_QUOTES = [
  "Lovely. I can pass this off as saint-touched without technically lying.",
  "This will move fast once I say it hummed at the sight of moonlight.",
  "Good haul. The pub regulars buy anything if I call it a lucky omen.",
  "Marvelous. Somewhere, a fae accountant just got a headache.",
];

/** Explore room flavor text. */
export const EXPLORE_FLAVOR = [
  "You shoulder through a cellar door slick with green fire soot...",
  "You follow harp music echoing from somewhere it should not be...",
  "You squeeze past stacked barrels and a suspicious amount of clover moss...",
  "You trace a line of gold dust into the next chamber...",
  "You step over a chalk ring and immediately regret noticing it...",
  "You pass under a rainbow stain that refuses to stay on the ceiling...",
  "You nudge aside a root-covered gate humming a pub tune...",
  "You round a bend where the air smells of coin, rain, and bad bargains...",
];

/** Empty room descriptions. */
export const EMPTY_ROOMS = [
  "Only damp clover prints remain, as though luck walked off without you.",
  "A quiet pub nook with overturned stools and one still-warm candle.",
  "Stacks of empty coin trays. Someone lucky got here first.",
  "A moonlit chamber with no treasure, only a polite sense of being watched.",
  "Broken bottles, snapped cards, and a note reading: 'Bad hand. Back soon.'",
  "A circle of mushrooms around a dry fountain that smells faintly of stout.",
  "A silent vault where every chest is open and every lock smiles at you.",
  "Just roots, mist, and the feeling that fortune is winding up a joke.",
];
