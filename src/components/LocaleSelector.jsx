import { useI18n } from "../i18n/index.jsx";
import { MANUAL_LOCALE_OPTIONS } from "../i18n/localeMetadata.js";

/**
 * Compact locale control for auto-detect or explicit language override.
 * @param {{ compact?: boolean }} props
 */
export function LocaleSelector({ compact = false }) {
  const { locale, localeSource, setLocalePreference, t } = useI18n();

  const options = [
    { id: "auto", label: t("ui.locale.auto") },
    ...MANUAL_LOCALE_OPTIONS.map((option) => ({
      id: option.id,
      label: t(option.labelKey),
    })),
  ];

  return (
    <div className={`rounded-lg border border-emerald-300/15 bg-slate-950/70 ${compact ? "px-2 py-1.5" : "px-3 py-2"}`}>
      <div className={`flex items-center gap-2 ${compact ? "flex-wrap" : "justify-between"}`}>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/70">
          {t("ui.locale.label")}
        </span>
        <div className="flex flex-wrap gap-1">
          {options.map((option) => {
            const active =
              (option.id === "auto" && localeSource === "auto") ||
              (option.id !== "auto" && localeSource === "manual" && locale === option.id);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setLocalePreference(option.id)}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                  active
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
