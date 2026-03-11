import { ToastLayer } from "../components/ToastLayer.jsx";
import { useI18n } from "../i18n/index.jsx";

/**
 * Death screen with run summary and retry/profile actions.
 * @param {{ toasts: Array, rs: { earned: number, slain: number, deepest: number, rooms: number }, inv: Array, restart: () => void, goProfile: () => void }} props
 */
export function DeadScreen({ toasts, rs, inv, restart, goProfile }) {
  const { t } = useI18n();
  const lostValue = inv.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <ToastLayer toasts={toasts} />
      <div className="max-w-md rounded-2xl border border-rose-400/20 bg-slate-900/80 p-6 text-center shadow-[0_0_60px_rgba(244,63,94,0.08)]">
        <div className="mb-3 text-7xl">💀</div>
        <h1 className="mb-2 text-3xl font-bold text-rose-300">{t("ui.dead.title")}</h1>
        <p className="mb-4 text-slate-400">{t("ui.dead.blurb")}</p>
        <div className="mb-4 space-y-1 rounded-xl border border-slate-700 bg-slate-800/90 p-4 text-left text-sm">
          <p className="mb-2 text-base font-bold text-yellow-100">{t("ui.dead.summary")}</p>
          <p>
            {t("ui.dead.goldHauled")} <span className="text-amber-300">{rs.earned}g</span>
          </p>
          <p>
            {t("ui.dead.monstersSlain")} <span className="text-emerald-300">{rs.slain}</span>
          </p>
          <p>
            {t("ui.dead.deepestFloor")} <span className="text-cyan-300">{rs.deepest}</span>
          </p>
          <p>{t("ui.dead.roomsExplored")} {rs.rooms}</p>
          <p>{t("ui.dead.lostCargo", { count: inv.length, gold: lostValue })}</p>
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={restart}
            className="w-full rounded-lg bg-emerald-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-emerald-500"
          >
            {t("ui.dead.retry")}
          </button>
          <button
            type="button"
            onClick={goProfile}
            className="w-full rounded-lg bg-slate-700 px-8 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600"
          >
            {t("ui.common.openLedger")}
          </button>
        </div>
      </div>
    </div>
  );
}
