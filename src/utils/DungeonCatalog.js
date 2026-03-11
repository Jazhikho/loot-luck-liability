import { DUNGEONS } from "../data/Constants.js";
import { localizeDungeon } from "../data/Content.js";
import { getLocale } from "../i18n/index.jsx";

export const GENERATED_DUNGEON_ID_START = 1000;
export const MAX_GENERATED_DUNGEONS = 12;
const GENERATED_DISCOVERY_UNLOCK_THRESHOLD = 4;

const GENERATED_EMOJIS = ["🍀", "🪙", "🕯️", "🌈", "🍺", "🧾", "🔔", "🪵", "🪦", "🔥"];
const GENERATED_COPY = {
  en: {
    prefixes: ["Crooked", "Moonlit", "Shamrock", "Whistling", "Kegbound", "Bogglass", "Lantern-Lit", "Clover-Cursed", "Staggering", "Gold-Drenched"],
    places: ["Vault", "Warren", "Stair", "Cellars", "Crypt", "Crossroads", "Storehouse", "Catacombs", "Brewhall", "Hollow"],
    suffixes: ["Last Orders", "Bent Rainbows", "Kindly Debt", "Coin Weather", "Second Chances", "Miscounted Blessings", "Bad Bargains", "The Green Moon", "Unpaid Toasts", "Foolish Omens"],
    descriptors: [
      "Locals swear the treasure here is honest, which is how you know it isn't.",
      "Each chamber smells of wet gold, old ale, and a promise nobody remembers making.",
      "The broker calls it a fresh lead. The broker also lies recreationally.",
      "Every wall hums like a pub tune that has forgotten the right ending.",
      "Maps refuse to stay accurate for more than one floor at a time.",
      "Something inside keeps applauding bad decisions.",
    ],
    formatName(index) {
      return `The ${pickSeeded(this.prefixes, index, "prefix")} ${pickSeeded(this.places, index, "place")} of ${pickSeeded(this.suffixes, index, "suffix")}`;
    },
  },
  es: {
    prefixes: ["Torcida", "Lunar", "del Trébol", "Silbante", "del Barril", "de Vidrio de Pantano", "de Faroles", "Maldita por el Trébol", "Tambaleante", "Empapada en Oro"],
    places: ["Bóveda", "Madriguera", "Escalera", "Bodegas", "Cripta", "Encrucijada", "Almacén", "Catacumbas", "Sala de Cerveza", "Hondonada"],
    suffixes: ["Últimas Órdenes", "Arcoíris Torcidos", "Deuda Amable", "Clima de Monedas", "Segundas Oportunidades", "Bendiciones Mal Contadas", "Malos Tratos", "la Luna Verde", "Brindis Impagos", "Presagios Insensatos"],
    descriptors: [
      "Los vecinos juran que aquí el tesoro es honrado, y por eso mismo nadie se lo cree.",
      "Cada cámara huele a oro mojado, cerveza vieja y promesas que nadie recuerda haber hecho.",
      "El corredor lo llama una pista nueva. El corredor también miente por deporte.",
      "Todas las paredes tararean como una canción de taberna que olvidó el final correcto.",
      "Los mapas se niegan a seguir siendo exactos durante más de un piso.",
      "Algo dentro sigue aplaudiendo las malas decisiones.",
    ],
    formatName(index) {
      return `${pickSeeded(this.places, index, "place")} ${pickSeeded(this.prefixes, index, "prefix")} de ${pickSeeded(this.suffixes, index, "suffix")}`;
    },
  },
};

function getGeneratedCopy() {
  return GENERATED_COPY[getLocale()] || GENERATED_COPY.en;
}

function seededValue(index, salt) {
  const source = `${index}:${salt}`;
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 33 + source.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickSeeded(options, index, salt) {
  return options[seededValue(index, salt) % options.length];
}

export function getGeneratedDungeonCount(unlocked) {
  const unlockedCount = Array.isArray(unlocked) ? unlocked.length : 0;
  if (unlockedCount < GENERATED_DISCOVERY_UNLOCK_THRESHOLD) return 0;
  return Math.min(MAX_GENERATED_DUNGEONS, unlockedCount - GENERATED_DISCOVERY_UNLOCK_THRESHOLD + 1);
}

export function generateDungeon(index) {
  const copy = getGeneratedCopy();
  const tier = index <= 2 ? 2 : 3;
  const floors = Math.min(8, tier === 2 ? 5 + (seededValue(index, "floors") % 2) : 6 + (seededValue(index, "floors") % 3));
  const baseCost = tier === 2 ? 240 : 460;
  return {
    id: GENERATED_DUNGEON_ID_START + index,
    generated: true,
    tier,
    floors,
    cost: baseCost + index * (tier === 2 ? 90 : 140),
    e: pickSeeded(GENERATED_EMOJIS, index, "emoji"),
    name: copy.formatName(index),
    desc: pickSeeded(copy.descriptors, index, "desc"),
  };
}

export function getDungeonCatalog(unlocked = [1, 2]) {
  const generatedCount = getGeneratedDungeonCount(unlocked);
  return [
    ...DUNGEONS.map(localizeDungeon),
    ...Array.from({ length: generatedCount }, (_, offset) => generateDungeon(offset + 1)),
  ];
}

export function getNewlyDiscoveredDungeons(previousUnlocked = [1, 2], nextUnlocked = [1, 2]) {
  const previousIds = new Set(getDungeonCatalog(previousUnlocked).map((dungeon) => dungeon.id));
  return getDungeonCatalog(nextUnlocked).filter((dungeon) => !previousIds.has(dungeon.id));
}

export function isKnownDungeonId(id) {
  return DUNGEONS.some((dungeon) => dungeon.id === id) || (Number.isInteger(id) && id > GENERATED_DUNGEON_ID_START && id <= GENERATED_DUNGEON_ID_START + MAX_GENERATED_DUNGEONS);
}
