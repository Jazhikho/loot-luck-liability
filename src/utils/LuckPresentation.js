const LUCK_TIERS = [
  { key: "grounded", label: "Grounded", max: 1, absurdChance: 0 },
  { key: "fortunate", label: "Fortunate", max: 4, absurdChance: 35 },
  { key: "uncanny", label: "Uncanny", max: 7, absurdChance: 70 },
  { key: "clover-cursed", label: "Clover-Cursed", max: Number.POSITIVE_INFINITY, absurdChance: 100 },
];

const BASE_ENCOUNTER_QUOTES = [
  "Pay the toll or become the lesson.",
  "I've already spent your gold in my head.",
  "Stand still. I fight better against surprised bookkeeping.",
  "Lovely weather for a regrettable ambush.",
  "Try not to bleed on the valuables. They're rented.",
  "You smell like optimism and terrible planning.",
  "I was promised an easy traveler, not a situation.",
  "Nobody told me the prey would arrive armed and judgmental.",
  "I practiced that entrance all afternoon. Respect the craft.",
  "Let's keep this professional, by which I mean loud and unfair.",
];

const META_ENCOUNTER_QUOTES = [
  "Did the Dev really spawn you here with that loadout?",
  "I can hear the RNG rattling in the walls already.",
  "This seed was supposed to go my way. I checked.",
  "If this is another difficulty spike, I'm writing patch notes in blood.",
  "You look like the sort of player who saves before bad ideas.",
  "I know a scripted encounter when I see one, and I resent it.",
  "Fantastic. The Dev gave you plot armor and gave me attitude.",
  "The algorithm loves you and I find that deeply unprofessional.",
];

const BASE_HURT_QUOTES = [
  "Oi! That's an organ!",
  "That was supposed to miss. We rehearsed this.",
  "You can't just stab a working professional.",
  "I demand a rematch with less humiliation.",
  "That was my favorite rib. Emotionally, if not structurally.",
  "I felt that in several future regrets.",
  "That's not combat, that's targeted embarrassment.",
  "Could you at least pretend this is difficult?",
  "I object to being turned into a cautionary tale.",
  "You swing like a tax audit in boots.",
];

const META_HURT_QUOTES = [
  "That hitbox is a slander campaign.",
  "The RNG sold me out in broad daylight.",
  "I'm reporting that crit directly to the Dev.",
  "You can't just frame-perfect my dignity offscreen.",
  "Was that in the patch notes, or are you freelancing?",
  "This seed has become hostile to labor.",
  "I demand a balance pass and several apologies.",
  "I should have alt-tabbed before that landed.",
];

const BASE_ATTACK_QUOTES = [
  "Hold still, you're making this assault look amateur.",
  "The union says I get one cheap shot per traveler.",
  "This is why nobody trusts lucky people.",
  "Consider this a very personal toll.",
  "Try flinching in a more profitable direction.",
  "If you dodge, I will take it as disrespect.",
  "This one's for every cartwheel of yours I had to watch.",
  "I'm charging extra for dramatic contact.",
  "Don't take this personally. Do take it physically.",
  "You're about to lose an argument with blunt force.",
];

const META_ATTACK_QUOTES = [
  "The RNG says it's my turn now. Legally binding.",
  "Watch this, the Dev finally remembered my attack animation.",
  "I'm cashing in the pity roll the engine owes me.",
  "If this whiffs, blame procedural comedy.",
  "The seed says yes, the frame data says maybe.",
  "I was background flavor ten seconds ago. Now look at me.",
  "This is what happens when the encounter table gets ambitious.",
  "Let's see if your protagonist privileges cover dental.",
];

const BASE_DEFEAT_QUOTES = [
  "Tell the broker this settles nothing...",
  "I knew I should've mugged a priest instead.",
  "This is embarrassingly on brand for my week.",
  "I've had better shifts. Marginally.",
  "Tell the afterlife I was carrying the team.",
  "I leave this encounter with no gold and several opinions.",
  "This feels like the kind of loss people laugh at in taverns.",
  "Bury me with my dignity if you can still locate it.",
  "Next time I'm ambushing someone with worse reflexes.",
];

const META_DEFEAT_QUOTES = [
  "I'm taking this up with the Dev.",
  "Tell the RNG I said this seed is fraudulent.",
  "Wonderful. I die, you win, and the patch notes call it flavor.",
  "I'm filing a bug report titled 'player keeps being rude with damage.'",
  "The Dev overtuned your nonsense and undertuned my union protections.",
  "This encounter was rigged from the loading screen.",
  "I hope the analytics show how unfair this felt.",
  "If anyone asks, I lost to a balancing issue, not you.",
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

function pickDialogue(name, basePool, metaPool, salt, luck) {
  const tier = getLuckTier(luck).key;
  if (tier === "clover-cursed") return pickVariant(`${salt}:meta:${name}`, metaPool);

  const metaRoll = hashSeed(`meta-roll:${salt}:${name}`) % 100;
  if (tier === "uncanny" && metaRoll < 55) return pickVariant(`${salt}:meta:${name}`, metaPool);
  if (tier === "fortunate" && metaRoll < 20) return pickVariant(`${salt}:meta:${name}`, metaPool);

  return pickVariant(`${salt}:base:${name}`, basePool);
}

function quoteFor(name, basePool, metaPool, salt, luck) {
  return `"${pickDialogue(name, basePool, metaPool, salt, luck)}"`;
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
  const reaction = quoteFor(outcome.targetName, BASE_HURT_QUOTES, META_HURT_QUOTES, "hurt", luck);
  if (outcome.highRoll && shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      message: pickVariant(seed, [
        `You slip on a lucky puddle and accidentally plant your weapon in ${outcome.targetName} for ${outcome.damage}. ${reaction}`,
        `You begin a total miss, trip over your own clover charm, and still crack ${outcome.targetName} for ${outcome.damage}. ${reaction}`,
        `A wildly unplanned stumble turns into a saint-touched wallop on ${outcome.targetName} for ${outcome.damage}. ${reaction}`,
      ]),
    };
  }

  return {
    ...outcome,
    message: `You strike ${outcome.targetName} for ${outcome.damage}. ${reaction}`,
  };
}

export function decorateEnemyAttackOutcome(outcome, luck) {
  const seed = `enemy-hit:${outcome.attackerName}:${outcome.damage}`;
  const banter = quoteFor(outcome.attackerName, BASE_ATTACK_QUOTES, META_ATTACK_QUOTES, "enemy-attack", luck);
  if (shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      message: pickVariant(seed, [
        `${outcome.attackerName} pelts you with a shower of bad luck for ${outcome.damage}. ${banter}`,
        `${outcome.attackerName} bounces off a barrel, a wall, and your pride for ${outcome.damage}. ${banter}`,
        `${outcome.attackerName} catches you mid-flinch and charges ${outcome.damage} in bruises. ${banter}`,
      ]),
    };
  }

  return {
    ...outcome,
    message: `${outcome.attackerName} hits you for ${outcome.damage}. ${banter}`,
  };
}

export function decorateEnemyDefeatOutcome(outcome, luck) {
  const seed = `enemy-defeat:${outcome.foeName}`;
  const lastWords = quoteFor(outcome.foeName, BASE_DEFEAT_QUOTES, META_DEFEAT_QUOTES, "defeat", luck);
  if (shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      message: pickVariant(seed, [
        `${outcome.foeName} folds under a catastrophic shower of lucky nonsense. ${lastWords}`,
        `${outcome.foeName} goes down after the universe overcommits to your bit. ${lastWords}`,
        `${outcome.foeName} is defeated when fortune decides subtlety is overrated. ${lastWords}`,
      ]),
    };
  }

  return {
    ...outcome,
    message: `${outcome.foeName} is defeated. ${lastWords}`,
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
  const greeting = quoteFor(outcome.monster.name, BASE_ENCOUNTER_QUOTES, META_ENCOUNTER_QUOTES, "encounter", luck);
  if (luck >= 8 && shouldGoAbsurd(luck, seed)) {
    return {
      ...outcome,
      encounterTitle: "Lucky Find!",
      displayName: outcome.monster.name,
      message: pickVariant(seed, [
        `Lucky you. A clover-cursed champion erupts from the mist: ${outcome.monster.name}. ${greeting}`,
        `You round a corner, trip over a rainbow root, and discover a "special guest" ${outcome.monster.name}. ${greeting}`,
        `Fortune winks, the room groans, and ${outcome.monster.name} arrives like a rare tavern horror. ${greeting}`,
      ]),
    };
  }

  return {
    ...outcome,
    encounterTitle: "",
    displayName: outcome.monster.name,
    message: `${outcome.monster.name} emerges from the dark. ${greeting}`,
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
