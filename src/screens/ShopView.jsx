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
 *   toggleLock: (id: number | string) => void,
 *   upgWeapon: () => void,
 *   upgArmor: () => void,
 *   upgLuck: () => void,
 *   buyPot: () => void,
 *   restInn: () => void,
 *   openDungeonPicker: () => void,
 *   upgCost: (lvl: number) => number,
 *   luckCost: number,
 *   currentLuck: number,
 *   luckyItemCount: number,
 *   sellableTotal: number,
 *   lockedCount: number,
 *   weaponBonus: { atk: number },
 *   armorBonus: { def: number, hp: number },
 * }} props
 */
export function ShopView({
  p,
  inv,
  mQuote,
  sellAll,
  sellOne,
  toggleLock,
  upgWeapon,
  upgArmor,
  upgLuck,
  buyPot,
  restInn,
  openDungeonPicker,
  upgCost,
  luckCost,
  currentLuck,
  luckyItemCount,
  sellableTotal,
  lockedCount,
  weaponBonus,
  armorBonus,
}) {
  const invTotal = inv.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="space-y-4">
        <div className="text-center">
          <div className="mb-1 text-5xl">🍺</div>
          <h2 className="text-lg font-bold text-yellow-100">The Broker's Snug</h2>
          <p className="text-sm italic text-emerald-100/70">&quot;{mQuote}&quot;</p>
          <p className="mt-2 text-xs text-slate-400">
            Base Luck {p.luck}. Active Luck {currentLuck}. Lucky cargo in hand: {luckyItemCount}.
          </p>
        </div>
        {p.hp < p.mhp && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 px-3 py-3 text-sm text-rose-100">
            <p className="font-semibold">You are still hurt.</p>
            <p className="mt-1 text-xs text-rose-100/80">
              HP {p.hp}/{p.mhp}. If you leave town like this, the Green Dark gets first swing. Hearth Rest restores you
              to full before the next dive.
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Btn onClick={sellAll} disabled={sellableTotal <= 0} c="bg-amber-700 hover:bg-amber-600">
            Cash In ({sellableTotal}g)
          </Btn>
          <Btn onClick={buyPot} c="bg-teal-700 hover:bg-teal-600">
            Tonic (15g)
          </Btn>
          <Btn onClick={upgWeapon} c="bg-emerald-700 hover:bg-emerald-600">
            <span className="block">Weapon Lv{p.wlv + 1}</span>
            <span className="text-xs text-emerald-100/80">+{weaponBonus.atk} ATK • {upgCost(p.wlv)}g</span>
          </Btn>
          <Btn onClick={upgArmor} c="bg-cyan-700 hover:bg-cyan-600">
            <span className="block">Armor Lv{p.alv + 1}</span>
            <span className="text-xs text-cyan-100/80">
              +{armorBonus.def} DEF / +{armorBonus.hp} HP • {upgCost(p.alv)}g
            </span>
          </Btn>
          <Btn onClick={upgLuck} c="bg-lime-700 hover:bg-lime-600">
            Luck +1 ({luckCost}g)
          </Btn>
          <Btn onClick={restInn} disabled={p.hp >= p.mhp} c="bg-slate-700 hover:bg-slate-600">
            Hearth Rest to Full (10g)
          </Btn>
          <div className="col-span-2">
            <Btn onClick={openDungeonPicker} full c="bg-emerald-600 hover:bg-emerald-500">
              Chase the Green Dark
            </Btn>
          </div>
        </div>
        {inv.length > 0 && (
          <div>
            <h3 className="mb-1.5 text-xs font-bold text-emerald-100/70">CARGO HOLD ({inv.length})</h3>
            <p className="mb-2 text-[11px] text-slate-500">
              Locked cargo stay off the sales bar. Only shamrock-marked cargo affect luck; the rest are pure resale.
              {lockedCount > 0 && ` ${lockedCount} item${lockedCount === 1 ? "" : "s"} currently held back.`}
            </p>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {inv.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs ${
                    item.locked ? "bg-slate-800/70 ring-1 ring-emerald-400/20" : "bg-slate-800"
                  }`}
                >
                  <span className={RC[item.rarity]}>
                    {item.emoji} {item.name}
                    {item.luck > 0 && <span className="ml-1 text-emerald-300">Luck +{item.luck}</span>}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleLock(item.id)}
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                        item.locked
                          ? "bg-emerald-800 text-emerald-100 hover:bg-emerald-700"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                    >
                      {item.locked ? "Held" : "Hold"}
                    </button>
                    <button
                      type="button"
                      onClick={() => sellOne(item.id)}
                      className="flex-shrink-0 rounded bg-amber-700 px-2 py-0.5 text-xs hover:bg-amber-600"
                    >
                      {item.value}g
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Total cargo value: {invTotal}g</p>
          </div>
        )}
      </div>
    </div>
  );
}
