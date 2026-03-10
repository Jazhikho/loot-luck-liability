import { useCallback, useEffect, useRef, useState } from "react";
import { ToastLayer } from "./components/ToastLayer.jsx";
import { LogBox } from "./components/LogBox.jsx";
import { StatsBar } from "./components/StatsBar.jsx";
import { ConfirmDialog } from "./components/ConfirmDialog.jsx";
import { TitleScreen } from "./screens/TitleScreen.jsx";
import { DeadScreen } from "./screens/DeadScreen.jsx";
import { ProfileScreen } from "./screens/ProfileScreen.jsx";
import { ShopView } from "./screens/ShopView.jsx";
import { PickDungeonView } from "./screens/PickDungeonView.jsx";
import { CombatView } from "./screens/CombatView.jsx";
import { FloorHubView } from "./screens/FloorHubView.jsx";
import {
  ACHDEFS,
  EMPTY_ROOMS,
  EXPLORE_FLAVOR,
  GREETINGS,
  SELL_QUOTES,
} from "./data/Constants.js";
import { DEF_LT, DEF_P, DEF_RS } from "./data/Defaults.js";
import {
  canUsePotion,
  didReturnFromClearedDungeon,
  getArmorUpgradeBenefit,
  getCurrentLuck,
  getDanger,
  getLockedItemCount,
  getLuckyItemCount,
  getLuckUpgradeCost,
  getSellableItems,
  getSellableTotal,
  getWeaponUpgradeBenefit,
  rollLoot,
  spawnMonster,
  upgCost,
} from "./utils/GameLogic.js";
import { getDungeonCatalog, getNewlyDiscoveredDungeons } from "./utils/DungeonCatalog.js";
import {
  decorateAttackOutcome,
  decorateDeathOutcome,
  decorateEmptyRoomOutcome,
  decorateEnemyAttackOutcome,
  decorateEnemyDefeatOutcome,
  decorateLootOutcome,
  decorateMonsterEncounter,
  decorateTrapOutcome,
  decorateTravelOutcome,
  getLuckTier,
} from "./utils/LuckPresentation.js";
import { makeId, pick, rand, LS } from "./utils/Helpers.js";
import { normalizeSave, SAVE_VERSION } from "./utils/SaveData.js";

function getAfterFightType(afterFight) {
  return typeof afterFight === "string" ? afterFight : afterFight?.type || null;
}

function getAfterFightCompletion(afterFight) {
  return typeof afterFight === "object" && afterFight !== null && afterFight.completedDungeon === true;
}

export default function Game() {
  const [view, setView] = useState("title");
  const [p, setP] = useState(DEF_P);
  const [inv, setInv] = useState([]);
  const [dng, setDng] = useState(null);
  const [fl, setFl] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [foe, setFoe] = useState(null);
  const [log, setLog] = useState([]);
  const [afterFight, setAfterFight] = useState(null);
  const [unlocked, setUnlocked] = useState([1, 2]);
  const [mQuote, setMQuote] = useState("");
  const [rs, setRs] = useState(DEF_RS);
  const [lt, setLt] = useState(DEF_LT);
  const [ach, setAch] = useState([]);
  const [hs, setHs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [profTab, setProfTab] = useState("stats");
  const [prevView, setPrevView] = useState("title");
  const [pendingDeath, setPendingDeath] = useState(null);
  const [departureWarningOpen, setDepartureWarningOpen] = useState(false);

  const logRef = useRef(null);
  const loaded = useRef(false);
  const ltRef = useRef(DEF_LT);
  const achRef = useRef([]);
  const rsRef = useRef(DEF_RS);
  const deathTimerRef = useRef(null);

  const currentLuck = getCurrentLuck(p, inv);
  const luckyItemCount = getLuckyItemCount(inv);
  const lockedItemCount = getLockedItemCount(inv);
  const sellableTotal = getSellableTotal(inv);
  const luckTier = getLuckTier(currentLuck);
  const dungeonCatalog = getDungeonCatalog(unlocked);
  const weaponBonus = getWeaponUpgradeBenefit();
  const armorBonus = getArmorUpgradeBenefit();
  const storyEntries = log.slice(-4);
  const latestStory = storyEntries.at(-1) || null;

  const clearPendingDeath = useCallback(() => {
    if (deathTimerRef.current) {
      clearTimeout(deathTimerRef.current);
      deathTimerRef.current = null;
    }
    setPendingDeath(null);
  }, []);

  const alog = useCallback((msg, type = "normal") => {
    setLog((current) => [...current.slice(-80), { msg, type, id: makeId("log") }]);
  }, []);

  const updLt = useCallback((updates) => {
    setLt((prev) => {
      const next = { ...prev };
      Object.entries(updates).forEach(([key, value]) => {
        next[key] = typeof value === "function" ? value(prev[key]) : value;
      });
      ltRef.current = next;
      LS.set("ll_lt", next);
      return next;
    });
  }, []);

  const updRs = useCallback((updates) => {
    setRs((prev) => {
      const next = { ...prev, ...updates };
      rsRef.current = next;
      return next;
    });
  }, []);

  const addToast = useCallback((definition) => {
    const id = makeId("toast");
    setToasts((current) => [...current, { ...definition, id }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const tryUnlock = useCallback(
    (id) => {
      if (achRef.current.includes(id)) return;
      const definition = ACHDEFS.find((entry) => entry.id === id);
      if (!definition) return;

      const next = [...achRef.current, id];
      achRef.current = next;
      setAch(next);
      LS.set("ll_ach", next);
      addToast(definition);
      setLog((current) => [
        ...current.slice(-80),
        {
          msg: `Achievement unlocked: ${definition.e} ${definition.name}!`,
          type: "gold",
          id: makeId("log"),
        },
      ]);
    },
    [addToast]
  );

  const loadSaveIntoState = useCallback((save) => {
    setDepartureWarningOpen(false);
    setView(save.view || "shop");
    setP(save.p || DEF_P);
    setInv(save.inv || []);
    setDng(save.dng || null);
    setFl(save.fl || 0);
    setRooms(save.rooms || 0);
    setFoe(save.foe || null);
    setAfterFight(save.af || null);
    setUnlocked(save.unlocked || [1, 2]);
    setRs(save.rs || DEF_RS);
    rsRef.current = save.rs || DEF_RS;
    setLog(save.log || []);
    setMQuote(save.view === "shop" ? pick(GREETINGS) : "");
  }, []);

  const continueGame = useCallback(() => {
    const save = normalizeSave(LS.get("ll_save", null));
    if (!save) return;
    clearPendingDeath();
    loadSaveIntoState(save);
  }, [clearPendingDeath, loadSaveIntoState]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    const storedLifetime = { ...DEF_LT, ...LS.get("ll_lt", DEF_LT) };
    const storedAchievements = LS.get("ll_ach", []);
    const storedScores = LS.get("ll_hs", []);
    setLt(storedLifetime);
    ltRef.current = storedLifetime;
    setAch(storedAchievements);
    achRef.current = storedAchievements;
    setHs(storedScores);

    const save = normalizeSave(LS.get("ll_save", null));
    if (save) loadSaveIntoState(save);

    loaded.current = true;
  }, [loadSaveIntoState]);

  useEffect(() => {
    if (!loaded.current) return;

    const safeView =
      view === "combat" && !foe ? (dng ? "floorHub" : "shop") : view === "floorHub" && !dng ? "shop" : view;
    const saveView = safeView === "profile" ? prevView : safeView;

    if (saveView === "title" || saveView === "dead") {
      LS.del("ll_save");
      return;
    }

    LS.set("ll_save", {
      version: SAVE_VERSION,
      view: saveView,
      p,
      inv,
      dng,
      fl,
      rooms,
      foe: saveView === "combat" ? foe : null,
      af: saveView === "combat" ? afterFight : null,
      unlocked,
      rs,
      log: log.slice(-40),
    });
  }, [view, p, inv, dng, fl, rooms, foe, afterFight, unlocked, rs, log, prevView]);

  useEffect(() => {
    if (!loaded.current) return;
    if (currentLuck > ltRef.current.bestLuck) updLt({ bestLuck: currentLuck });
  }, [currentLuck, updLt]);

  useEffect(() => () => clearPendingDeath(), [clearPendingDeath]);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        view,
        layout: "menu-driven interface; no world coordinates",
        player: {
          hp: p.hp,
          mhp: p.mhp,
          atk: p.atk,
          def: p.def,
          gold: p.gold,
          pot: p.pot,
          luck: p.luck,
        },
        inventory: {
          count: inv.length,
          totalValue: inv.reduce((sum, item) => sum + item.value, 0),
          luckTotal: currentLuck,
          luckyItemCount,
          lockedCount: lockedItemCount,
        },
        luckTier: luckTier.key,
        dungeon: dng
          ? {
              id: dng.id,
              name: dng.name,
              floor: fl,
              floors: dng.floors,
              rooms,
            }
          : null,
        foe: foe
          ? {
              name: foe.name,
              displayName: foe.displayName || foe.name,
              title: foe.encounterTitle || "",
              hp: foe.hp,
              maxHp: foe.maxHp,
              atk: foe.atk,
              def: foe.def,
            }
          : null,
        story: {
          latest: latestStory?.msg || "",
          recent: storyEntries.map((entry) => entry.msg),
        },
        departureWarningOpen,
        runStats: rs,
      });
    window.advanceTime = () => {};

    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [view, p, inv, dng, fl, rooms, foe, rs, currentLuck, luckyItemCount, lockedItemCount, luckTier, log, departureWarningOpen]);

  const recordHs = useCallback(() => {
    const entry = {
      gold: rsRef.current.earned,
      slain: rsRef.current.slain,
      floor: rsRef.current.deepest,
      rooms: rsRef.current.rooms,
      date: new Date().toLocaleDateString(),
    };
    setHs((prev) => {
      const next = [...prev, entry].sort((a, b) => b.gold - a.gold).slice(0, 5);
      LS.set("ll_hs", next);
      return next;
    });
  }, []);

  const awardDungeonClear = useCallback(() => {
    const nextRunClears = rsRef.current.clears + 1;
    const nextLifetimeClears = ltRef.current.clears + 1;
    updRs({ clears: nextRunClears });
    updLt({ clears: nextLifetimeClears });
    tryUnlock("clear");
    if (nextLifetimeClears >= 5) tryUnlock("spelunker");
  }, [tryUnlock, updLt, updRs]);

  const doDeath = useCallback(() => {
    clearPendingDeath();
    recordHs();
    const nextDeaths = ltRef.current.deaths + 1;
    updLt({ deaths: nextDeaths });
    if (nextDeaths >= 5) tryUnlock("persistent");
    setView("dead");
  }, [clearPendingDeath, recordHs, tryUnlock, updLt]);

  const queueDeath = useCallback(
    (message) => {
      clearPendingDeath();
      setPendingDeath({ message });
      deathTimerRef.current = setTimeout(() => {
        deathTimerRef.current = null;
        doDeath();
      }, 900);
    },
    [clearPendingDeath, doDeath]
  );

  const goShop = useCallback(() => {
    clearPendingDeath();
    setDepartureWarningOpen(false);
    setView("shop");
    setMQuote(pick(GREETINGS));
    setDng(null);
    setFl(0);
    setRooms(0);
    setFoe(null);
    setAfterFight(null);
  }, [clearPendingDeath]);

  const goProfile = useCallback(() => {
    setPrevView(view);
    setProfTab("stats");
    setView("profile");
  }, [view]);

  const resetRun = useCallback(() => {
    clearPendingDeath();
    setDepartureWarningOpen(false);
    setP({ ...DEF_P });
    setInv([]);
    setDng(null);
    setFl(0);
    setRooms(0);
    setFoe(null);
    setAfterFight(null);
    setLog([]);
    setUnlocked([1, 2]);
    setMQuote("");
    setRs({ ...DEF_RS });
    rsRef.current = { ...DEF_RS };
  }, [clearPendingDeath]);

  const sellAll = () => {
    const sellableItems = getSellableItems(inv);
    if (sellableItems.length === 0) return;
    const total = sellableItems.reduce((sum, item) => sum + item.value, 0);
    const newGold = p.gold + total;
    const newLifetimeGold = ltRef.current.gold + total;
    const heldCount = inv.length - sellableItems.length;

    setP((prev) => ({ ...prev, gold: newGold }));
    setInv((current) => current.filter((item) => item.locked));
    updRs({ earned: rsRef.current.earned + total });
    updLt({ gold: newLifetimeGold });
    alog(
      `You cash in ${sellableItems.length} curios for ${total} gold.${heldCount > 0 ? ` ${heldCount} held item${heldCount === 1 ? "" : "s"} stay tucked away.` : ""} ${pick(SELL_QUOTES)}`,
      "gold"
    );

    if (newGold >= 500) tryUnlock("deep_pockets");
    if (newLifetimeGold >= 1000) tryUnlock("big_earner");
    if (newLifetimeGold >= 5000) tryUnlock("tycoon");
  };

  const sellOne = (id) => {
    const item = inv.find((entry) => entry.id === id);
    if (!item) return;

    const newGold = p.gold + item.value;
    const newLifetimeGold = ltRef.current.gold + item.value;

    setP((prev) => ({ ...prev, gold: newGold }));
    setInv((current) => current.filter((entry) => entry.id !== id));
    updRs({ earned: rsRef.current.earned + item.value });
    updLt({ gold: newLifetimeGold });
    alog(`You sell ${item.name} for ${item.value} gold.`, "gold");

    if (newGold >= 500) tryUnlock("deep_pockets");
    if (newLifetimeGold >= 1000) tryUnlock("big_earner");
    if (newLifetimeGold >= 5000) tryUnlock("tycoon");
  };

  const toggleLockItem = (id) => {
    setInv((current) =>
      current.map((item) => (item.id === id ? { ...item, locked: !item.locked } : item))
    );
  };

  const upgWeapon = () => {
    const cost = upgCost(p.wlv);
    if (p.gold < cost) {
      alog(`Need ${cost}g to sharpen your gear.`, "warn");
      return;
    }

    const nextLevel = p.wlv + 1;
    setP((prev) => ({ ...prev, gold: prev.gold - cost, wlv: nextLevel, atk: prev.atk + weaponBonus.atk }));
    alog(`Your weapon is blessed up to level ${nextLevel}. Attack +${weaponBonus.atk}.`, "ok");
    if (nextLevel >= 5) tryUnlock("upgraded");
  };

  const upgArmor = () => {
    const cost = upgCost(p.alv);
    if (p.gold < cost) {
      alog(`Need ${cost}g to reinforce your coat.`, "warn");
      return;
    }

    const nextLevel = p.alv + 1;
    setP((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      alv: nextLevel,
      def: prev.def + armorBonus.def,
      mhp: prev.mhp + armorBonus.hp,
      hp: Math.min(prev.hp + armorBonus.hp, prev.mhp + armorBonus.hp),
    }));
    alog(`Your armor is lined with lucky iron. Defense +${armorBonus.def}, Max HP +${armorBonus.hp}.`, "ok");
    if (nextLevel >= 5) tryUnlock("upgraded");
  };

  const upgLuck = () => {
    const cost = getLuckUpgradeCost(p.luck);
    if (p.gold < cost) {
      alog(`Need ${cost}g to bribe fortune.`, "warn");
      return;
    }

    setP((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      luck: prev.luck + 1,
    }));
    alog(`The broker pockets ${cost}g and nudges your luck upward. Base Luck +1.`, "ok");
  };

  const buyPot = () => {
    if (p.gold < 15) {
      alog("Need 15g for a tonic bottle.", "warn");
      return;
    }
    setP((prev) => ({ ...prev, gold: prev.gold - 15, pot: prev.pot + 1 }));
    alog("You buy a green glass tonic for the road.", "ok");
  };

  const restInn = () => {
    if (p.hp >= p.mhp) {
      alog("You already look as alive as you're going to get.", "warn");
      return;
    }
    if (p.gold < 10) {
      alog("Need 10g for a booth, a blanket, and a hot stew.", "warn");
      return;
    }
    setP((prev) => ({ ...prev, gold: prev.gold - 10, hp: prev.mhp }));
    alog("You recover beside a warm hearth and a suspiciously helpful fiddle tune.", "ok");
  };

  const travelEvent = (direction, dungeonData, options = {}) => {
    const completedDungeon = Boolean(options.completedDungeon);
    const roll = Math.random() * 100;

    if (roll < 30) {
      const tier = dungeonData.tier;
      const tollGoblin = {
        name: "Roadside Toll Goblin",
        displayName: "Roadside Toll Goblin",
        encounterTitle: "",
        emoji: "🍀",
        hp: 12 + tier * 6,
        maxHp: 12 + tier * 6,
        atk: 3 + tier * 2,
        def: 1 + tier,
      };
      const encounter = decorateMonsterEncounter({ monster: tollGoblin, floor: 0, rooms: 0 }, currentLuck);
      alog(encounter.message, "bad");
      setFoe({
        ...tollGoblin,
        displayName: encounter.displayName,
        encounterTitle: encounter.encounterTitle,
      });
      setAfterFight(direction === "to" ? { type: "enterDungeon" } : { type: "goShop", completedDungeon });
      setView("combat");
      return true;
    }

    if (roll < 50) {
      const quiet = decorateTravelOutcome({ kind: "quiet" }, currentLuck);
      alog(quiet.message, "info");
    } else if (roll < 65) {
      const loot = rollLoot(1, 1, 0);
      const decoratedLoot = decorateLootOutcome({ item: loot, source: "road" }, currentLuck);
      alog(decoratedLoot.message, "ok");
      setInv((current) => [...current, loot]);
      updLt({ items: ltRef.current.items + 1 });
    } else if (roll < 80) {
      const potionGift = decorateTravelOutcome({ kind: "potion" }, currentLuck);
      alog(potionGift.message, "ok");
      setP((prev) => ({ ...prev, pot: prev.pot + 1 }));
    } else if (roll < 90 && direction === "back" && inv.length > 0) {
      const lostItem = pick(inv);
      const mishap = decorateTravelOutcome({ kind: "loss", item: lostItem }, currentLuck);
      setInv((current) => current.filter((item) => item.id !== lostItem.id));
      alog(mishap.message, "bad");
    } else {
      const nothing = decorateTravelOutcome({ kind: "none" }, currentLuck);
      alog(nothing.message, "info");
    }

    return false;
  };

  const startJourney = (dungeonData) => {
    setDepartureWarningOpen(false);
    setDng(dungeonData);
    setFl(0);
    setRooms(0);
    setAfterFight(null);
    alog(`You set out beneath a green moon for ${dungeonData.name}.`, "info");
    if (!travelEvent("to", dungeonData)) enterFloor(1, dungeonData);
  };

  const arriveShop = (fromHp, completedDungeon = false) => {
    if (completedDungeon) awardDungeonClear();
    if (fromHp <= 5) tryUnlock("close_call");
    alog("You stagger back to the broker's snug with your haul intact.", "info");
    goShop();
  };

  const startRetreat = (dungeonData) => {
    const activeDungeon = dungeonData || dng;
    const completedDungeon = didReturnFromClearedDungeon(fl, activeDungeon);
    alog("You cut your losses and head for the lanterns of town.", "info");
    if (!travelEvent("back", activeDungeon, { completedDungeon })) arriveShop(p.hp, completedDungeon);
  };

  const enterFloor = (floorNum, dungeonData) => {
    const dungeon = dungeonData || dng;
    if (!dungeon) return;

    setFl(floorNum);
    setDng(dungeon);
    setRooms(0);
    setFoe(null);
    setAfterFight(null);

    const newDeepest = Math.max(rsRef.current.deepest, floorNum);
    updRs({ deepest: newDeepest });
    updLt({ bestFloor: Math.max(ltRef.current.bestFloor, floorNum) });

    if (floorNum >= 5) tryUnlock("deep");
    if (floorNum >= 8) tryUnlock("abyss");

    alog("--------------------------------", "dim");
    alog(`${dungeon.name} - Floor ${floorNum}/${dungeon.floors}`, "info");
    alog(`The omens read ${getDanger(floorNum, dungeon.tier, 0).label.toLowerCase()}.`, "dim");
    setView("floorHub");
  };

  const exploreRoom = () => {
    if (!dng) return;

    const nextRooms = rooms + 1;
    setRooms(nextRooms);
    updRs({ rooms: rsRef.current.rooms + 1 });
    updLt({ rooms: ltRef.current.rooms + 1 });

    if (nextRooms >= 8) tryUnlock("thorough");
    alog(`[Room ${nextRooms}] ${pick(EXPLORE_FLAVOR)}`, "dim");

    const monsterChance = 40 + nextRooms * 4 + fl * 2;
    const lootChance = 30 - nextRooms * 1.5;
    const trapChance = 8 + nextRooms * 2 + dng.tier * 2;
    const roll = Math.random() * 100;

    if (roll < monsterChance) {
      const monster = spawnMonster(fl, dng.tier, nextRooms);
      const encounter = decorateMonsterEncounter({ monster, floor: fl, rooms: nextRooms }, currentLuck);
      alog(encounter.message, "bad");
      setFoe({
        ...monster,
        displayName: encounter.displayName,
        encounterTitle: encounter.encounterTitle,
      });
      setAfterFight({ type: "floorHub" });
      setView("combat");
      return;
    }

    if (roll < monsterChance + lootChance) {
      const loot = rollLoot(fl, dng.tier, nextRooms);
      const decoratedLoot = decorateLootOutcome({ item: loot, source: "room" }, currentLuck);
      alog(decoratedLoot.message, "ok");
      setInv((current) => {
        const next = [...current, loot];
        if (next.length >= 10) tryUnlock("hoarder");
        return next;
      });
      updLt({ items: ltRef.current.items + 1 });
      if (loot.rarity === "legendary") tryUnlock("legendary");
      return;
    }

    if (roll < monsterChance + lootChance + trapChance) {
      const damage = rand(3 + fl, 6 + dng.tier * 2 + fl + Math.floor(nextRooms / 2));
      const nextHp = Math.max(0, p.hp - damage);
      const trap = decorateTrapOutcome({ damage, fatal: nextHp <= 0 }, currentLuck);
      setP((prev) => ({ ...prev, hp: nextHp }));
      alog(trap.message, "bad");
      if (nextHp <= 0) {
        const death = decorateDeathOutcome({ cause: "trap" }, currentLuck);
        alog(death.message, "bad");
        queueDeath("Luck buckles. The room goes cold around you.");
      }
      return;
    }

    const empty = decorateEmptyRoomOutcome({ baseText: pick(EMPTY_ROOMS) }, currentLuck);
    alog(empty.message, "info");
  };

  const handleKill = () => {
    const nextSlain = ltRef.current.slain + 1;
    updRs({ slain: rsRef.current.slain + 1 });
    updLt({ slain: nextSlain });
    if (nextSlain >= 1) tryUnlock("first_blood");
    if (nextSlain >= 50) tryUnlock("hunter");
    if (nextSlain >= 200) tryUnlock("exterminator");
  };

  const doAttack = () => {
    if (!foe) return;

    const attackBonus = rand(-1, 2);
    const playerDamage = Math.max(1, p.atk - foe.def + attackBonus);
    const foeHp = foe.hp - playerDamage;
    const attack = decorateAttackOutcome(
      { targetName: foe.displayName || foe.name, damage: playerDamage, highRoll: attackBonus === 2 },
      currentLuck
    );
    alog(attack.message, "hit");

    if (foeHp <= 0) {
      const nextAfterFight = getAfterFightType(afterFight);
      const completedDungeon = getAfterFightCompletion(afterFight);
      const defeat = decorateEnemyDefeatOutcome({ foeName: foe.displayName || foe.name }, currentLuck);
      alog(defeat.message, "ok");
      handleKill();

      if (Math.random() < 0.6) {
        const loot = rollLoot(fl || 1, dng?.tier || 1, rooms);
        const decoratedLoot = decorateLootOutcome({ item: loot, source: "drop" }, currentLuck);
        alog(decoratedLoot.message, "ok");
        setInv((current) => {
          const next = [...current, loot];
          if (next.length >= 10) tryUnlock("hoarder");
          return next;
        });
        updLt({ items: ltRef.current.items + 1 });
        if (loot.rarity === "legendary") tryUnlock("legendary");
      }

      setFoe(null);
      setAfterFight(null);

      if (nextAfterFight === "enterDungeon") {
        enterFloor(1, dng);
      } else if (nextAfterFight === "goShop") {
        arriveShop(p.hp, completedDungeon);
      } else {
        setView("floorHub");
      }
      return;
    }

    setFoe((prev) => ({ ...prev, hp: foeHp }));

    const enemyDamage = Math.max(1, foe.atk - p.def + rand(-1, 2));
    const nextPlayerHp = p.hp - enemyDamage;
    const enemyAttack = decorateEnemyAttackOutcome(
      { attackerName: foe.displayName || foe.name, damage: enemyDamage },
      currentLuck
    );
    alog(enemyAttack.message, "bad");

    if (nextPlayerHp <= 0) {
      setP((prev) => ({ ...prev, hp: 0 }));
      const death = decorateDeathOutcome({ cause: "combat", foeName: foe.displayName || foe.name }, currentLuck);
      alog(death.message, "bad");
      queueDeath("Luck blinks. You're about to be carried out of this mess.");
      return;
    }

    setP((prev) => ({ ...prev, hp: nextPlayerHp }));
  };

  const usePot = () => {
    if (p.pot <= 0) {
      alog("No tonic bottles left.", "warn");
      return;
    }
    if (!canUsePotion(p)) {
      alog("You're already running at full mischief.", "warn");
      return;
    }

    const heal = Math.min(25, p.mhp - p.hp);
    setP((prev) => ({ ...prev, hp: Math.min(prev.mhp, prev.hp + heal), pot: prev.pot - 1 }));
    updLt({ potions: ltRef.current.potions + 1 });
    alog(`You knock back a tonic and recover ${heal} HP.`, "ok");
  };

  const doFlee = () => {
    if (!foe) return;

    if (Math.random() < 0.55) {
      const nextAfterFight = getAfterFightType(afterFight);
      const completedDungeon = getAfterFightCompletion(afterFight);
      alog("You bolt while fortune argues with itself behind you.", "info");
      setFoe(null);
      setAfterFight(null);

      if (nextAfterFight === "goShop") {
        arriveShop(p.hp, completedDungeon);
      } else if (nextAfterFight === "enterDungeon") {
        goShop();
      } else {
        setView("floorHub");
      }
      return;
    }

    const enemyDamage = Math.max(1, foe.atk - p.def + rand(0, 2));
    const enemyAttack = decorateEnemyAttackOutcome(
      { attackerName: foe.displayName || foe.name, damage: enemyDamage },
      currentLuck
    );
    alog(`Your escape fails. ${enemyAttack.message}`, "bad");

    if (p.hp - enemyDamage <= 0) {
      setP((prev) => ({ ...prev, hp: 0 }));
      const death = decorateDeathOutcome({ cause: "flee", foeName: foe.displayName || foe.name }, currentLuck);
      alog(death.message, "bad");
      queueDeath("The escape goes sideways. This is where the run folds.");
      return;
    }

    setP((prev) => ({ ...prev, hp: prev.hp - enemyDamage }));
  };

  const unlockDungeon = (dungeon) => {
    if (p.gold < dungeon.cost) {
      alog(`Need ${dungeon.cost}g to buy a whisper-map for this place.`, "warn");
      return;
    }

    const nextUnlocked = unlocked.includes(dungeon.id) ? unlocked : [...unlocked, dungeon.id].sort((a, b) => a - b);
    const discoveries = getNewlyDiscoveredDungeons(unlocked, nextUnlocked);

    setP((prev) => ({ ...prev, gold: prev.gold - dungeon.cost }));
    setUnlocked(nextUnlocked);
    alog(`The broker unlocks ${dungeon.name} and pretends not to know what lives there.`, "ok");
    discoveries.forEach((discovery) => {
      alog(`A fresh rumor surfaces: ${discovery.name}. The broker insists it was definitely there yesterday.`, "gold");
    });
  };

  const restart = () => {
    resetRun();
    updLt({ runs: ltRef.current.runs + 1 });
    goShop();
    alog("You dust yourself off and chase the next lucky mistake.", "info");
  };

  const newGame = () => {
    resetRun();
    updLt({ runs: ltRef.current.runs + 1 });
    goShop();
    alog("You arrive at the broker's snug with empty pockets and dangerous optimism.", "info");
  };

  const nukeData = () => {
    LS.del("ll_save");
    LS.del("ll_lt");
    LS.del("ll_ach");
    LS.del("ll_hs");

    ltRef.current = { ...DEF_LT };
    achRef.current = [];
    rsRef.current = { ...DEF_RS };

    setLt({ ...DEF_LT });
    setAch([]);
    setHs([]);
    resetRun();
    setView("title");
  };

  const openDungeonPicker = useCallback(() => {
    if (p.hp >= p.mhp) {
      setDepartureWarningOpen(false);
      setView("pick");
      return;
    }
    setDepartureWarningOpen(true);
  }, [p.hp, p.mhp]);

  const activeView =
    view === "combat" && !foe ? (dng ? "floorHub" : "shop") : view === "floorHub" && !dng ? "shop" : view;

  if (activeView === "title") {
    return <TitleScreen toasts={toasts} continueGame={continueGame} newGame={newGame} goProfile={goProfile} />;
  }

  if (activeView === "dead") {
    return <DeadScreen toasts={toasts} rs={rs} inv={inv} restart={restart} goProfile={goProfile} />;
  }

  if (activeView === "profile") {
    return (
      <ProfileScreen
        toasts={toasts}
        prevView={prevView}
        setView={setView}
        profTab={profTab}
        setProfTab={setProfTab}
        lt={lt}
        ach={ach}
        hs={hs}
        nukeData={nukeData}
      />
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-950/95 p-3 text-white">
      <ToastLayer toasts={toasts} />
      <ConfirmDialog
        open={departureWarningOpen}
        title="Leave town while hurt?"
        body={`You're heading out at ${p.hp}/${p.mhp} HP. Hearth Rest in the snug will refill you before the next run. Leave town hurt anyway?`}
        confirmLabel="Leave Hurt Anyway"
        onConfirm={() => {
          setDepartureWarningOpen(false);
          setView("pick");
        }}
        onCancel={() => setDepartureWarningOpen(false)}
        tone="bg-amber-700 hover:bg-amber-600"
      />
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] max-w-2xl min-h-0 flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-300 via-yellow-200 to-amber-300 bg-clip-text text-lg font-bold text-transparent">
              Loot, Luck &amp; Liability
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {dng && fl > 0 && (
              <span className="text-xs text-emerald-100/70">
                {dng.name} F{fl}/{dng.floors} R{rooms}
              </span>
            )}
            <button
              type="button"
              onClick={goProfile}
              className="text-sm text-emerald-100/60 transition-colors hover:text-yellow-100"
            >
              Ledger
            </button>
          </div>
        </div>
        <StatsBar p={p} invLength={inv.length} currentLuck={currentLuck} />
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-emerald-400/20 bg-slate-900/90 p-4 shadow-[0_0_40px_rgba(16,185,129,0.08)]">
          {activeView === "shop" && (
            <ShopView
              p={p}
              inv={inv}
              mQuote={mQuote}
              sellAll={sellAll}
              sellOne={sellOne}
              toggleLock={toggleLockItem}
              upgWeapon={upgWeapon}
              upgArmor={upgArmor}
              upgLuck={upgLuck}
              buyPot={buyPot}
              restInn={restInn}
              openDungeonPicker={openDungeonPicker}
              upgCost={upgCost}
              luckCost={getLuckUpgradeCost(p.luck)}
              currentLuck={currentLuck}
              luckyItemCount={luckyItemCount}
              sellableTotal={sellableTotal}
              lockedCount={lockedItemCount}
              weaponBonus={weaponBonus}
              armorBonus={armorBonus}
            />
          )}
          {activeView === "pick" && (
            <div className="h-full overflow-y-auto pr-1">
              <PickDungeonView
                dungeons={dungeonCatalog}
                unlocked={unlocked}
                goShop={goShop}
                startJourney={startJourney}
                unlockDungeon={unlockDungeon}
              />
            </div>
          )}
          {activeView === "combat" && (
            <CombatView
              foe={foe}
              p={p}
              doAttack={doAttack}
              usePot={usePot}
              doFlee={doFlee}
              pendingDeath={pendingDeath}
              storyEntries={storyEntries}
            />
          )}
          {activeView === "floorHub" && (
            <FloorHubView
              dng={dng}
              fl={fl}
              rooms={rooms}
              p={p}
              inv={inv}
              currentLuck={currentLuck}
              luckTier={luckTier}
              enterFloor={enterFloor}
              exploreRoom={exploreRoom}
              startRetreat={startRetreat}
              usePot={usePot}
              pendingDeath={pendingDeath}
              storyEntries={storyEntries}
            />
          )}
        </div>
        {activeView !== "combat" && activeView !== "floorHub" && <LogBox logRef={logRef} log={log} />}
      </div>
    </div>
  );
}
