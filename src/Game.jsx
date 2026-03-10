import { useCallback, useEffect, useRef, useState } from "react";
import { ToastLayer } from "./components/ToastLayer.jsx";
import { LogBox } from "./components/LogBox.jsx";
import { StatsBar } from "./components/StatsBar.jsx";
import { TitleScreen } from "./screens/TitleScreen.jsx";
import { DeadScreen } from "./screens/DeadScreen.jsx";
import { ProfileScreen } from "./screens/ProfileScreen.jsx";
import { ShopView } from "./screens/ShopView.jsx";
import { PickDungeonView } from "./screens/PickDungeonView.jsx";
import { CombatView } from "./screens/CombatView.jsx";
import { FloorHubView } from "./screens/FloorHubView.jsx";
import { GREETINGS, SELL_QUOTES, EXPLORE_FLAVOR, EMPTY_ROOMS, ACHDEFS } from "./data/Constants.js";
import { DEF_LT, DEF_P, DEF_RS } from "./data/Defaults.js";
import {
  canUsePotion,
  didReturnFromClearedDungeon,
  getDanger,
  rollLoot,
  spawnMonster,
  upgCost,
} from "./utils/GameLogic.js";
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

  const logRef = useRef(null);
  const loaded = useRef(false);
  const ltRef = useRef(DEF_LT);
  const achRef = useRef([]);
  const rsRef = useRef(DEF_RS);

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
    loadSaveIntoState(save);
  }, [loadSaveIntoState]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    const storedLifetime = LS.get("ll_lt", DEF_LT);
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
    window.render_game_to_text = () =>
      JSON.stringify({
        view,
        layout: "menu-driven interface; no world coordinates",
        player: p,
        inventory: {
          count: inv.length,
          totalValue: inv.reduce((sum, item) => sum + item.value, 0),
        },
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
              hp: foe.hp,
              maxHp: foe.maxHp,
              atk: foe.atk,
              def: foe.def,
            }
          : null,
        runStats: rs,
      });
    window.advanceTime = () => {};

    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [view, p, inv, dng, fl, rooms, foe, rs]);

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
    recordHs();
    const nextDeaths = ltRef.current.deaths + 1;
    updLt({ deaths: nextDeaths });
    if (nextDeaths >= 5) tryUnlock("persistent");
    setView("dead");
  }, [recordHs, tryUnlock, updLt]);

  const goShop = useCallback(() => {
    setView("shop");
    setMQuote(pick(GREETINGS));
    setDng(null);
    setFl(0);
    setRooms(0);
    setFoe(null);
    setAfterFight(null);
  }, []);

  const goProfile = useCallback(() => {
    setPrevView(view);
    setProfTab("stats");
    setView("profile");
  }, [view]);

  const resetRun = useCallback(() => {
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
  }, []);

  const sellAll = () => {
    if (inv.length === 0) return;
    const total = inv.reduce((sum, item) => sum + item.value, 0);
    const newGold = p.gold + total;
    const newLifetimeGold = ltRef.current.gold + total;

    setP((prev) => ({ ...prev, gold: newGold }));
    setInv([]);
    updRs({ earned: rsRef.current.earned + total });
    updLt({ gold: newLifetimeGold });
    alog(`Sold ${inv.length} items for ${total} gold. ${pick(SELL_QUOTES)}`, "gold");

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
    alog(`Sold ${item.name} for ${item.value}g`, "gold");

    if (newGold >= 500) tryUnlock("deep_pockets");
    if (newLifetimeGold >= 1000) tryUnlock("big_earner");
    if (newLifetimeGold >= 5000) tryUnlock("tycoon");
  };

  const upgWeapon = () => {
    const cost = upgCost(p.wlv);
    if (p.gold < cost) {
      alog(`Need ${cost}g to upgrade weapon.`, "warn");
      return;
    }

    const nextLevel = p.wlv + 1;
    setP((prev) => ({ ...prev, gold: prev.gold - cost, wlv: nextLevel, atk: prev.atk + 3 }));
    alog(`Weapon upgraded to level ${nextLevel}. Attack +3.`, "ok");
    if (nextLevel >= 5) tryUnlock("upgraded");
  };

  const upgArmor = () => {
    const cost = upgCost(p.alv);
    if (p.gold < cost) {
      alog(`Need ${cost}g to upgrade armor.`, "warn");
      return;
    }

    const nextLevel = p.alv + 1;
    setP((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      alv: nextLevel,
      def: prev.def + 2,
      mhp: prev.mhp + 5,
      hp: Math.min(prev.hp + 5, prev.mhp + 5),
    }));
    alog(`Armor upgraded to level ${nextLevel}. Defense +2, Max HP +5.`, "ok");
    if (nextLevel >= 5) tryUnlock("upgraded");
  };

  const buyPot = () => {
    if (p.gold < 15) {
      alog("Need 15g for a potion.", "warn");
      return;
    }
    setP((prev) => ({ ...prev, gold: prev.gold - 15, pot: prev.pot + 1 }));
    alog("Bought a healing potion.", "ok");
  };

  const restInn = () => {
    if (p.hp >= p.mhp) {
      alog("Already at full health.", "warn");
      return;
    }
    if (p.gold < 10) {
      alog("Need 10g to rest.", "warn");
      return;
    }
    setP((prev) => ({ ...prev, gold: prev.gold - 10, hp: prev.mhp }));
    alog("Rested at the inn. HP fully restored.", "ok");
  };

  const travelEvent = (direction, dungeonData, options = {}) => {
    const completedDungeon = Boolean(options.completedDungeon);
    const roll = Math.random() * 100;

    if (roll < 30) {
      const tier = dungeonData.tier;
      const bandit = {
        name: "Roadside Bandit",
        emoji: "🥷",
        hp: 12 + tier * 6,
        maxHp: 12 + tier * 6,
        atk: 3 + tier * 2,
        def: 1 + tier,
      };
      alog("Bandits ambush the cart and demand your loot.", "bad");
      setFoe(bandit);
      setAfterFight(direction === "to" ? { type: "enterDungeon" } : { type: "goShop", completedDungeon });
      setView("combat");
      return true;
    }

    if (roll < 50) {
      alog("The road is quiet.", "info");
    } else if (roll < 65) {
      const loot = rollLoot(1, 1, 0);
      alog(`Found loot on the roadside: ${loot.name}.`, "ok");
      setInv((current) => [...current, loot]);
      updLt({ items: ltRef.current.items + 1 });
    } else if (roll < 80) {
      alog("A traveler hands you a potion.", "ok");
      setP((prev) => ({ ...prev, pot: prev.pot + 1 }));
    } else if (roll < 90 && direction === "back" && inv.length > 0) {
      const lostItem = pick(inv);
      setInv((current) => current.filter((item) => item.id !== lostItem.id));
      alog(`A pothole throws ${lostItem.name} off the cart.`, "bad");
    } else {
      alog("Nothing worth remembering happens on the road.", "info");
    }

    return false;
  };

  const startJourney = (dungeonData) => {
    setDng(dungeonData);
    setFl(0);
    setRooms(0);
    setAfterFight(null);
    alog(`Setting out for ${dungeonData.name}.`, "info");
    if (!travelEvent("to", dungeonData)) enterFloor(1, dungeonData);
  };

  const arriveShop = (fromHp, completedDungeon = false) => {
    if (completedDungeon) awardDungeonClear();
    if (fromHp <= 5) tryUnlock("close_call");
    alog("You made it back to the shop.", "info");
    goShop();
  };

  const startRetreat = (dungeonData) => {
    const activeDungeon = dungeonData || dng;
    const completedDungeon = didReturnFromClearedDungeon(fl, activeDungeon);
    alog("Retreating with your loot.", "info");
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
    alog(`Threat level: ${getDanger(floorNum, dungeon.tier, 0).label}.`, "dim");
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
      alog(`${monster.name} emerges from the dark.`, "bad");
      setFoe(monster);
      setAfterFight({ type: "floorHub" });
      setView("combat");
      return;
    }

    if (roll < monsterChance + lootChance) {
      const loot = rollLoot(fl, dng.tier, nextRooms);
      alog(`Found loot: ${loot.name} [${loot.rarity}] worth about ${loot.value}g.`, "ok");
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
      setP((prev) => {
        const nextHp = Math.max(0, prev.hp - damage);
        alog(`A trap springs for ${damage} damage.`, "bad");
        if (nextHp <= 0) {
          alog("The trap finishes you off.", "bad");
          setTimeout(() => doDeath(), 50);
        }
        return { ...prev, hp: nextHp };
      });
      return;
    }

    alog(pick(EMPTY_ROOMS), "info");
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

    const playerDamage = Math.max(1, p.atk - foe.def + rand(-1, 2));
    const foeHp = foe.hp - playerDamage;
    alog(`You hit ${foe.name} for ${playerDamage}.`, "hit");

    if (foeHp <= 0) {
      const nextAfterFight = getAfterFightType(afterFight);
      const completedDungeon = getAfterFightCompletion(afterFight);
      alog(`${foe.name} is defeated.`, "ok");
      handleKill();

      if (Math.random() < 0.6) {
        const loot = rollLoot(fl || 1, dng?.tier || 1, rooms);
        alog(`Loot dropped: ${loot.name} [${loot.rarity}] worth about ${loot.value}g.`, "ok");
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
    alog(`${foe.name} hits you for ${enemyDamage}.`, "bad");

    if (nextPlayerHp <= 0) {
      setP((prev) => ({ ...prev, hp: 0 }));
      alog("You have been slain.", "bad");
      doDeath();
      return;
    }

    setP((prev) => ({ ...prev, hp: nextPlayerHp }));
  };

  const usePot = () => {
    if (p.pot <= 0) {
      alog("No potions left.", "warn");
      return;
    }
    if (!canUsePotion(p)) {
      alog("Already at full health.", "warn");
      return;
    }

    const heal = Math.min(25, p.mhp - p.hp);
    setP((prev) => ({ ...prev, hp: Math.min(prev.mhp, prev.hp + heal), pot: prev.pot - 1 }));
    updLt({ potions: ltRef.current.potions + 1 });
    alog(`Potion used. Healed ${heal} HP.`, "ok");
  };

  const doFlee = () => {
    if (!foe) return;

    if (Math.random() < 0.55) {
      const nextAfterFight = getAfterFightType(afterFight);
      const completedDungeon = getAfterFightCompletion(afterFight);
      alog("You fled successfully.", "info");
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
    alog(`Failed to flee. ${foe.name} hits you for ${enemyDamage}.`, "bad");

    if (p.hp - enemyDamage <= 0) {
      setP((prev) => ({ ...prev, hp: 0 }));
      alog("Slain while fleeing.", "bad");
      doDeath();
      return;
    }

    setP((prev) => ({ ...prev, hp: prev.hp - enemyDamage }));
  };

  const unlockDungeon = (dungeon) => {
    if (p.gold < dungeon.cost) {
      alog(`Need ${dungeon.cost}g to unlock this dungeon.`, "warn");
      return;
    }

    setP((prev) => ({ ...prev, gold: prev.gold - dungeon.cost }));
    setUnlocked((current) => (current.includes(dungeon.id) ? current : [...current, dungeon.id]));
    alog(`Unlocked ${dungeon.name}.`, "ok");
  };

  const restart = () => {
    resetRun();
    updLt({ runs: ltRef.current.runs + 1 });
    goShop();
    alog("A new adventure begins.", "info");
  };

  const newGame = () => {
    resetRun();
    updLt({ runs: ltRef.current.runs + 1 });
    goShop();
    alog("You arrive at the merchant's shop.", "info");
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
    <div className="min-h-screen bg-gray-900 p-3 text-white">
      <ToastLayer toasts={toasts} />
      <div className="mx-auto max-w-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-lg font-bold text-transparent">
            Loot &amp; Liability
          </h1>
          <div className="flex items-center gap-2">
            {dng && fl > 0 && (
              <span className="text-xs text-gray-400">
                {dng.name} F{fl}/{dng.floors} R{rooms}
              </span>
            )}
            <button
              type="button"
              onClick={goProfile}
              className="text-sm text-gray-500 transition-colors hover:text-white"
            >
              Stats
            </button>
          </div>
        </div>
        <StatsBar p={p} invLength={inv.length} />
        <div className="min-h-72 rounded-lg border border-gray-700 bg-gray-800 p-4">
          {activeView === "shop" && (
            <ShopView
              p={p}
              inv={inv}
              mQuote={mQuote}
              sellAll={sellAll}
              sellOne={sellOne}
              upgWeapon={upgWeapon}
              upgArmor={upgArmor}
              buyPot={buyPot}
              restInn={restInn}
              setView={setView}
              upgCost={upgCost}
            />
          )}
          {activeView === "pick" && (
            <PickDungeonView
              unlocked={unlocked}
              goShop={goShop}
              startJourney={startJourney}
              unlockDungeon={unlockDungeon}
            />
          )}
          {activeView === "combat" && (
            <CombatView foe={foe} p={p} doAttack={doAttack} usePot={usePot} doFlee={doFlee} />
          )}
          {activeView === "floorHub" && (
            <FloorHubView
              dng={dng}
              fl={fl}
              rooms={rooms}
              p={p}
              inv={inv}
              enterFloor={enterFloor}
              exploreRoom={exploreRoom}
              startRetreat={startRetreat}
              usePot={usePot}
            />
          )}
        </div>
        <LogBox logRef={logRef} log={log} />
      </div>
    </div>
  );
}
