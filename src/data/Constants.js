export const GAME_TITLE = "Loot, Luck & Liability";
export const GAME_TAGLINE = "Delve the green dark. Haul back cursed gold. Blame your luck.";
export const GAME_BLURB =
  "A clover-chasing broker keeps sending you into moonlit vaults, fae warrens, and rowdy cellar crypts. Bring home treasure if fortune smiles. If fortune grins, things get weird.";

export const LOOT = {
  common: [
    { id: "rain_soaked_clover_pin", n: "Rain-Soaked Clover Pin", v: 5, e: "\u2618", luck: 1 },
    { id: "pub_token_of_dubious_blessing", n: "Pub Token of Dubious Blessing", v: 4, e: "\u{1FA99}" },
    { id: "bog_bread_wrapped_in_a_bar_tab", n: "Bog Bread Wrapped in a Bar Tab", v: 3, e: "\u{1F35E}" },
    { id: "bent_horseshoe_that_might_be_lucky", n: "Bent Horseshoe That Might Be Lucky", v: 6, e: "\u{1F9F2}" },
    { id: "tin_whistle_full_of_marsh_water", n: "Tin Whistle Full of Marsh Water", v: 5, e: "\u{1F3B6}" },
    { id: "green_ribbon_from_a_fae_wake", n: "Green Ribbon from a Fae Wake", v: 7, e: "\u{1F397}\uFE0F" },
    { id: "pocket_saint_of_coincidental_fortune", n: "Pocket Saint of Coincidental Fortune", v: 8, e: "\u{1F56F}\uFE0F", luck: 1 },
    { id: "cellar_key_nobody_claims", n: "Cellar Key Nobody Claims", v: 4, e: "\u{1F5DD}\uFE0F" },
    { id: "half_map_to_a_rainbow_shortcut", n: "Half Map to a Rainbow Shortcut", v: 6, e: "\u{1F5FA}\uFE0F" },
  ],
  uncommon: [
    { id: "shamrock_flask_of_good_intentions", n: "Shamrock Flask of Good Intentions", v: 20, e: "\u{1F340}", luck: 1 },
    { id: "fae_dice_that_roll_sideways", n: "Fae Dice That Roll Sideways", v: 22, e: "\u{1F3B2}", luck: 1 },
    { id: "moonlit_bodhran_with_a_cracked_skin", n: "Moonlit Bodhran with a Cracked Skin", v: 24, e: "\u{1F941}" },
    { id: "bog_oak_club_from_a_pub_brawl_saint", n: "Bog Oak Club from a Pub Brawl Saint", v: 25, e: "\u{1FAB5}" },
    { id: "cloak_of_the_last_call_prophet", n: "Cloak of the Last Call Prophet", v: 28, e: "\u{1F9E5}" },
    { id: "bottle_of_rainbow_sediment", n: "Bottle of Rainbow Sediment", v: 30, e: "\u{1F9EA}" },
    { id: "ledger_of_near_missed_miracles", n: "Ledger of Near-Missed Miracles", v: 26, e: "\u{1F4D2}" },
    { id: "silver_spoon_of_the_seventh_pour", n: "Silver Spoon of the Seventh Pour", v: 23, e: "\u{1F944}" },
  ],
  rare: [
    { id: "leprechaun_bail_bond", n: "Leprechaun Bail Bond", v: 58, e: "\u{1F4DC}", luck: 2 },
    { id: "emerald_poker_from_the_kindly_folk", n: "Emerald Poker from the Kindly Folk", v: 62, e: "\u{1F49A}" },
    { id: "crown_cork_of_the_golden_keg", n: "Crown Cork of the Golden Keg", v: 55, e: "\u{1F451}" },
    { id: "fae_toll_bell_on_a_silk_chain", n: "Fae Toll Bell on a Silk Chain", v: 65, e: "\u{1F514}", luck: 2 },
    { id: "bogfire_lantern_of_fortunate_missteps", n: "Bogfire Lantern of Fortunate Missteps", v: 60, e: "\u{1F3EE}" },
    { id: "coin_harp_string_wound_in_moon_gold", n: "Coin Harp String Wound in Moon Gold", v: 70, e: "\u{1FA99}", luck: 2 },
  ],
  legendary: [
    { id: "receipt_from_the_end_of_the_rainbow", n: "Receipt from the End of the Rainbow", v: 185, e: "\u{1F308}", luck: 3 },
    { id: "the_brokers_blessed_corkscrew", n: "The Broker's Blessed Corkscrew", v: 170, e: "\u{1F300}", luck: 3 },
    { id: "clover_cursed_treasury_seal", n: "Clover-Cursed Treasury Seal", v: 190, e: "\u{1F512}", luck: 3 },
    { id: "keg_crown_of_the_lucky_wake", n: "Keg Crown of the Lucky Wake", v: 180, e: "\u{1F37A}" },
    { id: "harp_string_cut_from_a_fae_moonbeam", n: "Harp String Cut from a Fae Moonbeam", v: 200, e: "\u2728", luck: 3 },
    { id: "final_coin_from_saint_brigids_poker_table", n: "Final Coin from Saint Brigid's Poker Table", v: 175, e: "\u{1FA99}", luck: 3 },
  ],
};

export const DUNGEONS = [
  { id: 1, key: "clover_cellar", name: "The Clover Cellar", tier: 1, floors: 3, cost: 0, e: "\u{1F340}", desc: "Barrels, ghosts, and damp luck." },
  { id: 2, key: "gilded_bog_warrens", name: "The Gilded Bog Warrens", tier: 1, floors: 4, cost: 0, e: "\u{1FA99}", desc: "Coins sink here. So do fools." },
  { id: 3, key: "crossroads_of_the_kindly_folk", name: "Crossroads of the Kindly Folk", tier: 2, floors: 5, cost: 75, e: "\u{1F56F}\uFE0F", desc: "Never accept the third bargain." },
  { id: 4, key: "coinfall_catacombs", name: "The Coinfall Catacombs", tier: 2, floors: 6, cost: 200, e: "\u{1F480}", desc: "Gold drips from the ceiling like rain." },
  { id: 5, key: "greenfire_treasury", name: "The Greenfire Treasury", tier: 3, floors: 7, cost: 500, e: "\u{1F525}", desc: "Everything glows. Nothing is free." },
  { id: 6, key: "rainbows_last_stair", name: "Rainbow's Last Stair", tier: 3, floors: 8, cost: 1000, e: "\u{1F308}", desc: "Fortune waits at the top and laughs on the way down." },
];

export const MONSTERS = [
  { id: "pub_goblin", name: "Pub Goblin", hp: 12, atk: 3, def: 1, t: 1, e: "\u{1F47A}" },
  { id: "cellar_rat_of_ill_omen", name: "Cellar Rat of Ill Omen", hp: 8, atk: 2, def: 0, t: 1, e: "\u{1F400}" },
  { id: "coin_wraith", name: "Coin Wraith", hp: 15, atk: 4, def: 2, t: 1, e: "\u{1F47B}" },
  { id: "bog_lurker", name: "Bog Lurker", hp: 10, atk: 3, def: 1, t: 1, e: "\u{1F344}" },
  { id: "fae_debt_collector", name: "Fae Debt Collector", hp: 25, atk: 7, def: 3, t: 2, e: "\u{1F9FE}" },
  { id: "wakehouse_spirit", name: "Wakehouse Spirit", hp: 20, atk: 8, def: 2, t: 2, e: "\u{1F54A}\uFE0F" },
  { id: "overdressed_lepre_bruiser", name: "Overdressed Lepre-Bruiser", hp: 22, atk: 6, def: 4, t: 2, e: "\u{1F3A9}" },
  { id: "barrel_kicking_revenant", name: "Barrel-Kicking Revenant", hp: 18, atk: 9, def: 2, t: 2, e: "\u{1FAB5}" },
  { id: "bog_king_on_a_bad_night", name: "Bog King on a Bad Night", hp: 40, atk: 12, def: 6, t: 3, e: "\u{1F451}" },
  { id: "treasury_drake", name: "Treasury Drake", hp: 50, atk: 14, def: 5, t: 3, e: "\u{1F409}" },
  { id: "the_last_toast", name: "The Last Toast", hp: 45, atk: 13, def: 7, t: 3, e: "\u{1F942}" },
  { id: "rainbow_mimic", name: "Rainbow Mimic", hp: 35, atk: 15, def: 4, t: 3, e: "\u{1F4E6}" },
];

export const ACHDEFS = [
  { id: "first_blood", name: "First Blood", desc: "Slay your first monster", e: "\u{1F5E1}\uFE0F" },
  { id: "hoarder", name: "Professional Hoarder", desc: "Carry 10+ items at once", e: "\u{1F4E6}" },
  { id: "deep_pockets", name: "Deep Pockets", desc: "Have 500+ gold at once", e: "\u{1F4B0}" },
  { id: "big_earner", name: "Big Earner", desc: "Earn 1,000g lifetime", e: "\u{1F3E6}" },
  { id: "tycoon", name: "Dungeon Tycoon", desc: "Earn 5,000g lifetime", e: "\u{1F451}" },
  { id: "hunter", name: "Monster Hunter", desc: "Slay 50 monsters lifetime", e: "\u{1F3F9}" },
  { id: "exterminator", name: "Exterminator", desc: "Slay 200 monsters lifetime", e: "\u2620\uFE0F" },
  { id: "legendary", name: "Legendary!", desc: "Find a legendary item", e: "\u2B50" },
  { id: "clear", name: "Dungeon Crawler", desc: "Reach the bottom of a dungeon", e: "\u{1F3C6}" },
  { id: "spelunker", name: "Spelunker", desc: "Complete 5 dungeon clears", e: "\u26CF\uFE0F" },
  { id: "deep", name: "Going Deep", desc: "Reach floor 5 in any dungeon", e: "\u2B07\uFE0F" },
  { id: "abyss", name: "Rock Bottom", desc: "Reach floor 8 in any dungeon", e: "\u{1F573}\uFE0F" },
  { id: "close_call", name: "Close Call", desc: "Return to shop with <=5 HP", e: "\u{1F630}" },
  { id: "thorough", name: "Thorough Explorer", desc: "Explore 8+ rooms on one floor", e: "\u{1F50D}" },
  { id: "persistent", name: "Cockroach", desc: "Die 5 times total", e: "\u{1FAB2}" },
  { id: "upgraded", name: "Arms Dealer", desc: "Reach weapon or armor level 5", e: "\u{1F528}" },
];

export const GREETINGS = [
  "Back from the green dark, are you? Mind the dripping luck on my floorboards.",
  "If you found a rainbow receipt, I buy those by the inch.",
  "The kindly folk still owe me three favors and half a keg. Welcome in.",
  "Show me your haul before your luck turns and starts charging rent.",
  "You've got the look of someone who survived on accident. I respect that.",
];

export const SELL_QUOTES = [
  "Lovely. I can pass this off as saint-touched without technically lying.",
  "This will move fast once I say it hummed at the sight of moonlight.",
  "Good haul. The pub regulars buy anything if I call it a lucky omen.",
  "Marvelous. Somewhere, a fae accountant just got a headache.",
];

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
