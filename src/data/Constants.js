/** Loot tables by rarity. */
export const LOOT = {
  common: [
    { n: "Soggy Bread of Minor Sustenance", v: 3, e: "🍞" },
    { n: "Dull Knife of Butter Spreading", v: 5, e: "🔪" },
    { n: "Rock of Moderate Hardness", v: 2, e: "🪨" },
    { n: "Candle That Silently Judges You", v: 7, e: "🕯️" },
    { n: "Sock of Questionable Origin", v: 4, e: "🧦" },
    { n: "Belt of Trouser Retention", v: 6, e: "👔" },
    { n: "Spoon of Aggressive Stirring", v: 8, e: "🥄" },
    { n: "Map to a Slightly Better Map", v: 6, e: "🗺️" },
    { n: "Goblin's Expired Gym Membership", v: 5, e: "💳" },
  ],
  uncommon: [
    { n: "Sword of Mild Inconvenience", v: 18, e: "⚔️" },
    { n: "Shield of Partial Effort", v: 20, e: "🛡️" },
    { n: "Boots of Slightly Faster Walking", v: 22, e: "👢" },
    { n: "Ring of Finger Decoration", v: 28, e: "💍" },
    { n: "Hat of Looking Important", v: 25, e: "🎩" },
    { n: "Cloak of Moderate Mystery", v: 30, e: "🧥" },
    { n: "Wand of Passive Aggression", v: 24, e: "🪄" },
    { n: "Diary of a Regretful Skeleton", v: 20, e: "📖" },
  ],
  rare: [
    { n: "Flaming Sword of BBQ Mastery", v: 50, e: "🗡️" },
    { n: "Crown of Unearned Authority", v: 60, e: "👑" },
    { n: "Amulet of Tax Evasion", v: 65, e: "📿" },
    { n: "Gauntlets of Aggressive Handshaking", v: 55, e: "🧤" },
    { n: "Orb of Vague Prophecy", v: 70, e: "🔮" },
    { n: "Cape of Dramatic Entrances", v: 58, e: "🦸" },
  ],
  legendary: [
    { n: "The Merchant's Ex-Wife's Ring", v: 150, e: "💎" },
    { n: "Excalibudget™ (Discount Excalibur)", v: 180, e: "⚔️" },
    { n: "Armor of Blatant Plot Convenience", v: 160, e: "🛡️" },
    { n: "Staff of Unreasonable Power (No Batteries)", v: 170, e: "🪄" },
    { n: "The One Onion Ring To Rule Them All", v: 200, e: "🧅" },
    { n: "Dragon's Rejected Platinum Credit Card", v: 190, e: "💳" },
  ],
};

/** Dungeon definitions. */
export const DUNGEONS = [
  { id: 1, name: "The Slightly Damp Cave", tier: 1, floors: 3, cost: 0, e: "🕳️", desc: "Moist. Unpleasant. Entry level." },
  { id: 2, name: "Goblin's Discount Warehouse", tier: 1, floors: 4, cost: 0, e: "🏪", desc: "Everything must go! (Including you, possibly.)" },
  { id: 3, name: "The Crypt of Mild Inconvenience", tier: 2, floors: 5, cost: 75, e: "⚰️", desc: "Not deadly, just really annoying." },
  { id: 4, name: "Wizard's Abandoned Timeshare", tier: 2, floors: 6, cost: 200, e: "🏚️", desc: "He left in a hurry. Wonder why." },
  { id: 5, name: "Dragon's Storage Unit", tier: 3, floors: 7, cost: 500, e: "🐉", desc: "Past due on rent. Dragon is NOT happy." },
  { id: 6, name: "The Abyss of Forgotten Tax Returns", tier: 3, floors: 8, cost: 1000, e: "📋", desc: "The IRS fears this place." },
];

/** Monster definitions; t = tier. */
export const MONSTERS = [
  { name: "Confused Goblin", hp: 12, atk: 3, def: 1, t: 1, e: "👺" },
  { name: "Sleepy Giant Rat", hp: 8, atk: 2, def: 0, t: 1, e: "🐀" },
  { name: "Lost Skeleton", hp: 15, atk: 4, def: 2, t: 1, e: "💀" },
  { name: "Mushroom with Attitude", hp: 10, atk: 3, def: 1, t: 1, e: "🍄" },
  { name: "Grumpy Orc", hp: 25, atk: 7, def: 3, t: 2, e: "👹" },
  { name: "Passive-Aggressive Ghost", hp: 20, atk: 8, def: 2, t: 2, e: "👻" },
  { name: "Overconfident Bandit", hp: 22, atk: 6, def: 4, t: 2, e: "🦹" },
  { name: "Sentient Tax Form", hp: 18, atk: 9, def: 2, t: 2, e: "📄" },
  { name: "Hangry Troll", hp: 40, atk: 12, def: 6, t: 3, e: "🧌" },
  { name: "Corporate Dragon (Middle Mgmt)", hp: 50, atk: 14, def: 5, t: 3, e: "🐲" },
  { name: "The Final Karen", hp: 45, atk: 13, def: 7, t: 3, e: "💇" },
  { name: "Definitely Not A Mimic", hp: 35, atk: 15, def: 4, t: 3, e: "📦" },
];

/** Achievement definitions. */
export const ACHDEFS = [
  { id: "first_blood", name: "First Blood", desc: "Slay your first monster", e: "🗡️" },
  { id: "hoarder", name: "Professional Hoarder", desc: "Carry 10+ items at once", e: "🐀" },
  { id: "deep_pockets", name: "Deep Pockets", desc: "Have 500+ gold at once", e: "💰" },
  { id: "big_earner", name: "Big Earner", desc: "Earn 1,000g lifetime", e: "🪙" },
  { id: "tycoon", name: "Dungeon Tycoon", desc: "Earn 5,000g lifetime", e: "🏦" },
  { id: "hunter", name: "Monster Hunter", desc: "Slay 50 monsters lifetime", e: "🏹" },
  { id: "exterminator", name: "Exterminator", desc: "Slay 200 monsters lifetime", e: "☠️" },
  { id: "legendary", name: "Legendary!", desc: "Find a legendary item", e: "⭐" },
  { id: "clear", name: "Dungeon Crawler", desc: "Reach the bottom of a dungeon", e: "🏆" },
  { id: "spelunker", name: "Spelunker", desc: "Complete 5 dungeon clears", e: "⛏️" },
  { id: "deep", name: "Going Deep", desc: "Reach floor 5 in any dungeon", e: "⬇️" },
  { id: "abyss", name: "Rock Bottom", desc: "Reach floor 8 in any dungeon", e: "🕳️" },
  { id: "close_call", name: "Close Call", desc: "Return to shop with ≤5 HP", e: "😰" },
  { id: "thorough", name: "Thorough Explorer", desc: "Explore 8+ rooms on one floor", e: "🔍" },
  { id: "persistent", name: "Cockroach", desc: "Die 5 times total", e: "🪳" },
  { id: "upgraded", name: "Arms Dealer", desc: "Reach weapon or armor level 5", e: "🔨" },
];

/** Merchant greeting lines. */
export const GREETINGS = [
  "Ah, you're back! And still alive! ...Unexpected.",
  "Welcome! Please have something worth more than your medical bills.",
  "You smell like dungeon. That's actually an improvement.",
  "My favorite employee! Well, my only surviving one.",
  "Quick, show me what you've got before the tax collector arrives!",
];

/** Merchant sell confirmation lines. */
export const SELL_QUOTES = [
  "Deal! My customers buy anything if I call it 'artisanal.'",
  "I know a guy who knows a guy who'd want this.",
  "This'll look great in my 'Genuine Dungeon Relics' display!",
  "I once sold something worse for triple the price.",
];

/** Explore room flavor text. */
export const EXPLORE_FLAVOR = [
  "You push through a creaky door...",
  "You follow a narrow corridor...",
  "You investigate a suspicious alcove...",
  "You squeeze past some rubble...",
  "You step over what you hope is mud...",
  "You follow the sound of dripping water...",
  "You kick open a stuck door. Cool, but your toe hurts now.",
  "You edge past some cobwebs the size of bedsheets...",
  "You follow scratch marks on the wall deeper in...",
  "You notice a faint glow ahead and investigate...",
];

/** Empty room descriptions. */
export const EMPTY_ROOMS = [
  "An empty room with suspicious stains on the walls.",
  "Cobwebs and a skeleton holding a 'HELP WANTED' sign.",
  "Someone carved 'THE MERCHANT IS CHEAP' into the wall.",
  "Broken pottery everywhere. Some adventurer beat you to it.",
  "Graffiti reads: 'Adventuring sux, become a baker.'",
  "A table with a half-finished game of chess. Neither side was winning.",
  "A room full of empty chests. Someone was here first. Rude.",
  "A mossy fountain. The water tastes like regret.",
];
