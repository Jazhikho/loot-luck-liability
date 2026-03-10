import { LC } from "../data/Defaults.js";

/**
 * Scrollable adventure log with colored entries.
 * @param {{ logRef: React.RefObject<HTMLDivElement | null>, log: Array<{ msg: string, type: string, id: string | number }> }} props
 */
export function LogBox({ logRef, log }) {
  const latest = log.at(-1);

  return (
    <div className="rounded-xl border border-emerald-400/20 bg-slate-950/95 p-3 shadow-[0_0_30px_rgba(14,165,233,0.06)]">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200/80">Rumors &amp; Wreckage</p>
          <p className="text-[11px] text-slate-500">The running commentary on your current bad decisions.</p>
        </div>
        {latest && (
          <p className={`max-w-72 truncate text-[11px] ${LC[latest.type] || LC.normal}`}>
            Latest: {latest.msg}
          </p>
        )}
      </div>
      <div
        ref={logRef}
        className="h-28 overflow-y-auto rounded-lg border border-emerald-400/10 bg-slate-950 px-2 py-2 font-mono text-xs md:h-32"
      >
        {log.length === 0 && <span className="text-slate-600">The ledger waits for your next mistake...</span>}
        {log.map((entry) => (
          <div key={entry.id} className={`${LC[entry.type] || LC.normal} mb-0.5 leading-snug`}>
            {entry.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
