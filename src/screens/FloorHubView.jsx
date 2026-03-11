import { Bar } from "../components/Bar.jsx";
import { Btn } from "../components/Btn.jsx";
import { DangerMeter } from "../components/DangerMeter.jsx";
import { StoryPanel } from "../components/StoryPanel.jsx";
import { useI18n } from "../i18n/index.jsx";

/**
 * Floor hub: omens, HP, luck, story-forward room text, and room actions.
 * @param {{
 *   dng: Object,
 *   fl: number,
 *   rooms: number,
 *   p: Object,
 *   inv: Array,
 *   currentLuck: number,
 *   luckTier: { label: string },
 *   enterFloor: (n: number, d: Object) => void,
 *   exploreRoom: () => void,
 *   startRetreat: (d: Object) => void,
 *   usePot: () => void,
 *   pendingDeath?: { message: string } | null,
 *   storyEntries?: Array<{ msg: string, type: string, id?: string | number }>,
 * }} props
 */
export function FloorHubView({
  dng,
  fl,
  rooms,
  p,
  inv,
  currentLuck,
  luckTier,
  enterFloor,
  exploreRoom,
  startRetreat,
  usePot,
  pendingDeath = null,
  storyEntries = [],
}) {
  const { t } = useI18n();
  const invTotal = inv.reduce((sum, item) => sum + item.value, 0);
  const floorTradeoff =
    fl >= dng.floors
      ? "This is the bottom. The payouts are best here, and so are the ways to die."
      : "Staying high is safer. Going deeper pays better and hits harder.";
  let hint = "The corridors fork ahead, all damp stone and clover rot.";
  if (rooms === 0) hint = "You arrive to stale air, wet stone, and the promise of somebody else's fortune.";
  else if (p.hp < p.mhp * 0.3) hint = "You're one bad omen from disaster. Even lucky fools know when to worry.";
  else if (rooms >= 5) hint = "The deeper you go, the more the dungeon feels like it knows your name.";

  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-bold text-yellow-100">
            {dng.e} Floor {fl}/{dng.floors}
          </h2>
          <p className="text-xs text-slate-400">{t("ui.floorHub.roomsSearched", { count: rooms })}</p>
          <p className="mt-1 text-xs text-amber-200/80">{floorTradeoff}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <DangerMeter floor={fl} tier={dng.tier} roomCount={rooms} />
          <div className="w-full max-w-xs">
            <Bar cur={p.hp} max={p.mhp} label={t("ui.combat.yourHp")} />
          </div>
          <p className="text-xs text-emerald-300">{t("ui.floorHub.activeLuck", { luck: currentLuck, tier: luckTier.label })}</p>
        </div>
        <p className="text-center text-xs italic text-slate-400">{hint}</p>
        <StoryPanel
          entries={storyEntries}
          title={t("ui.floorHub.commentaryTitle")}
          subtitle={t("ui.floorHub.commentarySubtitle")}
          compact
        />
        {pendingDeath && (
          <div className="mx-auto max-w-sm rounded-lg border border-rose-400/50 bg-rose-950/70 px-3 py-2 text-center text-xs font-bold text-rose-100">
            {pendingDeath.message}
          </div>
        )}
        <div className="mx-auto max-w-xs space-y-2">
          <Btn onClick={exploreRoom} disabled={Boolean(pendingDeath)} full c="bg-emerald-700 hover:bg-emerald-600">
            {t("ui.floorHub.exploreRoom")}
          </Btn>
          {fl < dng.floors && (
            <Btn
              onClick={() => enterFloor(fl + 1, dng)}
              disabled={Boolean(pendingDeath)}
              full
              c="bg-cyan-700 hover:bg-cyan-600"
            >
              {t("ui.floorHub.descend", { floor: fl + 1 })}
            </Btn>
          )}
          <Btn onClick={() => startRetreat(dng)} disabled={Boolean(pendingDeath)} full c="bg-amber-700 hover:bg-amber-600">
            {t("ui.floorHub.retreat")}
          </Btn>
          {p.pot > 0 && p.hp < p.mhp && (
            <Btn onClick={usePot} disabled={Boolean(pendingDeath)} full c="bg-teal-700 hover:bg-teal-600">
              {t("ui.floorHub.drinkTonic", { count: p.pot })}
            </Btn>
          )}
        </div>
        <p className="text-center text-xs text-slate-500">{t("ui.floorHub.cargoSummary", { count: inv.length, gold: invTotal })}</p>
      </div>
    </div>
  );
}
