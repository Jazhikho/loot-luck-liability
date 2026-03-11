import { useState } from "react";
import { ToastLayer } from "../components/ToastLayer.jsx";
import { Btn } from "../components/Btn.jsx";
import { ConfirmDialog } from "../components/ConfirmDialog.jsx";
import { LocaleSelector } from "../components/LocaleSelector.jsx";
import { getAchievementDefs } from "../data/Content.js";
import { useI18n } from "../i18n/index.jsx";

/**
 * Profile: stats, achievements, highscores; back and delete data.
 * @param {{ toasts: Array, prevView: string, setView: (v: string) => void, profTab: string, setProfTab: (t: string) => void, lt: Object, ach: Array, hs: Array, nukeData: () => void }} props
 */
export function ProfileScreen({
  toasts,
  prevView,
  setView,
  profTab,
  setProfTab,
  lt,
  ach,
  hs,
  nukeData,
}) {
  const { t } = useI18n();
  const [confirmReset, setConfirmReset] = useState(false);
  const achievements = getAchievementDefs();

  const statRows = [
    [t("ui.profile.statLabels.gold"), `${lt.gold}g`],
    [t("ui.profile.statLabels.slain"), lt.slain],
    [t("ui.profile.statLabels.deaths"), lt.deaths],
    [t("ui.profile.statLabels.clears"), lt.clears],
    [t("ui.profile.statLabels.rooms"), lt.rooms],
    [t("ui.profile.statLabels.items"), lt.items],
    [t("ui.profile.statLabels.potions"), lt.potions],
    [t("ui.profile.statLabels.runs"), lt.runs],
    [t("ui.profile.statLabels.bestFloor"), lt.bestFloor],
    [t("ui.profile.statLabels.bestLuck"), lt.bestLuck],
  ];

  return (
    <div className="h-screen overflow-hidden bg-slate-950 p-3 text-white">
      <ToastLayer toasts={toasts} />
      <ConfirmDialog
        open={confirmReset}
        title={t("ui.profile.deleteTitle")}
        body={t("ui.profile.deleteBody")}
        confirmLabel={t("ui.common.deleteEverything")}
        onConfirm={() => {
          setConfirmReset(false);
          nukeData();
        }}
        onCancel={() => setConfirmReset(false)}
      />
      <div className="mx-auto flex h-full max-w-2xl min-h-0 flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-300 via-yellow-100 to-amber-300 bg-clip-text text-lg font-bold text-transparent">
              {t("content.title")}
            </h1>
            <p className="text-xs text-emerald-100/70">{t("ui.profile.ledgerSubtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <LocaleSelector compact />
            <Btn onClick={() => setView(prevView)} c="bg-slate-700 hover:bg-slate-600">
              {t("ui.common.back")}
            </Btn>
          </div>
        </div>
        <div className="flex gap-1">
          {[
            ["stats", t("ui.profile.stats")],
            ["ach", t("ui.profile.achievements")],
            ["hs", t("ui.profile.highscores")],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setProfTab(key)}
              className={`flex-1 rounded-t-lg py-2 text-sm font-bold transition-colors ${
                profTab === key ? "bg-slate-800 text-white" : "bg-slate-900 text-slate-500 hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-b-lg rounded-tr-lg border border-emerald-400/20 bg-slate-900/85 p-4">
          {profTab === "stats" && (
            <div className="h-full overflow-y-auto pr-1">
              <div className="space-y-4">
                <h2 className="text-base font-bold text-yellow-100">{t("ui.profile.lifetimeTally")}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {statRows.map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-slate-800 p-3">
                      <div className="text-xs text-slate-400">{label}</div>
                      <div className="font-bold text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {profTab === "ach" && (
            <div className="h-full overflow-y-auto pr-1" data-testid="achievements-panel">
              <div className="space-y-3">
                <h2 className="text-base font-bold text-yellow-100">
                  {t("ui.profile.achievementsTitle", { count: ach.length, total: achievements.length })}
                </h2>
                <div className="h-2 w-full rounded-full bg-slate-700">
                  <div
                    className="h-2 rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${(ach.length / achievements.length) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {achievements.map((achievement) => {
                    const hasAchievement = ach.includes(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`flex items-center gap-3 rounded-lg p-3 ${
                          hasAchievement ? "bg-slate-800" : "bg-slate-950 opacity-50"
                        }`}
                      >
                        <span className="text-2xl">{hasAchievement ? achievement.e : t("ui.common.locked")}</span>
                        <div>
                          <p className={`text-sm font-bold ${hasAchievement ? "text-yellow-200" : "text-slate-400"}`}>
                            {achievement.name}
                          </p>
                          <p className="text-xs text-slate-400">{achievement.desc}</p>
                        </div>
                        {hasAchievement && <span className="ml-auto text-xs font-bold text-emerald-300">{t("ui.profile.done")}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {profTab === "hs" && (
            <div className="h-full overflow-y-auto pr-1">
              <div className="space-y-3">
                <h2 className="text-base font-bold text-yellow-100">{t("ui.profile.hallOfHauls")}</h2>
                {hs.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">{t("ui.profile.noEntries")}</p>
                ) : (
                  <div className="space-y-2">
                    {hs.map((entry, index) => (
                      <div
                        key={`${entry.date}-${index}`}
                        className={`flex items-center gap-3 rounded-lg p-3 ${
                          index === 0 ? "border border-yellow-700 bg-yellow-950/60" : "bg-slate-800"
                        }`}
                      >
                        <span className="w-8 text-center text-2xl font-bold">
                          {index === 0 ? "1" : index === 1 ? "2" : index === 2 ? "3" : `#${index + 1}`}
                        </span>
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-x-4 text-sm">
                            <span className="font-bold text-amber-300">{entry.gold}g</span>
                            <span>{t("ui.profile.slainLabel", { count: entry.slain })}</span>
                            <span>{t("ui.profile.floorLabel", { floor: entry.floor })}</span>
                            <span>{t("ui.profile.roomsLabel", { count: entry.rooms })}</span>
                          </div>
                          <p className="text-xs text-slate-500">{entry.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="mx-auto block text-xs text-slate-600 transition-colors hover:text-rose-300"
        >
          {t("ui.common.deleteAllData")}
        </button>
      </div>
    </div>
  );
}
