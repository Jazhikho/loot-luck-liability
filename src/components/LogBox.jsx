import { LC } from "../data/Defaults.js";

/**
 * Scrollable adventure log with colored entries.
 * @param {{ logRef: React.RefObject<HTMLDivElement | null>, log: Array<{ msg: string, type: string, id: number }> }} props
 */
export function LogBox({ logRef, log }) {
  return (
    <div
      ref={logRef}
      className="bg-gray-950 rounded-lg p-3 h-40 overflow-y-auto text-xs font-mono border border-gray-800"
    >
      {log.length === 0 && <span className="text-gray-600">Adventure log...</span>}
      {log.map((e) => (
        <div key={e.id} className={`${LC[e.type] || LC.normal} mb-0.5 leading-snug`}>
          {e.msg}
        </div>
      ))}
    </div>
  );
}
