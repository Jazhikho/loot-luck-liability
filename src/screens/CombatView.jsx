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

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mb-1 text-6xl">{foe.emoji}</div>
        <h2 className="text-lg font-bold">{foe.name}</h2>
        <div className="mx-auto mt-2 max-w-xs">
          <Bar cur={foe.hp} max={foe.maxHp} label="Enemy HP" c="bg-red-500" />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          ATK {foe.atk} / DEF {foe.def}
        </p>
      </div>
      <div className="mx-auto max-w-xs">
        <Bar cur={p.hp} max={p.mhp} label="Your HP" />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Btn onClick={doAttack} c="bg-red-600 hover:bg-red-500">
          Attack
        </Btn>
        <Btn onClick={usePot} disabled={!canDrink}>
          Potion ({p.pot})
        </Btn>
        <Btn onClick={doFlee} c="bg-gray-600 hover:bg-gray-500">
          Flee
        </Btn>
      </div>
    </div>
  );
}
