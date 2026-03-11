import { LC } from "../data/Defaults.js";
import { useI18n } from "../i18n/index.jsx";

/**
 * Highlight the latest story beat while keeping recent context visible.
 * @param {{
 *   entries?: Array<{ msg: string, type: string, id?: string | number }>,
 *   title?: string,
 *   subtitle?: string,
 *   compact?: boolean,
 *   className?: string,
 * }} props
 */
export function StoryPanel({ entries = [], title, subtitle, compact = false, className = "" }) {
  const { t } = useI18n();
  const recentEntries = Array.isArray(entries) ? entries.slice(-5) : [];
  const latest = recentEntries.at(-1) || null;
  const history = recentEntries.slice(0, -1).reverse();

  return (
    <div className={`flex min-h-0 flex-col rounded-xl border border-emerald-300/15 bg-slate-950/80 p-3 shadow-[0_0_30px_rgba(245,158,11,0.08)] ${className}`.trim()}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200/80">
            {title || t("ui.panels.storyDefaultTitle")}
          </p>
          <p className="text-[11px] text-slate-500">{subtitle || t("ui.panels.storyDefaultSubtitle")}</p>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="min-h-[5.5rem] shrink-0 rounded-xl border border-emerald-300/10 bg-slate-900/95 px-3 py-3">
          {latest ? (
            <div className="max-h-32 overflow-y-auto pr-1">
              <p className={`leading-relaxed ${compact ? "text-sm" : "text-base"} ${LC[latest.type] || LC.normal}`}>
                {latest.msg}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">{t("ui.panels.storyEmpty")}</p>
          )}
        </div>
        {history.length > 0 && (
          <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-emerald-300/10 bg-slate-950/80 px-3 py-2">
            <div className="space-y-1">
              {history.map((entry) => (
                <p key={entry.id || entry.msg} className={`text-xs leading-snug ${LC[entry.type] || LC.normal}`}>
                  {entry.msg}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
