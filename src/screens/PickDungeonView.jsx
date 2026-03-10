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
        <h2 className="text-lg font-bold">🗺️ Choose a Dungeon</h2>
        <Btn onClick={goShop} c="bg-gray-600 hover:bg-gray-500">← Back</Btn>
      </div>
      <div className="space-y-2">
        {DUNGEONS.map((d) => {
          const ul = unlocked.includes(d.id);
          return (
            <button
              key={d.id}
              onClick={() => (ul ? startJourney(d) : unlockDungeon(d))}
              className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                ul ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-700 hover:bg-gray-600 border border-dashed border-gray-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{d.e} {d.name}</span>
                <span className="text-xs text-gray-400">{ul ? `${d.floors} floors` : `🔒 ${d.cost}g`}</span>
              </div>
              <p className="text-xs text-gray-400">{d.desc}</p>
              <div className="text-xs text-gray-500 mt-0.5">
                Danger: {"⭐".repeat(d.tier)}{"☆".repeat(3 - d.tier)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
