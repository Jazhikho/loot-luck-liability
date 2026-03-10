import { getDanger } from "../utils/GameLogic.js";

/**
 * Danger level meter (bars + label) for current floor.
 * @param {{ floor: number, tier: number, roomCount: number }} props
 */
export function DangerMeter({ floor, tier, roomCount }) {
  const d = getDanger(floor, tier, roomCount);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500">Danger:</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => {
          let barColor = "bg-gray-700";
          if (i < d.bars) {
            if (d.bars <= 3) barColor = "bg-green-500";
            else if (d.bars <= 5) barColor = "bg-yellow-500";
            else if (d.bars <= 7) barColor = "bg-orange-500";
            else barColor = "bg-red-500";
          }
          return (
            <div key={i} className={`w-2 h-3 rounded-sm ${barColor}`} />
          );
        })}
      </div>
      <span className={d.color}>{d.label}</span>
    </div>
  );
}
