import { useState, useRef, useEffect, useCallback } from "react";
import { pick } from "./utils/Helpers.js";
import { LS } from "./utils/Helpers.js";
import { rollLoot, spawnMonster, getDanger, upgCost } from "./utils/GameLogic.js";
import { DEF_P, DEF_RS, DEF_LT } from "./data/Defaults.js";
import { GREETINGS, SELL_QUOTES, EXPLORE_FLAVOR, EMPTY_ROOMS, ACHDEFS } from "./data/Constants.js";
import { rand } from "./utils/Helpers.js";
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

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    const slt = LS.get("ll_lt", DEF_LT);
    const sach = LS.get("ll_ach", []);
    const shs = LS.get("ll_hs", []);
    setLt(slt);
    ltRef.current = slt;
    setAch(sach);
    achRef.current = sach;
    setHs(shs);
    const save = LS.get("ll_save", null);
    if (save) {
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
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const sv = view === "profile" ? prevView : view;
    if (sv === "title" || sv === "dead") {
      LS.del("ll_save");
      return;
    }
    LS.set("ll_save", {
      view: sv,
      p,
      inv,
      dng,
      fl,
      rooms,
      foe,
      af: afterFight,
      unlocked,
      rs,
      log: log.slice(-40),
    });
  }, [view, p, inv, dng, fl, rooms, foe, afterFight, unlocked, rs, log, prevView]);

  const alog = (msg, type = "normal") =>
    setLog((l) => [...l.slice(-80), { msg, type, id: Date.now() + Math.random() }]);

  const updLt = useCallback((updates) => {
    setLt((prev) => {
      const next = { ...prev };
      Object.entries(updates).forEach(([k, v]) => {
        next[k] = typeof v === "function" ? v(prev[k]) : v;
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

  const addToast = useCallback((def) => {
    const id = Date.now();
    setToasts((t) => [...t, { ...def, id }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const tryUnlock = useCallback(
    (id) => {
      if (achRef.current.includes(id)) return;
      const def = ACHDEFS.find((a) => a.id === id);
      if (!def) return;
      const next = [...achRef.current, id];
      achRef.current = next;
      setAch(next);
      LS.set("ll_ach", next);
      addToast(def);
      setLog((l) => [
        ...l.slice(-80),
        { msg: `🏅 Achievement: ${def.e} ${def.name}!`, type: "gold", id: Date.now() + Math.random() },
      ]);
    },
    [addToast]
  );

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

  const doDeath = useCallback(() => {
    recordHs();
    const nd = ltRef.current.deaths + 1;
    updLt({ deaths: nd });
    if (nd >= 5) tryUnlock("persistent");
    setView("dead");
  }, [recordHs, updLt, tryUnlock]);

  const goShop = () => {
    setView("shop");
    setMQuote(pick(GREETINGS));
    setDng(null);
    setFl(0);
    setRooms(0);
  };

  const goProfile = () => {
    setPrevView(view);
    setProfTab("stats");
    setView("profile");
  };

  const sellAll = () => {
    if (!inv.length) return;
    const tot = inv.reduce((s, i) => s + i.value, 0);
    const newGold = p.gold + tot;
    const newLtGold = ltRef.current.gold + tot;
    setP((x) => ({ ...x, gold: newGold }));
    updRs({ earned: rsRef.current.earned + tot });
    updLt({ gold: newLtGold });
    alog(`💰 Sold ${inv.length} items for ${tot} gold! ${pick(SELL_QUOTES)}`, "gold");
    setInv([]);
    if (newGold >= 500) tryUnlock("deep_pockets");
    if (newLtGold >= 1000) tryUnlock("big_earner");
    if (newLtGold >= 5000) tryUnlock("tycoon");
  };

  const sellOne = (id) => {
    const item = inv.find((i) => i.id === id);
    if (!item) return;
    const newGold = p.gold + item.value;
    const newLtGold = ltRef.current.gold + item.value;
    setP((x) => ({ ...x, gold: newGold }));
    updRs({ earned: rsRef.current.earned + item.value });
    updLt({ gold: newLtGold });
    setInv((v) => v.filter((i) => i.id !== id));
    alog(`💰 Sold ${item.emoji} ${item.name} for ${item.value}g`, "gold");
    if (newGold >= 500) tryUnlock("deep_pockets");
    if (newLtGold >= 1000) tryUnlock("big_earner");
    if (newLtGold >= 5000) tryUnlock("tycoon");
  };

  const upgWeapon = () => {
    const c = upgCost(p.wlv);
    if (p.gold < c) return alog(`Need ${c}g to upgrade weapon!`, "warn");
    const nl = p.wlv + 1;
    setP((x) => ({ ...x, gold: x.gold - c, wlv: nl, atk: x.atk + 3 }));
    alog(`⚔️ Weapon → Lv${nl}! Attack +3`, "ok");
    if (nl >= 5) tryUnlock("upgraded");
  };

  const upgArmor = () => {
    const c = upgCost(p.alv);
    if (p.gold < c) return alog(`Need ${c}g to upgrade armor!`, "warn");
    const nl = p.alv + 1;
    setP((x) => ({
      ...x,
      gold: x.gold - c,
      alv: nl,
      def: x.def + 2,
      mhp: x.mhp + 5,
      hp: Math.min(x.hp + 5, x.mhp + 5),
    }));
    alog(`🛡️ Armor → Lv${nl}! Defense +2, Max HP +5`, "ok");
    if (nl >= 5) tryUnlock("upgraded");
  };

  const buyPot = () => {
    if (p.gold < 15) return alog("Need 15g for a potion!", "warn");
    setP((x) => ({ ...x, gold: x.gold - 15, pot: x.pot + 1 }));
    alog("🧪 Bought a healing potion!", "ok");
  };

  const restInn = () => {
    if (p.hp >= p.mhp) return alog("Already at full health!", "warn");
    if (p.gold < 10) return alog("Need 10g to rest!", "warn");
    setP((x) => ({ ...x, gold: x.gold - 10, hp: x.mhp }));
    alog("🛏️ Rested at the inn. HP fully restored!", "ok");
  };

  const travelEvent = (dir, dungeonData) => {
    const r = Math.random() * 100;
    if (r < 30) {
      const tier = dungeonData.tier;
      const b = {
        name: "Roadside Bandit",
        emoji: "🦹",
        hp: 12 + tier * 6,
        maxHp: 12 + tier * 6,
        atk: 3 + tier * 2,
        def: 1 + tier,
      };
      alog("⚠️ Bandits ambush the cart! They want your loot!", "bad");
      setFoe(b);
      setAfterFight(dir === "to" ? "enterDungeon" : "goShop");
      setView("combat");
      return true;
    }
    if (r < 50) alog("🛤️ Peaceful road. Birds sing. Probably mocking you.", "info");
    else if (r < 65) {
      const l = rollLoot(1, 1, 0);
      alog(`✨ Found by the road: ${l.emoji} ${l.name}!`, "ok");
      setInv((v) => [...v, l]);
      updLt({ items: ltRef.current.items + 1 });
    } else if (r < 80) {
      alog("🧪 A friendly traveler shares a healing potion!", "ok");
      setP((x) => ({ ...x, pot: x.pot + 1 }));
    } else if (r < 90 && dir === "back" && inv.length > 0) {
      const lost = pick(inv);
      setInv((v) => v.filter((i) => i.id !== lost.id));
      alog(`💥 Pothole! ${lost.emoji} ${lost.name} bounced off the cart!`, "bad");
    } else alog("🛤️ An uneventful journey. You hum a tune about gold.", "info");
    return false;
  };

  const startJourney = (dungeonData) => {
    setDng(dungeonData);
    setFl(0);
    setRooms(0);
    alog(`🐴 Setting out for ${dungeonData.e} ${dungeonData.name}...`, "info");
    if (!travelEvent("to", dungeonData)) enterFloor(1, dungeonData);
  };

  const arriveShop = (fromHp) => {
    if (fromHp <= 5) tryUnlock("close_call");
    alog("🏪 You made it back to the shop!", "info");
    goShop();
  };

  const startRetreat = (dungeonData) => {
    alog("🏃 Retreating with your loot! Heading back...", "info");
    const hp = p.hp;
    if (!travelEvent("back", dungeonData || dng)) arriveShop(hp);
  };

  const enterFloor = (floorNum, dungeonData) => {
    const d = dungeonData || dng;
    setFl(floorNum);
    setDng(d);
    setRooms(0);
    const newDeepest = Math.max(rsRef.current.deepest, floorNum);
    updRs({ deepest: newDeepest });
    updLt({ bestFloor: Math.max(ltRef.current.bestFloor, floorNum) });
    if (floorNum >= 5) tryUnlock("deep");
    if (floorNum >= 8) tryUnlock("abyss");
    if (floorNum >= d.floors) {
      const nc = rsRef.current.clears + 1;
      const nlc = ltRef.current.clears + 1;
      updRs({ clears: nc });
      updLt({ clears: nlc });
      tryUnlock("clear");
      if (nlc >= 5) tryUnlock("spelunker");
    }
    alog("━━━━━━━━━━━━━━━━━━━━", "dim");
    alog(`📍 ${d.e} ${d.name} — Floor ${floorNum}/${d.floors}`, "info");
    const danger = getDanger(floorNum, d.tier, 0);
    alog(`Threat level: ${danger.label}.`, "dim");
    setView("floorHub");
  };

  const exploreRoom = () => {
    const d = dng;
    const nr = rooms + 1;
    setRooms(nr);
    updRs({ rooms: rsRef.current.rooms + 1 });
    updLt({ rooms: ltRef.current.rooms + 1 });
    if (nr >= 8) tryUnlock("thorough");
    alog(`🚪 [Room ${nr}] ${pick(EXPLORE_FLAVOR)}`, "dim");

    const mc = 40 + nr * 4 + fl * 2;
    const lc = 30 - nr * 1.5;
    const tc = 8 + nr * 2 + d.tier * 2;
    const r = Math.random() * 100;

    if (r < mc) {
      const m = spawnMonster(fl, d.tier, nr);
      alog(`${m.emoji} A ${m.name} lurches out!`, "bad");
      setFoe(m);
      setAfterFight("floorHub");
      setView("combat");
    } else if (r < mc + lc) {
      const l = rollLoot(fl, d.tier, nr);
      alog(`✨ Found: ${l.emoji} ${l.name} [${l.rarity}] ~${l.value}g`, "ok");
      setInv((v) => {
        const ni = [...v, l];
        if (ni.length >= 10) tryUnlock("hoarder");
        return ni;
      });
      updLt({ items: ltRef.current.items + 1 });
      if (l.rarity === "legendary") tryUnlock("legendary");
    } else if (r < mc + lc + tc) {
      const dmg = rand(3 + fl, 6 + d.tier * 2 + fl + Math.floor(nr / 2));
      setP((prev) => {
        const nh = Math.max(0, prev.hp - dmg);
        if (nh <= 0) {
          alog(`🪤 A trap springs! ${dmg} damage!`, "bad");
          alog("💀 The trap finishes you off...", "bad");
          setTimeout(() => doDeath(), 50);
          return { ...prev, hp: 0 };
        }
        alog(`🪤 A trap springs! ${dmg} damage!`, "bad");
        return { ...prev, hp: nh };
      });
    } else alog(`🚪 ${pick(EMPTY_ROOMS)}`, "info");
  };

  const handleKill = () => {
    const nls = ltRef.current.slain + 1;
    updRs({ slain: rsRef.current.slain + 1 });
    updLt({ slain: nls });
    if (nls >= 1) tryUnlock("first_blood");
    if (nls >= 50) tryUnlock("hunter");
    if (nls >= 200) tryUnlock("exterminator");
  };

  const doAttack = () => {
    if (!foe) return;
    let pHp = p.hp;
    const pdmg = Math.max(1, p.atk - foe.def + rand(-1, 2));
    const eHp = foe.hp - pdmg;
    alog(`⚔️ You strike ${foe.name} for ${pdmg} damage!`, "hit");
    if (eHp <= 0) {
      alog(`🎉 ${foe.name} defeated!`, "ok");
      handleKill(foe.name === "Roadside Bandit");
      if (Math.random() < 0.6) {
        const l = rollLoot(fl || 1, dng?.tier || 1, rooms);
        alog(`✨ Dropped: ${l.emoji} ${l.name} [${l.rarity}] ~${l.value}g`, "ok");
        setInv((v) => {
          const ni = [...v, l];
          if (ni.length >= 10) tryUnlock("hoarder");
          return ni;
        });
        updLt({ items: ltRef.current.items + 1 });
        if (l.rarity === "legendary") tryUnlock("legendary");
      }
      setFoe(null);
      if (afterFight === "enterDungeon") enterFloor(1, dng);
      else if (afterFight === "goShop") arriveShop(pHp);
      else setView("floorHub");
      return;
    }
    setFoe((f) => ({ ...f, hp: eHp }));
    const edmg = Math.max(1, foe.atk - p.def + rand(-1, 2));
    pHp -= edmg;
    alog(`${foe.emoji} ${foe.name} hits you for ${edmg}!`, "bad");
    if (pHp <= 0) {
      setP((x) => ({ ...x, hp: 0 }));
      alog("💀 You have been slain...", "bad");
      doDeath();
      return;
    }
    setP((x) => ({ ...x, hp: pHp }));
  };

  const usePot = () => {
    if (p.pot <= 0) return alog("No potions left!", "warn");
    const heal = Math.min(25, p.mhp - p.hp);
    setP((x) => ({ ...x, hp: Math.min(x.mhp, x.hp + 25), pot: x.pot - 1 }));
    updLt({ potions: ltRef.current.potions + 1 });
    alog(`🧪 Potion used! Healed ${heal} HP.`, "ok");
  };

  const doFlee = () => {
    if (Math.random() < 0.55) {
      alog("🏃 You fled successfully!", "info");
      setFoe(null);
      if (afterFight === "enterDungeon" || afterFight === "goShop") goShop();
      else setView("floorHub");
    } else {
      const edmg = Math.max(1, foe.atk - p.def + rand(0, 2));
      alog(`❌ Failed to flee! ${foe.emoji} hits you for ${edmg}!`, "bad");
      if (p.hp - edmg <= 0) {
        setP((x) => ({ ...x, hp: 0 }));
        alog("💀 Slain while fleeing...", "bad");
        doDeath();
        return;
      }
      setP((x) => ({ ...x, hp: x.hp - edmg }));
    }
  };

  const unlockDungeon = (d) => {
    if (p.gold < d.cost) return alog(`Need ${d.cost}g to unlock!`, "warn");
    setP((x) => ({ ...x, gold: x.gold - d.cost }));
    setUnlocked((u) => [...u, d.id]);
    alog(`🔓 Unlocked "${d.name}"!`, "ok");
  };

  const restart = () => {
    setP({ ...DEF_P });
    setInv([]);
    setDng(null);
    setFl(0);
    setRooms(0);
    setFoe(null);
    setLog([]);
    setUnlocked([1, 2]);
    setMQuote("");
    setRs({ ...DEF_RS });
    rsRef.current = { ...DEF_RS };
    updLt({ runs: ltRef.current.runs + 1 });
    goShop();
    alog("🏪 New adventure begins! Time to make some gold!", "info");
  };

  const newGame = () => {
    updLt({ runs: ltRef.current.runs + 1 });
    setP({ ...DEF_P });
    setInv([]);
    setDng(null);
    setFl(0);
    setRooms(0);
    setFoe(null);
    setLog([]);
    setUnlocked([1, 2]);
    setMQuote("");
    setRs({ ...DEF_RS });
    rsRef.current = { ...DEF_RS };
    goShop();
    alog("🏪 You arrive at the merchant's shop. Time to make some gold!", "info");
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
    setRs({ ...DEF_RS });
    setP({ ...DEF_P });
    setInv([]);
    setDng(null);
    setFl(0);
    setRooms(0);
    setFoe(null);
    setLog([]);
    setUnlocked([1, 2]);
    setView("title");
  };

  if (view === "title") {
    return (
      <TitleScreen
        toasts={toasts}
        setView={setView}
        newGame={newGame}
        goProfile={goProfile}
      />
    );
  }

  if (view === "dead") {
    return (
      <DeadScreen
        toasts={toasts}
        rs={rs}
        inv={inv}
        restart={restart}
        goProfile={goProfile}
      />
    );
  }

  if (view === "profile") {
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
    <div className="min-h-screen bg-gray-900 text-white p-3">
      <ToastLayer toasts={toasts} />
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-lg bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            🏰 Loot &amp; Liability
          </h1>
          <div className="flex items-center gap-2">
            {dng && fl > 0 && (
              <span className="text-xs text-gray-400">
                {dng.e} F{fl}/{dng.floors} · R{rooms}
              </span>
            )}
            <button
              onClick={goProfile}
              className="text-gray-500 hover:text-white text-sm cursor-pointer"
            >
              📊
            </button>
          </div>
        </div>
        <StatsBar p={p} invLength={inv.length} />
        <div className="bg-gray-800 rounded-lg p-4 min-h-72 border border-gray-700">
          {view === "shop" && (
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
          {view === "pick" && (
            <PickDungeonView
              unlocked={unlocked}
              goShop={goShop}
              startJourney={startJourney}
              unlockDungeon={unlockDungeon}
            />
          )}
          {view === "combat" && foe && (
            <CombatView foe={foe} p={p} doAttack={doAttack} usePot={usePot} doFlee={doFlee} />
          )}
          {view === "floorHub" && dng && (
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
