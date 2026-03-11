import { getDanger } from "../utils/GameLogic.js";
import { useI18n } from "../i18n/index.jsx";

/**
 * Danger level meter (bars + label) for current floor.
 * @param {{ floor: number, tier: number, roomCount: number }} props
 */
export function DangerMeter({ floor, tier, roomCount }) {
  const { t } = useI18n();
  const d = getDanger(floor, tier, roomCount);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-slate-500">{t("ui.panels.dangerLabel")}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, index) => {
          let barColor = "bg-slate-700";
          if (index < d.bars) {
            if (d.bars <= 3) barColor = "bg-emerald-500";
            else if (d.bars <= 5) barColor = "bg-lime-500";
            else if (d.bars <= 7) barColor = "bg-amber-500";
            else barColor = "bg-rose-500";
          }
          return <div key={index} className={`h-3 w-2 rounded-sm ${barColor}`} />;
        })}
      </div>
      <span className={d.color}>{d.label}</span>
    </div>
  );
}
