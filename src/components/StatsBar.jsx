import { useI18n } from "../i18n/index.jsx";

/**
 * Top stats strip: HP, ATK, DEF, gold, tonics, luck, inventory count.
 * @param {{ p: { hp: number, mhp: number, atk: number, def: number, gold: number, pot: number, luck: number }, invLength: number, currentLuck: number }} props
 */
export function StatsBar({ p, invLength, currentLuck }) {
  const { t } = useI18n();
  const hpClass = p.hp < p.mhp * 0.3 ? "text-rose-300" : "";

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-xl border border-emerald-400/20 bg-slate-900/80 p-2.5 text-sm shadow-[0_0_30px_rgba(14,165,233,0.08)]">
      <span className={hpClass}>
        {t("ui.stats.hp")} {p.hp}/{p.mhp}
      </span>
      <span>
        {t("ui.stats.atk")} {p.atk}
      </span>
      <span>
        {t("ui.stats.def")} {p.def}
      </span>
      <span className="text-amber-300">
        {t("ui.stats.gold")} {p.gold}g
      </span>
      <span>
        {t("ui.stats.tonics")} x{p.pot}
      </span>
      <span className="text-emerald-300">
        {t("ui.stats.luck")} {p.luck}/{currentLuck}
      </span>
      <span>
        {t("ui.stats.cargo")} {invLength}
      </span>
    </div>
  );
}
