import { Btn } from "../components/Btn.jsx";
import { RC } from "../data/Defaults.js";

/**
 * Merchant shop: sell all/one, buy potion, upgrades, inn, go to dungeon.
 * @param {{ p: Object, inv: Array, mQuote: string, sellAll: () => void, sellOne: (id: number) => void, upgWeapon: () => void, upgArmor: () => void, buyPot: () => void, restInn: () => void, setView: (v: string) => void, upgCost: (lvl: number) => number }} props
 */
export function ShopView({
  p,
  inv,
  mQuote,
  sellAll,
  sellOne,
  upgWeapon,
  upgArmor,
  buyPot,
  restInn,
  setView,
  upgCost,
}) {
  const invTotal = inv.reduce((s, i) => s + i.value, 0);
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-5xl mb-1">🧔</div>
        <h2 className="text-lg font-bold">The Merchant&apos;s Shop</h2>
        <p className="text-gray-400 italic text-sm">&quot;{mQuote}&quot;</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Btn onClick={sellAll} disabled={!inv.length}>
          💰 Sell All ({invTotal}g)
        </Btn>
        <Btn onClick={buyPot}>🧪 Potion (15g)</Btn>
        <Btn onClick={upgWeapon}>⚔️ Wpn Lv{p.wlv + 1} ({upgCost(p.wlv)}g)</Btn>
        <Btn onClick={upgArmor}>🛡️ Arm Lv{p.alv + 1} ({upgCost(p.alv)}g)</Btn>
        <Btn onClick={restInn} disabled={p.hp >= p.mhp}>🛏️ Inn (10g)</Btn>
        <Btn onClick={() => setView("pick")} c="bg-emerald-600 hover:bg-emerald-500">🗺️ Dungeon</Btn>
      </div>
      {inv.length > 0 && (
        <div>
          <h3 className="font-bold text-xs mb-1.5 text-gray-400">📦 INVENTORY ({inv.length})</h3>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {inv.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-700 rounded px-2 py-1.5 text-xs"
              >
                <span className={RC[item.rarity]}>{item.emoji} {item.name}</span>
                <button
                  onClick={() => sellOne(item.id)}
                  className="bg-yellow-700 hover:bg-yellow-600 px-2 py-0.5 rounded text-xs ml-2 flex-shrink-0 cursor-pointer"
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
