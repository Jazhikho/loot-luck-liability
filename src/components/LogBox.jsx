import { LC } from "../data/Defaults.js";

/**
 * Scrollable adventure log with colored entries.
 * @param {{ logRef: React.RefObject<HTMLDivElement | null>, log: Array<{ msg: string, type: string, id: string | number }> }} props
 */
export function LogBox({ logRef, log }) {
  return (
    <div ref={logRef} className="h-40 overflow-y-auto rounded-xl border border-emerald-400/15 bg-slate-950 p-3 font-mono text-xs">
      {log.length === 0 && <span className="text-slate-600">The ledger waits for your next mistake...</span>}
      {log.map((entry) => (
        <div key={entry.id} className={`${LC[entry.type] || LC.normal} mb-0.5 leading-snug`}>
          {entry.msg}
        </div>
      ))}
    </div>
  );
}
