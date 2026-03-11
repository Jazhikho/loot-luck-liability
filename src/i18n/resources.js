import {
  ACHDEFS,
  EMPTY_ROOMS,
  EXPLORE_FLAVOR,
  GAME_BLURB,
  GAME_TAGLINE,
  GAME_TITLE,
  GREETINGS,
  LOOT,
  MONSTERS,
  SELL_QUOTES,
  DUNGEONS,
} from "../data/Constants.js";

export const SUPPORTED_LOCALES = ["en", "es", "ru", "ja", "ko", "zh-Hans"];
export const DEFAULT_LOCALE = "en";

function buildEnglishContent() {
  const lootEntries = Object.fromEntries(
    Object.values(LOOT)
      .flat()
      .map((item) => [item.id, { name: item.n }])
  );
  const dungeonEntries = Object.fromEntries(DUNGEONS.map((dungeon) => [dungeon.key, { name: dungeon.name, desc: dungeon.desc }]));
  const monsterEntries = Object.fromEntries(MONSTERS.map((monster) => [monster.id, { name: monster.name }]));
  const achievementEntries = Object.fromEntries(
    ACHDEFS.map((achievement) => [achievement.id, { name: achievement.name, desc: achievement.desc }])
  );

  return {
    title: GAME_TITLE,
    tagline: GAME_TAGLINE,
    blurb: GAME_BLURB,
    loot: lootEntries,
    dungeons: dungeonEntries,
    monsters: monsterEntries,
    achievements: achievementEntries,
    greetings: GREETINGS,
    sellQuotes: SELL_QUOTES,
    exploreFlavor: EXPLORE_FLAVOR,
    emptyRooms: EMPTY_ROOMS,
  };
}

export const resources = {
  en: {
    ui: {
      common: {
        back: "Back",
        credits: "Credits",
        deleteAllData: "Delete All Data",
        deleteEverything: "Delete Everything",
        cancel: "Cancel",
        locked: "Locked",
        latest: "Latest",
        ledger: "Ledger",
        openLedger: "Open the Ledger",
      },
      stats: {
        hp: "HP",
        atk: "ATK",
        def: "DEF",
        gold: "Gold",
        tonics: "Tonics",
        luck: "Luck",
        cargo: "Cargo",
      },
      title: {
        creditsLabel: "Credits",
        continueRun: "Continue the Haul",
        startFresh: "Start a Fresh Misadventure",
        startAdventure: "Start Adventuring",
        backToTitle: "Back to Title",
        abandonRunTitle: "Abandon the current run?",
        abandonRunBody: "Starting a new run will replace the current in-progress expedition once the next autosave happens.",
        abandonRunConfirm: "Start Fresh Run",
        creditsDev: "Dev",
        creditsPrototype: "Prototype",
        creditsPrototypeBody: "Originally prototyped with Claude Sonnet.",
        creditsDevelopment: "Development",
        creditsDevelopmentBody: "Developed using Codex (GPT 5.4).",
        creditsPlaytesting: "Playtesting",
        creditsPlaytestingBody: "Joel Croteau, for playtesting and feedback.",
        creditsVersion: "Version",
        creditsFooter: "A folk-chaos loot run about cursed gold, suspicious luck, and monsters who know the engine is watching.",
      },
      shop: {
        heading: "The Broker's Snug",
        hurtTitle: "You are still hurt.",
        hurtBody:
          "HP {hp}/{maxHp}. If you leave town like this, the Green Dark gets first swing. Hearth Rest restores you to full before the next dive.",
        luckSummary: "Base Luck {baseLuck}. Active Luck {activeLuck}. Lucky cargo in hand: {luckyCargo}.",
        cashIn: "Cash In ({gold}g)",
        tonic: "Tonic (15g)",
        weaponLevel: "Weapon Lv{level}",
        weaponBenefit: "+{atk} ATK • {gold}g",
        armorLevel: "Armor Lv{level}",
        armorBenefit: "+{def} DEF / +{hp} HP • {gold}g",
        luckUpgrade: "Luck +1 ({gold}g)",
        hearthRest: "Hearth Rest to Full (10g)",
        chaseDark: "Chase the Green Dark",
        cargoHold: "Cargo Hold ({count})",
        cargoHelp:
          "Locked cargo stay off the sales bar. Only shamrock-marked cargo affect luck; the rest are pure resale.",
        cargoHeldSuffix: "{count} item{suffix} currently held back.",
        hold: "Hold",
        held: "Held",
        totalCargoValue: "Total cargo value: {gold}g",
        luckBadge: "Luck +{luck}",
      },
      pickDungeon: {
        heading: "Choose a Fortune Hunt",
        freshRumor: "Fresh rumor",
        floors: "{count} floors",
        unlock: "Unlock {gold}g",
        back: "Back",
        omens: "Omens:",
      },
      combat: {
        battleChatter: "Battle Chatter",
        battleSubtitle: "The latest hit, heckle, or badly timed miracle belongs in the middle of the screen.",
        enemyHp: "Enemy HP",
        yourHp: "Your HP",
        swing: "Swing",
        tonic: "Tonic ({count})",
        bolt: "Bolt",
        stats: "ATK {atk} / DEF {def}",
      },
      floorHub: {
        roomsSearched: "Rooms searched: {count}",
        activeLuck: "Active Luck: {luck} ({tier})",
        commentaryTitle: "Dungeon Commentary",
        commentarySubtitle:
          "The room descriptions and bad omens should be loud enough to read without squinting at the footer.",
        exploreRoom: "Explore a Room",
        descend: "Descend to Floor {floor}",
        retreat: "Retreat to Town",
        drinkTonic: "Drink Tonic ({count})",
        cargoSummary: "Cargo {count} items worth {gold}g",
      },
      dead: {
        title: "Luck Finally Blinked",
        blurb:
          "The broker orders another round, mutters a brief blessing for your remains, and updates the hiring board.",
        summary: "Run Summary",
        goldHauled: "Gold Hauled:",
        monstersSlain: "Monsters Slain:",
        deepestFloor: "Deepest Floor:",
        roomsExplored: "Rooms Explored:",
        lostCargo: "Lost Cargo: {count} items ({gold}g)",
        retry: "Chase the Next Lucky Mistake",
      },
      profile: {
        ledgerSubtitle: "Broker's Ledger",
        stats: "Stats",
        achievements: "Achievements",
        highscores: "Highscores",
        lifetimeTally: "Lifetime Tally",
        achievementsTitle: "Achievements ({count}/{total})",
        done: "Done",
        hallOfHauls: "Hall of Hauls (Top 5 Runs)",
        noEntries: "No entries yet. Fortune prefers a little history.",
        slainLabel: "{count} slain",
        floorLabel: "Floor {floor}",
        roomsLabel: "{count} rooms",
        deleteTitle: "Delete all saved data?",
        deleteBody:
          "This removes the current run, lifetime stats, achievements, and the hall of fame. This cannot be undone.",
        statLabels: {
          gold: "Gold Earned",
          slain: "Monsters Slain",
          deaths: "Deaths",
          clears: "Dungeons Cleared",
          rooms: "Rooms Explored",
          items: "Items Found",
          potions: "Potions Used",
          runs: "Runs Started",
          bestFloor: "Deepest Floor",
          bestLuck: "Best Luck",
        },
      },
      panels: {
        storyDefaultTitle: "Current Beat",
        storyDefaultSubtitle: "The loudest rumor in the room gets top billing.",
        storyEmpty: "The room is quiet, which is never a trustworthy sign.",
        logTitle: "Rumors & Wreckage",
        logSubtitle: "The running commentary on your current bad decisions.",
        logEmpty: "The ledger waits for your next mistake...",
        dangerLabel: "Omens:",
      },
      warnings: {
        leaveTownTitle: "Leave town while hurt?",
        leaveTownBody:
          "You're heading out at {hp}/{maxHp} HP. Hearth Rest in the snug will refill you before the next run. Leave town hurt anyway?",
        leaveTownConfirm: "Leave Hurt Anyway",
      },
    },
    content: buildEnglishContent(),
  },
  es: {},
  ru: {},
  ja: {},
  ko: {},
  "zh-Hans": {},
};
