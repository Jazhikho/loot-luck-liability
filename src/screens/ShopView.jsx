import { Btn } from "../components/Btn.jsx";
import { getLootName } from "../data/Content.js";
import { RC } from "../data/Defaults.js";
import { useI18n } from "../i18n/index.jsx";

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
 *   luckBand: { key: string, label: string },
 *   nextLuckBand: { key: string, label: string, min: number } | null,
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
  luckBand,
  nextLuckBand,
  luckyItemCount,
  sellableTotal,
  lockedCount,
  weaponBonus,
  armorBonus,
}) {
  const { t } = useI18n();
  const invTotal = inv.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="space-y-4">
        <div className="text-center">
          <div className="mb-1 text-5xl">🍺</div>
          <h2 className="text-lg font-bold text-yellow-100">{t("ui.shop.heading")}</h2>
          <p className="text-sm italic text-emerald-100/70">&quot;{mQuote}&quot;</p>
          <p className="mt-2 text-xs text-slate-400">
            {t("ui.shop.luckSummary", { baseLuck: p.luck, activeLuck: currentLuck, luckyCargo: luckyItemCount })}
          </p>
          <p className="mt-1 text-xs text-emerald-200/80">
            {nextLuckBand
              ? t("ui.shop.luckBand", { band: t(`ui.luckTier.${luckBand.key}`) || luckBand.label, next: nextLuckBand.min })
              : t("ui.shop.luckBandMax", { band: t(`ui.luckTier.${luckBand.key}`) || luckBand.label })}
          </p>
        </div>
        {p.hp < p.mhp && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 px-3 py-3 text-sm text-rose-100">
            <p className="font-semibold">{t("ui.shop.hurtTitle")}</p>
            <p className="mt-1 text-xs text-rose-100/80">{t("ui.shop.hurtBody", { hp: p.hp, maxHp: p.mhp })}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Btn onClick={sellAll} disabled={sellableTotal <= 0} c="bg-amber-700 hover:bg-amber-600">
            {t("ui.shop.cashIn", { gold: sellableTotal })}
          </Btn>
          <Btn onClick={buyPot} c="bg-teal-700 hover:bg-teal-600">
            {t("ui.shop.tonic", { count: 15 })}
          </Btn>
          <Btn onClick={upgWeapon} c="bg-emerald-700 hover:bg-emerald-600">
            <span className="block">{t("ui.shop.weaponLevel", { level: p.wlv + 1 })}</span>
            <span className="text-xs text-emerald-100/80">
              {t("ui.shop.weaponBenefit", { atk: weaponBonus.atk, gold: upgCost(p.wlv) })}
            </span>
          </Btn>
          <Btn onClick={upgArmor} c="bg-cyan-700 hover:bg-cyan-600">
            <span className="block">{t("ui.shop.armorLevel", { level: p.alv + 1 })}</span>
            <span className="text-xs text-cyan-100/80">
              {t("ui.shop.armorBenefit", { def: armorBonus.def, hp: armorBonus.hp, gold: upgCost(p.alv) })}
            </span>
          </Btn>
          <Btn onClick={upgLuck} c="bg-lime-700 hover:bg-lime-600">
            {t("ui.shop.luckUpgrade", { gold: luckCost })}
          </Btn>
          <Btn onClick={restInn} disabled={p.hp >= p.mhp} c="bg-slate-700 hover:bg-slate-600">
            {t("ui.shop.hearthRest")}
          </Btn>
          <div className="col-span-2">
            <Btn onClick={openDungeonPicker} full c="bg-emerald-600 hover:bg-emerald-500">
              {t("ui.shop.chaseDark")}
            </Btn>
          </div>
        </div>
        {inv.length > 0 && (
          <div>
            <h3 className="mb-1.5 text-xs font-bold text-emerald-100/70">{t("ui.shop.cargoHold", { count: inv.length })}</h3>
            <p className="mb-2 text-[11px] text-slate-500">
              {t("ui.shop.cargoHelp")}
              {lockedCount > 0 &&
                ` ${t("ui.shop.cargoHeldSuffix", {
                  count: lockedCount,
                  suffix: lockedCount === 1 ? "" : "s",
                })}`}
            </p>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {inv.map((item) => {
                const itemName = getLootName(item.sourceId, item.name);
                return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs ${
                    item.locked ? "bg-slate-800/70 ring-1 ring-emerald-400/20" : "bg-slate-800"
                  }`}
                >
                  <span className={RC[item.rarity]}>
                    {item.emoji} {itemName}
                    {item.luck > 0 && <span className="ml-1 text-emerald-300">{t("ui.shop.luckBadge", { luck: item.luck })}</span>}
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
                      {item.locked ? t("ui.shop.held") : t("ui.shop.hold")}
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
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">{t("ui.shop.totalCargoValue", { gold: invTotal })}</p>
          </div>
        )}
      </div>
    </div>
  );
}
