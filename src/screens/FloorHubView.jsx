import { Bar } from "../components/Bar.jsx";
import { Btn } from "../components/Btn.jsx";
import { DangerMeter } from "../components/DangerMeter.jsx";

/**
 * Floor hub: omens, HP, luck, explore / descend / retreat / potion.
 * @param {{ dng: Object, fl: number, rooms: number, p: Object, inv: Array, currentLuck: number, luckTier: { label: string }, enterFloor: (n: number, d: Object) => void, exploreRoom: () => void, startRetreat: (d: Object) => void, usePot: () => void }} props
 */
export function FloorHubView({
  dng,
  fl,
  rooms,
  p,
  inv,
  currentLuck,
  luckTier,
  enterFloor,
  exploreRoom,
  startRetreat,
  usePot,
}) {
  const invTotal = inv.reduce((sum, item) => sum + item.value, 0);
  let hint = "The corridors fork ahead, all damp stone and clover rot.";
  if (rooms === 0) hint = "You arrive to stale air, wet stone, and the promise of somebody else's fortune.";
  else if (p.hp < p.mhp * 0.3) hint = "You're one bad omen from disaster. Even lucky fools know when to worry.";
  else if (rooms >= 5) hint = "The deeper you go, the more the dungeon feels like it knows your name.";

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-bold text-yellow-100">
          {dng.e} Floor {fl}/{dng.floors}
        </h2>
        <p className="text-xs text-slate-400">Rooms searched: {rooms}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DangerMeter floor={fl} tier={dng.tier} roomCount={rooms} />
        <div className="w-full max-w-xs">
          <Bar cur={p.hp} max={p.mhp} label="Your HP" />
        </div>
        <p className="text-xs text-emerald-300">
          Active Luck: {currentLuck} ({luckTier.label})
        </p>
      </div>
      <p className="text-center text-xs italic text-slate-400">{hint}</p>
      <div className="mx-auto max-w-xs space-y-2">
        <Btn onClick={exploreRoom} full c="bg-emerald-700 hover:bg-emerald-600">
          Explore a Room
        </Btn>
        {fl < dng.floors && (
          <Btn onClick={() => enterFloor(fl + 1, dng)} full c="bg-cyan-700 hover:bg-cyan-600">
            Descend to Floor {fl + 1}
          </Btn>
        )}
        <Btn onClick={() => startRetreat(dng)} full c="bg-amber-700 hover:bg-amber-600">
          Retreat to Town
        </Btn>
        {p.pot > 0 && p.hp < p.mhp && (
          <Btn onClick={usePot} full c="bg-teal-700 hover:bg-teal-600">
            Drink Tonic ({p.pot})
          </Btn>
        )}
      </div>
      <p className="text-center text-xs text-slate-500">
        Cargo {inv.length} items worth {invTotal}g
      </p>
    </div>
  );
}
