import { Btn } from "../components/Btn.jsx";
import { RC } from "../data/Defaults.js";

/**
 * Broker's snug: sell cargo, buy supplies, run upgrades, and head out.
 * @param {{
 *   p: Object,
 *   inv: Array,
 *   mQuote: string,
 *   sellAll: () => void,
 *   sellOne: (id: number | string) => void,
 *   upgWeapon: () => void,
 *   upgArmor: () => void,
 *   upgLuck: () => void,
 *   buyPot: () => void,
 *   restInn: () => void,
 *   setView: (v: string) => void,
 *   upgCost: (lvl: number) => number,
 *   luckCost: number,
 *   currentLuck: number,
 *   luckyItemCount: number,
 * }} props
 */
export function ShopView({
  p,
  inv,
  mQuote,
  sellAll,
  sellOne,
  upgWeapon,
  upgArmor,
  upgLuck,
  buyPot,
  restInn,
  setView,
  upgCost,
  luckCost,
  currentLuck,
  luckyItemCount,
}) {
  const invTotal = inv.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mb-1 text-5xl">🍺</div>
        <h2 className="text-lg font-bold text-yellow-100">The Broker's Snug</h2>
        <p className="text-sm italic text-emerald-100/70">&quot;{mQuote}&quot;</p>
        <p className="mt-2 text-xs text-slate-400">
          Base Luck {p.luck}. Active Luck {currentLuck}. Lucky cargo in hand: {luckyItemCount}.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Btn onClick={sellAll} disabled={!inv.length} c="bg-amber-700 hover:bg-amber-600">
          Cash In ({invTotal}g)
        </Btn>
        <Btn onClick={buyPot} c="bg-teal-700 hover:bg-teal-600">
          Tonic (15g)
        </Btn>
        <Btn onClick={upgWeapon} c="bg-emerald-700 hover:bg-emerald-600">
          Weapon Lv{p.wlv + 1} ({upgCost(p.wlv)}g)
        </Btn>
        <Btn onClick={upgArmor} c="bg-cyan-700 hover:bg-cyan-600">
          Armor Lv{p.alv + 1} ({upgCost(p.alv)}g)
        </Btn>
        <Btn onClick={upgLuck} c="bg-lime-700 hover:bg-lime-600">
          Luck +1 ({luckCost}g)
        </Btn>
        <Btn onClick={restInn} disabled={p.hp >= p.mhp} c="bg-slate-700 hover:bg-slate-600">
          Hearth Rest (10g)
        </Btn>
        <div className="col-span-2">
          <Btn onClick={() => setView("pick")} full c="bg-emerald-600 hover:bg-emerald-500">
            Chase the Green Dark
          </Btn>
        </div>
      </div>
      {inv.length > 0 && (
        <div>
          <h3 className="mb-1.5 text-xs font-bold text-emerald-100/70">CARGO HOLD ({inv.length})</h3>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {inv.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-slate-800 px-2 py-1.5 text-xs">
                <span className={RC[item.rarity]}>
                  {item.emoji} {item.name}
                  {item.luck > 0 && <span className="ml-1 text-emerald-300">Luck +{item.luck}</span>}
                </span>
                <button
                  type="button"
                  onClick={() => sellOne(item.id)}
                  className="ml-2 flex-shrink-0 rounded bg-amber-700 px-2 py-0.5 text-xs hover:bg-amber-600"
                >
                  {item.value}g
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
