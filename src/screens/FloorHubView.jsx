import { Bar } from "../components/Bar.jsx";
import { Btn } from "../components/Btn.jsx";
import { DangerMeter } from "../components/DangerMeter.jsx";

/**
 * Floor hub: danger meter, HP, explore / descend / retreat / potion.
 * @param {{ dng: Object, fl: number, rooms: number, p: Object, inv: Array, enterFloor: (n: number, d: Object) => void, exploreRoom: () => void, startRetreat: (d: Object) => void, usePot: () => void }} props
 */
export function FloorHubView({
  dng,
  fl,
  rooms,
  p,
  inv,
  enterFloor,
  exploreRoom,
  startRetreat,
  usePot,
}) {
  const invTotal = inv.reduce((s, i) => s + i.value, 0);
  let hint = "Corridors stretch further ahead. There might be more to find.";
  if (rooms === 0) hint = "You descend and see passages branching off in several directions.";
  else if (p.hp < p.mhp * 0.3) hint = "You're badly wounded. Pressing on could be fatal...";
  else if (rooms >= 5) hint = "You've explored deep into this floor. The air grows heavier.";
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-bold">{dng.e} Floor {fl}/{dng.floors}</h2>
        <p className="text-gray-500 text-xs">Rooms explored: {rooms}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DangerMeter floor={fl} tier={dng.tier} roomCount={rooms} />
        <div className="max-w-xs w-full">
          <Bar cur={p.hp} max={p.mhp} label="Your HP" />
        </div>
      </div>
      <p className="text-gray-400 text-xs text-center italic">{hint}</p>
      <div className="space-y-2 max-w-xs mx-auto">
        <Btn onClick={exploreRoom} full c="bg-indigo-600 hover:bg-indigo-500">🔍 Explore a Room</Btn>
        {fl < dng.floors && (
          <Btn onClick={() => enterFloor(fl + 1, dng)} full c="bg-emerald-600 hover:bg-emerald-500">
            ⬇️ Descend to Floor {fl + 1}
          </Btn>
        )}
        <Btn onClick={() => startRetreat(dng)} full c="bg-yellow-700 hover:bg-yellow-600">
          🏃 Retreat to Shop
        </Btn>
        {p.pot > 0 && p.hp < p.mhp && (
          <Btn onClick={usePot} full c="bg-teal-600 hover:bg-teal-500">🧪 Use Potion ({p.pot})</Btn>
        )}
      </div>
      <p className="text-gray-600 text-xs text-center">📦 {inv.length} items ({invTotal}g)</p>
    </div>
  );
}
