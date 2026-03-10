import { Btn } from "../components/Btn.jsx";
import { DUNGEONS } from "../data/Constants.js";

/**
 * Dungeon picker: list dungeons, start journey or unlock.
 * @param {{ unlocked: number[], goShop: () => void, startJourney: (d: Object) => void, unlockDungeon: (d: Object) => void }} props
 */
export function PickDungeonView({ unlocked, goShop, startJourney, unlockDungeon }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-yellow-100">Choose a Fortune Hunt</h2>
        <Btn onClick={goShop} c="bg-slate-700 hover:bg-slate-600">
          Back
        </Btn>
      </div>
      <div className="space-y-2">
        {DUNGEONS.map((dungeon) => {
          const unlockedDungeon = unlocked.includes(dungeon.id);
          return (
            <button
              key={dungeon.id}
              type="button"
              onClick={() => (unlockedDungeon ? startJourney(dungeon) : unlockDungeon(dungeon))}
              className={`w-full rounded-xl p-3 text-left transition-colors ${
                unlockedDungeon
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "border border-dashed border-emerald-400/30 bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">
                  {dungeon.e} {dungeon.name}
                </span>
                <span className="text-xs text-slate-400">
                  {unlockedDungeon ? `${dungeon.floors} floors` : `Unlock ${dungeon.cost}g`}
                </span>
              </div>
              <p className="text-xs text-slate-400">{dungeon.desc}</p>
              <div className="mt-0.5 text-xs text-emerald-200/70">
                Omens: {"★".repeat(dungeon.tier)}
                {"☆".repeat(3 - dungeon.tier)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
