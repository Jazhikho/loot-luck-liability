/**
 * Top stats strip: HP, ATK, DEF, gold, potions, inventory count.
 * @param {{ p: { hp: number, mhp: number, atk: number, def: number, gold: number, pot: number }, invLength: number }} props
 */
export function StatsBar({ p, invLength }) {
  const hpClass = p.hp < p.mhp * 0.3 ? "text-red-400" : "";
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 p-2.5 bg-gray-800 rounded-lg text-sm border border-gray-700">
      <span className={hpClass}>❤️ {p.hp}/{p.mhp}</span>
      <span>⚔️ {p.atk}</span>
      <span>🛡️ {p.def}</span>
      <span className="text-yellow-400">💰 {p.gold}g</span>
      <span>🧪 ×{p.pot}</span>
      <span>📦 {invLength}</span>
    </div>
  );
}
