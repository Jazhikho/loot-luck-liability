import { Bar } from "../components/Bar.jsx";
import { Btn } from "../components/Btn.jsx";
import { StoryPanel } from "../components/StoryPanel.jsx";
import { getMonsterName } from "../data/Content.js";
import { useI18n } from "../i18n/index.jsx";
import { canUsePotion, getCombatWarningState } from "../utils/GameLogic.js";

/**
 * Combat screen: foe HP, player HP, story-forward action panel, and controls.
 * @param {{
 *   foe: Object,
 *   p: Object,
 *   doAttack: () => void,
 *   usePot: () => void,
 *   doFlee: () => void,
 *   pendingDeath?: { message: string } | null,
 *   storyEntries?: Array<{ msg: string, type: string, id?: string | number }>,
 * }} props
 */
export function CombatView({ foe, p, doAttack, usePot, doFlee, pendingDeath = null, storyEntries = [] }) {
  const { t } = useI18n();
  if (!foe) return null;

  const canDrink = canUsePotion(p);
  const foeName = getMonsterName(foe.id, foe.displayName || foe.name);
  const warningState = getCombatWarningState(p, foe);
  const warning = warningState ? t(`ui.combatWarnings.${warningState}`) : "";
  const disabled = Boolean(pendingDeath);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="shrink-0 text-center">
        {foe.bannerLabel && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-200/90">{foe.bannerLabel}</p>
        )}
        {foe.encounterTitle && <p className="text-xs uppercase tracking-[0.25em] text-amber-300">{foe.encounterTitle}</p>}
        <div className="mb-1 text-6xl">{foe.emoji}</div>
        <h2 className="text-lg font-bold text-yellow-100">{foeName}</h2>
        {foe.cosmeticSubtitle && <p className="mt-1 text-xs text-cyan-100/80">{foe.cosmeticSubtitle}</p>}
        <div className="mx-auto mt-2 max-w-xs">
          <Bar cur={foe.hp} max={foe.maxHp} label={t("ui.combat.enemyHp")} c="bg-rose-500" />
        </div>
        <p className="mt-1 text-xs text-slate-400">{t("ui.combat.stats", { atk: foe.atk, def: foe.def })}</p>
      </div>
      <StoryPanel
        entries={storyEntries}
        title={t("ui.combat.battleChatter")}
        subtitle={t("ui.combat.battleSubtitle")}
        className="min-h-0 flex-1"
      />
      <div className="shrink-0 rounded-xl border border-cyan-400/10 bg-slate-950/70 px-4 py-3">
        <div className="mx-auto max-w-sm">
          <Bar cur={p.hp} max={p.mhp} label={t("ui.combat.yourHp")} />
        </div>
        {warning && !pendingDeath && (
          <div className="mx-auto mt-3 max-w-sm rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-center text-xs text-rose-200">
            {warning}
          </div>
        )}
        {pendingDeath && (
          <div className="mx-auto mt-3 max-w-sm rounded-lg border border-rose-400/50 bg-rose-950/70 px-3 py-2 text-center text-xs font-bold text-rose-100">
            {pendingDeath.message}
          </div>
        )}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Btn onClick={doAttack} disabled={disabled} c="bg-emerald-700 hover:bg-emerald-600" full>
            {t("ui.combat.swing")}
          </Btn>
          <Btn onClick={usePot} disabled={disabled || !canDrink} c="bg-teal-700 hover:bg-teal-600" full>
            {t("ui.combat.tonic", { count: p.pot })}
          </Btn>
          <Btn onClick={doFlee} disabled={disabled} c="bg-slate-700 hover:bg-slate-600" full>
            {t("ui.combat.bolt")}
          </Btn>
        </div>
      </div>
    </div>
  );
}
