import { LS } from "../utils/Helpers.js";
import { ToastLayer } from "../components/ToastLayer.jsx";

/**
 * Title screen: continue, new game, or open profile.
 * @param {{ toasts: Array, setView: (v: string) => void, newGame: () => void, goProfile: () => void }} props
 */
export function TitleScreen({ toasts, setView, newGame, goProfile }) {
  const hasSave = LS.get("ll_save", null);
  const onContinue = () => {
    const s = LS.get("ll_save", null);
    if (s) setView(s.view || "shop");
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <ToastLayer toasts={toasts} />
      <div className="text-center max-w-md">
        <div className="text-7xl mb-3">🏰</div>
        <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
          Loot &amp; Liability
        </h1>
        <p className="text-gray-400 mb-2 italic">&quot;Delve. Loot. Get Paid (Poorly).&quot;</p>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Work for a questionable merchant, raid dungeons, haul back artifacts. Push deeper for better loot, but know when to retreat.
        </p>
        <div className="space-y-2">
          {hasSave ? (
            <>
              <button
                onClick={onContinue}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors cursor-pointer w-full"
              >
                ▶️ Continue
              </button>
              <button
                onClick={newGame}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors cursor-pointer w-full"
              >
                🆕 New Game
              </button>
            </>
          ) : (
            <button
              onClick={newGame}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors cursor-pointer w-full"
            >
              Start Adventuring
            </button>
          )}
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
