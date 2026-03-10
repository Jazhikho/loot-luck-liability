import { canUsePotion } from "../utils/GameLogic.js";
import { Bar } from "../components/Bar.jsx";
import { Btn } from "../components/Btn.jsx";

/**
 * Combat screen: foe HP, player HP, attack / potion / flee.
 * @param {{ foe: Object, p: Object, doAttack: () => void, usePot: () => void, doFlee: () => void }} props
 */
export function CombatView({ foe, p, doAttack, usePot, doFlee }) {
  if (!foe) return null;

  const canDrink = canUsePotion(p);
  const foeName = foe.displayName || foe.name;

  return (
    <div className="space-y-4">
      <div className="text-center">
        {foe.encounterTitle && <p className="text-xs uppercase tracking-[0.25em] text-amber-300">{foe.encounterTitle}</p>}
        <div className="mb-1 text-6xl">{foe.emoji}</div>
        <h2 className="text-lg font-bold text-yellow-100">{foeName}</h2>
        <div className="mx-auto mt-2 max-w-xs">
          <Bar cur={foe.hp} max={foe.maxHp} label="Enemy HP" c="bg-rose-500" />
        </div>
        <p className="mt-1 text-xs text-slate-400">ATK {foe.atk} / DEF {foe.def}</p>
      </div>
      <div className="mx-auto max-w-xs">
        <Bar cur={p.hp} max={p.mhp} label="Your HP" />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Btn onClick={doAttack} c="bg-emerald-700 hover:bg-emerald-600">
          Swing
        </Btn>
        <Btn onClick={usePot} disabled={!canDrink} c="bg-teal-700 hover:bg-teal-600">
          Tonic ({p.pot})
        </Btn>
        <Btn onClick={doFlee} c="bg-slate-700 hover:bg-slate-600">
          Bolt
        </Btn>
      </div>
    </div>
  );
}
