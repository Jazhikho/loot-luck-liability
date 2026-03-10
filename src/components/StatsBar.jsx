/**
 * Top stats strip: HP, ATK, DEF, gold, tonics, luck, inventory count.
 * @param {{ p: { hp: number, mhp: number, atk: number, def: number, gold: number, pot: number, luck: number }, invLength: number, currentLuck: number }} props
 */
export function StatsBar({ p, invLength, currentLuck }) {
  const hpClass = p.hp < p.mhp * 0.3 ? "text-rose-300" : "";

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-xl border border-emerald-400/20 bg-slate-900/80 p-2.5 text-sm shadow-[0_0_30px_rgba(14,165,233,0.08)]">
      <span className={hpClass}>HP {p.hp}/{p.mhp}</span>
      <span>ATK {p.atk}</span>
      <span>DEF {p.def}</span>
      <span className="text-amber-300">Gold {p.gold}g</span>
      <span>Tonics x{p.pot}</span>
      <span className="text-emerald-300">Luck {p.luck}/{currentLuck}</span>
      <span>Cargo {invLength}</span>
    </div>
  );
}
