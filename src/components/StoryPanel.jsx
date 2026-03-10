import { LC } from "../data/Defaults.js";

/**
 * Highlight the latest story beat while keeping recent context visible.
 * @param {{
 *   entries?: Array<{ msg: string, type: string, id?: string | number }>,
 *   title?: string,
 *   subtitle?: string,
 *   compact?: boolean,
 * }} props
 */
export function StoryPanel({
  entries = [],
  title = "Current Beat",
  subtitle = "The loudest rumor in the room gets top billing.",
  compact = false,
}) {
  const recentEntries = Array.isArray(entries) ? entries.slice(-4) : [];
  const latest = recentEntries.at(-1) || null;
  const history = recentEntries.slice(0, -1).reverse();

  return (
    <div className="rounded-xl border border-emerald-300/15 bg-slate-950/80 p-3 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200/80">{title}</p>
          <p className="text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="rounded-xl border border-emerald-300/10 bg-slate-900/95 px-3 py-3">
          {latest ? (
            <p className={`leading-relaxed ${compact ? "text-sm" : "text-base"} ${LC[latest.type] || LC.normal}`}>
              {latest.msg}
            </p>
          ) : (
            <p className="text-sm text-slate-500">The room is quiet, which is never a trustworthy sign.</p>
          )}
        </div>
        {history.length > 0 && (
          <div className="space-y-1 rounded-lg border border-emerald-300/10 bg-slate-950/80 px-3 py-2">
            {history.map((entry) => (
              <p key={entry.id || entry.msg} className={`text-xs leading-snug ${LC[entry.type] || LC.normal}`}>
                {entry.msg}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
