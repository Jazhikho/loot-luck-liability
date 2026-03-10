import { ToastLayer } from "../components/ToastLayer.jsx";

/**
 * Death screen with run summary and try again / profile.
 * @param {{ toasts: Array, rs: { earned: number, slain: number, deepest: number, rooms: number }, inv: Array, restart: () => void, goProfile: () => void }} props
 */
export function DeadScreen({ toasts, rs, inv, restart, goProfile }) {
  const lostValue = inv.reduce((s, i) => s + i.value, 0);
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <ToastLayer toasts={toasts} />
      <div className="text-center max-w-md">
        <div className="text-7xl mb-3">💀</div>
        <h1 className="text-3xl font-bold mb-2 text-red-400">You Died!</h1>
        <p className="text-gray-400 mb-4">
          The merchant sighs heavily and starts writing yet another job listing...
        </p>
        <div className="bg-gray-800 rounded-lg p-4 mb-4 text-left text-sm space-y-1 border border-gray-700">
          <p className="font-bold text-base mb-2">📊 Run Summary</p>
          <p>💰 Gold Earned: <span className="text-yellow-400">{rs.earned}g</span></p>
          <p>👹 Monsters Slain: <span className="text-orange-400">{rs.slain}</span></p>
          <p>⬇️ Deepest Floor: <span className="text-blue-400">{rs.deepest}</span></p>
          <p>🚪 Rooms Explored: {rs.rooms}</p>
          <p>📦 Loot Lost: {inv.length} items ({lostValue}g)</p>
        </div>
        <div className="space-y-2">
          <button
            onClick={restart}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors cursor-pointer w-full"
          >
            Try Again
          </button>
          <button
            onClick={goProfile}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer w-full"
          >
            📊 Stats &amp; Achievements
          </button>
        </div>
      </div>
    </div>
  );
}
