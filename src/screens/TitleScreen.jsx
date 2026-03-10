import { useState } from "react";
import { LS } from "../utils/Helpers.js";
import { ToastLayer } from "../components/ToastLayer.jsx";
import { ConfirmDialog } from "../components/ConfirmDialog.jsx";

/**
 * Title screen: continue, new game, or open profile.
 * @param {{ toasts: Array, continueGame: () => void, newGame: () => void, goProfile: () => void }} props
 */
export function TitleScreen({ toasts, continueGame, newGame, goProfile }) {
  const hasSave = LS.get("ll_save", null);
  const [confirmNewGame, setConfirmNewGame] = useState(false);

  const onNewGame = () => {
    if (!hasSave) {
      newGame();
      return;
    }
    setConfirmNewGame(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4 text-white">
      <ToastLayer toasts={toasts} />
      <ConfirmDialog
        open={confirmNewGame}
        title="Replace the current run?"
        body="Starting a new game will overwrite the current in-progress run once the next autosave happens."
        confirmLabel="Start New Run"
        onConfirm={() => {
          setConfirmNewGame(false);
          newGame();
        }}
        onCancel={() => setConfirmNewGame(false)}
        tone="bg-indigo-600 hover:bg-indigo-500"
      />
      <div className="max-w-md text-center">
        <div className="mb-3 text-7xl">🏰</div>
        <h1 className="mb-1 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-4xl font-bold text-transparent">
          Loot &amp; Liability
        </h1>
        <p className="mb-2 italic text-gray-400">&quot;Delve. Loot. Get Paid (Poorly).&quot;</p>
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          Work for a questionable merchant, raid dungeons, haul back artifacts. Push deeper for better loot, but know
          when to retreat.
        </p>
        <div className="space-y-2">
          {hasSave ? (
            <>
              <button
                type="button"
                onClick={continueGame}
                className="w-full rounded-lg bg-emerald-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-emerald-500"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={onNewGame}
                className="w-full rounded-lg bg-indigo-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-indigo-500"
              >
                New Game
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onNewGame}
              className="w-full rounded-lg bg-indigo-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-indigo-500"
            >
              Start Adventuring
            </button>
          )}
          <button
            type="button"
            onClick={goProfile}
            className="w-full rounded-lg bg-gray-700 px-8 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-600"
          >
            Stats &amp; Achievements
          </button>
        </div>
      </div>
    </div>
  );
}
