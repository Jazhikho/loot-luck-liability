import { useState } from "react";
import packageInfo from "../../package.json";
import { GAME_BLURB, GAME_TAGLINE } from "../data/Constants.js";
import { ToastLayer } from "../components/ToastLayer.jsx";
import { ConfirmDialog } from "../components/ConfirmDialog.jsx";
import { LS } from "../utils/Helpers.js";

/**
 * Title screen: continue, new game, credits, or open profile.
 * @param {{ toasts: Array, continueGame: () => void, newGame: () => void, goProfile: () => void }} props
 */
export function TitleScreen({ toasts, continueGame, newGame, goProfile }) {
  const hasSave = LS.get("ll_save", null);
  const [confirmNewGame, setConfirmNewGame] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const onNewGame = () => {
    if (!hasSave) {
      newGame();
      return;
    }
    setConfirmNewGame(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <ToastLayer toasts={toasts} />
      <ConfirmDialog
        open={confirmNewGame}
        title="Abandon the current run?"
        body="Starting a new run will replace the current in-progress expedition once the next autosave happens."
        confirmLabel="Start Fresh Run"
        onConfirm={() => {
          setConfirmNewGame(false);
          newGame();
        }}
        onCancel={() => setConfirmNewGame(false)}
        tone="bg-emerald-600 hover:bg-emerald-500"
      />
      <div className="max-w-lg rounded-2xl border border-emerald-400/20 bg-slate-900/80 p-8 text-center shadow-[0_0_60px_rgba(16,185,129,0.08)]">
        {showCredits ? (
          <div className="space-y-4 text-left">
            <div className="text-center">
              <div className="mb-4 text-7xl">🍀</div>
              <h1 className="mb-1 bg-gradient-to-r from-emerald-300 via-yellow-100 to-amber-300 bg-clip-text text-4xl font-bold text-transparent">
                Loot, Luck &amp; Liability
              </h1>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-200/70">Credits</p>
            </div>
            <div className="space-y-3 rounded-xl border border-emerald-400/15 bg-slate-950/50 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Dev</p>
                <p className="text-lg font-bold text-yellow-100">Jazhikho</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Prototype</p>
                <p className="text-sm text-slate-300">Originally prototyped with Claude Sonnet.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Development</p>
                <p className="text-sm text-slate-300">Developed using Codex (GPT 5.4).</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Version</p>
                <p className="text-sm text-slate-300">v{packageInfo.version}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                A folk-chaos loot run about cursed gold, suspicious luck, and monsters who know the engine is watching.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCredits(false)}
              className="w-full rounded-lg bg-slate-700 px-8 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600"
            >
              Back to Title
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-7xl">🍀</div>
            <h1 className="mb-1 bg-gradient-to-r from-emerald-300 via-yellow-100 to-amber-300 bg-clip-text text-4xl font-bold text-transparent">
              Loot, Luck &amp; Liability
            </h1>
            <p className="mb-2 italic text-yellow-100/80">{GAME_TAGLINE}</p>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">{GAME_BLURB}</p>
            <div className="space-y-2">
              {hasSave ? (
                <>
                  <button
                    type="button"
                    onClick={continueGame}
                    className="w-full rounded-lg bg-emerald-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-emerald-500"
                  >
                    Continue the Haul
                  </button>
                  <button
                    type="button"
                    onClick={onNewGame}
                    className="w-full rounded-lg bg-cyan-700 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-cyan-600"
                  >
                    Start a Fresh Misadventure
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onNewGame}
                  className="w-full rounded-lg bg-emerald-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-emerald-500"
                >
                  Start Adventuring
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowCredits(true)}
                className="w-full rounded-lg bg-amber-700 px-8 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Credits
              </button>
              <button
                type="button"
                onClick={goProfile}
                className="w-full rounded-lg bg-slate-700 px-8 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600"
              >
                Open the Ledger
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
