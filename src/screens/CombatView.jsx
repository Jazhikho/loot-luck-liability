import { Bar } from "../components/Bar.jsx";
import { Btn } from "../components/Btn.jsx";

/**
 * Combat screen: foe HP, player HP, attack / potion / flee.
 * @param {{ foe: Object, p: Object, doAttack: () => void, usePot: () => void, doFlee: () => void }} props
 */
export function CombatView({ foe, p, doAttack, usePot, doFlee }) {
  if (!foe) return null;
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-6xl mb-1">{foe.emoji}</div>
        <h2 className="text-lg font-bold">{foe.name}</h2>
        <div className="mt-2 max-w-xs mx-auto">
          <Bar cur={foe.hp} max={foe.maxHp} label="Enemy HP" c="bg-red-500" />
        </div>
        <p className="text-xs text-gray-500 mt-1">ATK {foe.atk} · DEF {foe.def}</p>
      </div>
      <div className="max-w-xs mx-auto">
        <Bar cur={p.hp} max={p.mhp} label="Your HP" />
      </div>
      <div className="flex justify-center gap-2 flex-wrap">
        <Btn onClick={doAttack} c="bg-red-600 hover:bg-red-500">⚔️ Attack</Btn>
        <Btn onClick={usePot} disabled={p.pot <= 0}>🧪 Potion ({p.pot})</Btn>
        <Btn onClick={doFlee} c="bg-gray-600 hover:bg-gray-500">🏃 Flee</Btn>
      </div>
    </div>
  );
}
