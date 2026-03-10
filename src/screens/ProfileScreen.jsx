import { useState } from "react";
import { ToastLayer } from "../components/ToastLayer.jsx";
import { Btn } from "../components/Btn.jsx";
import { ConfirmDialog } from "../components/ConfirmDialog.jsx";
import { ACHDEFS } from "../data/Constants.js";

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
  const [confirmReset, setConfirmReset] = useState(false);

  const statRows = [
    ["Gold Earned", `${lt.gold}g`],
    ["Monsters Slain", lt.slain],
    ["Deaths", lt.deaths],
    ["Dungeons Cleared", lt.clears],
    ["Rooms Explored", lt.rooms],
    ["Items Found", lt.items],
    ["Potions Used", lt.potions],
    ["Runs Started", lt.runs],
    ["Deepest Floor", lt.bestFloor],
    ["Best Luck", lt.bestLuck],
  ];

  return (
    <div className="h-screen overflow-hidden bg-slate-950 p-3 text-white">
      <ToastLayer toasts={toasts} />
      <ConfirmDialog
        open={confirmReset}
        title="Delete all saved data?"
        body="This removes the current run, lifetime stats, achievements, and the hall of fame. This cannot be undone."
        confirmLabel="Delete Everything"
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
              Loot, Luck &amp; Liability
            </h1>
            <p className="text-xs text-emerald-100/70">Broker&apos;s Ledger</p>
          </div>
          <Btn onClick={() => setView(prevView)} c="bg-slate-700 hover:bg-slate-600">
            Back
          </Btn>
        </div>
        <div className="flex gap-1">
          {[["stats", "Stats"], ["ach", "Achievements"], ["hs", "Highscores"]].map(([key, label]) => (
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
              <h2 className="text-base font-bold text-yellow-100">Lifetime Tally</h2>
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
                Achievements ({ach.length}/{ACHDEFS.length})
              </h2>
              <div className="h-2 w-full rounded-full bg-slate-700">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${(ach.length / ACHDEFS.length) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                {ACHDEFS.map((achievement) => {
                  const hasAchievement = ach.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 rounded-lg p-3 ${
                        hasAchievement ? "bg-slate-800" : "bg-slate-950 opacity-50"
                      }`}
                    >
                      <span className="text-2xl">{hasAchievement ? achievement.e : "Locked"}</span>
                      <div>
                        <p className={`text-sm font-bold ${hasAchievement ? "text-yellow-200" : "text-slate-400"}`}>
                          {achievement.name}
                        </p>
                        <p className="text-xs text-slate-400">{achievement.desc}</p>
                      </div>
                      {hasAchievement && <span className="ml-auto text-xs font-bold text-emerald-300">Done</span>}
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
              <h2 className="text-base font-bold text-yellow-100">Hall of Hauls (Top 5 Runs)</h2>
              {hs.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">No entries yet. Fortune prefers a little history.</p>
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
                          <span>{entry.slain} slain</span>
                          <span>Floor {entry.floor}</span>
                          <span>{entry.rooms} rooms</span>
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
          Delete All Data
        </button>
      </div>
    </div>
  );
}
