const LUCK_TIERS = [
  { key: "grounded", label: "Grounded", max: 1, absurdChance: 0 },
  { key: "fortunate", label: "Fortunate", max: 4, absurdChance: 35 },
  { key: "uncanny", label: "Uncanny", max: 7, absurdChance: 70 },
  { key: "clover-cursed", label: "Clover-Cursed", max: Number.POSITIVE_INFINITY, absurdChance: 100 },
];

function hashSeed(seed) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickVariant(seed, options) {
  return options[hashSeed(seed) % options.length];
}

function shouldGoAbsurd(luck, seed) {
  const tier = getLuckTier(luck);
  if (tier.absurdChance <= 0) return false;
  return hashSeed(`absurd:${seed}`) % 100 < tier.absurdChance;
}

export function getLuckTier(luck) {
  return LUCK_TIERS.find((tier) => luck <= tier.max) || LUCK_TIERS[LUCK_TIERS.length - 1];
}

export function decorateAttackOutcome(outcome, luck) {
  const seed = `attack:${outcome.targetName}:${outcome.damage}:${outcome.highRoll}`;
  if (outcome.highRoll && shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      message: pickVariant(seed, [
        `You slip on a lucky puddle and accidentally plant your weapon in ${outcome.targetName} for ${outcome.damage}.`,
        `You begin a total miss, trip over your own clover charm, and still crack ${outcome.targetName} for ${outcome.damage}.`,
        `A wildly unplanned stumble turns into a saint-touched wallop on ${outcome.targetName} for ${outcome.damage}.`,
      ]),
    };
  }

  return {
    ...outcome,
    message: `You strike ${outcome.targetName} for ${outcome.damage}.`,
  };
}

export function decorateEnemyAttackOutcome(outcome, luck) {
  const seed = `enemy-hit:${outcome.attackerName}:${outcome.damage}`;
  if (shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      message: pickVariant(seed, [
        `${outcome.attackerName} pelts you with a shower of bad luck for ${outcome.damage}.`,
        `${outcome.attackerName} bounces off a barrel, a wall, and your pride for ${outcome.damage}.`,
        `${outcome.attackerName} catches you mid-flinch and charges ${outcome.damage} in bruises.`,
      ]),
    };
  }

  return {
    ...outcome,
    message: `${outcome.attackerName} hits you for ${outcome.damage}.`,
  };
}

export function decorateEnemyDefeatOutcome(outcome, luck) {
  const seed = `enemy-defeat:${outcome.foeName}`;
  if (shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      message: pickVariant(seed, [
        `${outcome.foeName} folds under a catastrophic shower of lucky nonsense.`,
        `${outcome.foeName} goes down after the universe overcommits to your bit.`,
        `${outcome.foeName} is defeated when fortune decides subtlety is overrated.`,
      ]),
    };
  }

  return {
    ...outcome,
    message: `${outcome.foeName} is defeated.`,
  };
}

export function decorateDeathOutcome(outcome, luck) {
  const seed = `death:${outcome.cause}:${outcome.foeName || "none"}`;
  if (shouldGoAbsurd(luck, seed)) {
    const absurdMessage =
      outcome.cause === "trap"
        ? "You are crushed beneath an avalanche of celebratory gold. Lucky, technically."
        : outcome.cause === "flee"
          ? "You escape the fight but not the stampede of lucky chaos trampling in behind you."
          : `You win the strangest obituary in town when fortune turns violent and ${outcome.foeName || "the dungeon"} finishes the job.`;

    return {
      ...outcome,
      message: absurdMessage,
    };
  }

  return {
    ...outcome,
    message:
      outcome.cause === "trap"
        ? "The trap finishes you off."
        : outcome.cause === "flee"
          ? "Slain while fleeing."
          : "You have been slain.",
  };
}

export function decorateMonsterEncounter(outcome, luck) {
  const seed = `monster:${outcome.monster.name}:${outcome.floor}:${outcome.rooms}`;
  if (luck >= 8 && shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      encounterTitle: "Lucky Find!",
      displayName: outcome.monster.name,
      message: pickVariant(seed, [
        `Lucky you. A clover-cursed champion erupts from the mist: ${outcome.monster.name}.`,
        `You round a corner, trip over a rainbow root, and discover a "special guest" ${outcome.monster.name}.`,
        `Fortune winks, the room groans, and ${outcome.monster.name} arrives like a rare tavern horror.`,
      ]),
    };
  }

  return {
    ...outcome,
    encounterTitle: "",
    displayName: outcome.monster.name,
    message: `${outcome.monster.name} emerges from the dark.`,
  };
}

export function decorateLootOutcome(outcome, luck) {
  const seed = `loot:${outcome.source}:${outcome.item.name}:${outcome.item.rarity}`;
  if (shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      message: pickVariant(seed, [
        `A wildly inappropriate gust of fortune slaps ${outcome.item.name} into your hands.`,
        `You trip over absolutely nothing and somehow discover ${outcome.item.name}.`,
        `A clover-shaped coincidence deposits ${outcome.item.name} directly in your path.`,
      ]),
    };
  }

  const prefix =
    outcome.source === "road" ? "Found roadside loot:" : outcome.source === "drop" ? "Loot dropped:" : "Found loot:";
  return {
    ...outcome,
    message: `${prefix} ${outcome.item.name} [${outcome.item.rarity}] worth about ${outcome.item.value}g.`,
  };
}

export function decorateTravelOutcome(outcome, luck) {
  const seed = `travel:${outcome.kind}:${outcome.item?.name || "none"}`;
  if (shouldGoAbsurd(luck, seed)) {
    const absurdByKind = {
      quiet: "The road behaves so politely that it becomes unsettling.",
      potion: "A passing auntie mistakes you for destiny and hurls a potion into your pocket.",
      loss: `A pothole opens like a greedy mouth and swallows ${outcome.item?.name || "your cargo"}.`,
      none: "Nothing happens, which at this luck level feels like suspicious restraint.",
    };
    return { ...outcome, message: absurdByKind[outcome.kind] || outcome.message };
  }

  const groundedByKind = {
    quiet: "The road is quiet.",
    potion: "A traveler hands you a potion.",
    loss: `A pothole throws ${outcome.item?.name || "a cargo piece"} off the cart.`,
    none: "Nothing worth remembering happens on the road.",
  };
  return { ...outcome, message: groundedByKind[outcome.kind] || outcome.message };
}

export function decorateTrapOutcome(outcome, luck) {
  const seed = `trap:${outcome.damage}:${outcome.fatal}`;
  if (shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      message: outcome.fatal
        ? `A shower of lucky hardware, falling coin racks, and one cursed barrel flatten you for ${outcome.damage}.`
        : `A ridiculous chain of lucky debris clips you for ${outcome.damage}.`,
    };
  }

  return {
    ...outcome,
    message: `A trap springs for ${outcome.damage} damage.`,
  };
}

export function decorateEmptyRoomOutcome(outcome, luck) {
  const seed = `empty:${outcome.baseText}`;
  if (shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      message: pickVariant(seed, [
        `The room is empty except for the very loud feeling that luck just played a prank on you.`,
        `Nothing waits here but a suspicious breeze and the smug sound of fortune giggling.`,
        `The chamber is vacant, which somehow feels more theatrical than helpful.`,
      ]),
    };
  }

  return {
    ...outcome,
    message: outcome.baseText,
  };
}
