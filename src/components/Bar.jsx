/**
 * Progress bar for HP or similar stats.
 * @param {{ cur: number, max: number, label: string, c?: string }} props
 */
export function Bar({ cur, max, label, c = "bg-green-500" }) {
  const pct = Math.max(0, (cur / max) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-0.5">
        <span>{label}</span>
        <span>{cur}/{max}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className={`${c} rounded-full h-2.5 transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
