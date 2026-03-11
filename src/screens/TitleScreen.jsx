import { useState } from "react";
import packageInfo from "../../package.json";
import { ToastLayer } from "../components/ToastLayer.jsx";
import { ConfirmDialog } from "../components/ConfirmDialog.jsx";
import { LocaleSelector } from "../components/LocaleSelector.jsx";
import { useI18n } from "../i18n/index.jsx";
import { LS } from "../utils/Helpers.js";

/**
 * Title screen: continue, new game, credits, or open profile.
 * @param {{ toasts: Array, continueGame: () => void, newGame: () => void, goProfile: () => void }} props
 */
export function TitleScreen({ toasts, continueGame, newGame, goProfile }) {
  const { t } = useI18n();
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
        title={t("ui.title.abandonRunTitle")}
        body={t("ui.title.abandonRunBody")}
        confirmLabel={t("ui.title.abandonRunConfirm")}
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
            <LocaleSelector compact />
            <div className="text-center">
              <div className="mb-4 text-7xl">🍀</div>
              <h1 className="mb-1 bg-gradient-to-r from-emerald-300 via-yellow-100 to-amber-300 bg-clip-text text-4xl font-bold text-transparent">
                {t("content.title")}
              </h1>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-200/70">{t("ui.title.creditsLabel")}</p>
            </div>
            <div className="space-y-3 rounded-xl border border-emerald-400/15 bg-slate-950/50 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">{t("ui.title.creditsDev")}</p>
                <p className="text-lg font-bold text-yellow-100">Jazhikho</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">{t("ui.title.creditsPrototype")}</p>
                <p className="text-sm text-slate-300">{t("ui.title.creditsPrototypeBody")}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">{t("ui.title.creditsDevelopment")}</p>
                <p className="text-sm text-slate-300">{t("ui.title.creditsDevelopmentBody")}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">{t("ui.title.creditsPlaytesting")}</p>
                <p className="text-sm text-slate-300">{t("ui.title.creditsPlaytestingBody")}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">{t("ui.title.creditsVersion")}</p>
                <p className="text-sm text-slate-300">v{packageInfo.version}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{t("ui.title.creditsFooter")}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCredits(false)}
              className="w-full rounded-lg bg-slate-700 px-8 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600"
            >
              {t("ui.title.backToTitle")}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <LocaleSelector compact />
            </div>
            <div className="mb-4 text-7xl">🍀</div>
            <h1 className="mb-1 bg-gradient-to-r from-emerald-300 via-yellow-100 to-amber-300 bg-clip-text text-4xl font-bold text-transparent">
              {t("content.title")}
            </h1>
            <p className="mb-2 italic text-yellow-100/80">{t("content.tagline")}</p>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">{t("content.blurb")}</p>
            <div className="space-y-2">
              {hasSave ? (
                <>
                  <button
                    type="button"
                    onClick={continueGame}
                    className="w-full rounded-lg bg-emerald-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-emerald-500"
                  >
                    {t("ui.title.continueRun")}
                  </button>
                  <button
                    type="button"
                    onClick={onNewGame}
                    className="w-full rounded-lg bg-cyan-700 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-cyan-600"
                  >
                    {t("ui.title.startFresh")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onNewGame}
                  className="w-full rounded-lg bg-emerald-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-emerald-500"
                >
                  {t("ui.title.startAdventure")}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowCredits(true)}
                className="w-full rounded-lg bg-amber-700 px-8 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                {t("ui.common.credits")}
              </button>
              <button
                type="button"
                onClick={goProfile}
                className="w-full rounded-lg bg-slate-700 px-8 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600"
              >
                {t("ui.common.openLedger")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
