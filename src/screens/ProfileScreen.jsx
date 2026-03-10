import { ToastLayer } from "../components/ToastLayer.jsx";
import { Btn } from "../components/Btn.jsx";
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
  const statRows = [
    ["💰", "Gold Earned", `${lt.gold}g"],
    ["👹", "Monsters Slain", lt.slain],
    ["💀", "Deaths", lt.deaths],
    ["🏆", "Dungeons Cleared", lt.clears],
    ["🚪", "Rooms Explored", lt.rooms],
    ["📦", "Items Found", lt.items],
    ["🧪", "Potions Used", lt.potions],
    ["🎮", "Runs Started", lt.runs],
    ["⬇️", "Deepest Floor", lt.bestFloor],
  ];
  return (
    <div className="min-h-screen bg-gray-900 text-white p-3">
      <ToastLayer toasts={toasts} />
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-lg bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            🏰 Loot &amp; Liability
          </h1>
          <Btn onClick={() => setView(prevView)} c="bg-gray-600 hover:bg-gray-500">← Back</Btn>
        </div>
        <div className="flex gap-1">
          {[["stats", "📊 Stats"], ["ach", "🏅 Achievements"], ["hs", "🏆 Highscores"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setProfTab(k)}
              className={`flex-1 py-2 rounded-t-lg text-sm font-bold transition-colors cursor-pointer ${
                profTab === k ? "bg-gray-800 text-white" : "bg-gray-900 text-gray-500 hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="bg-gray-800 rounded-b-lg rounded-tr-lg p-4 border border-gray-700 min-h-96">
          {profTab === "stats" && (
            <div className="space-y-4">
              <h2 className="font-bold text-base">📊 Lifetime Statistics</h2>
              <div className="grid grid-cols-2 gap-3">
                {statRows.map(([e, label, val]) => (
                  <div key={label} className="bg-gray-700 rounded-lg p-3">
                    <div className="text-lg">{e}</div>
                    <div className="text-xs text-gray-400">{label}</div>
                    <div className="font-bold text-white">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {profTab === "ach" && (
            <div className="space-y-3">
              <h2 className="font-bold text-base">🏅 Achievements ({ach.length}/{ACHDEFS.length})</h2>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 rounded-full h-2 transition-all"
                  style={{ width: `${(ach.length / ACHDEFS.length) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                {ACHDEFS.map((a) => {
                  const has = ach.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${has ? "bg-gray-700" : "bg-gray-900 opacity-50"}`}
                    >
                      <span className="text-2xl">{has ? a.e : "🔒"}</span>
                      <div>
                        <p className={`font-bold text-sm ${has ? "text-yellow-300" : "text-gray-400"}`}>{a.name}</p>
                        <p className="text-xs text-gray-400">{a.desc}</p>
                      </div>
                      {has && <span className="ml-auto text-green-400 text-xs font-bold">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {profTab === "hs" && (
            <div className="space-y-3">
              <h2 className="font-bold text-base">🏆 Hall of Fame (Top 5 Runs)</h2>
              {hs.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No runs recorded yet. Get out there and die gloriously!
                </p>
              ) : (
                <div className="space-y-2">
                  {hs.map((h, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        i === 0 ? "bg-yellow-900 border border-yellow-700" : "bg-gray-700"
                      }`}
                    >
                      <span className="text-2xl font-bold w-8 text-center">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-x-4 text-sm">
                          <span className="text-yellow-400 font-bold">💰 {h.gold}g</span>
                          <span>👹 {h.slain} slain</span>
                          <span>⬇️ Floor {h.floor}</span>
                          <span>🚪 {h.rooms} rooms</span>
                        </div>
                        <p className="text-xs text-gray-500">{h.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={nukeData}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors cursor-pointer mx-auto block"
        >
          🗑️ Delete All Data
        </button>
      </div>
    </div>
  );
}
