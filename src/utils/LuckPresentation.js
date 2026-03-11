import { getLocale } from "../i18n/index.jsx";
import {
  getDialogueEntries,
  getDialogueLabel,
  getLootPrefixLabel,
  getMonsterDialogueEntries,
  getNestedDialogueEntries,
} from "../i18n/dialogueResources.js";

const LUCK_TIERS = [
  { key: "grounded", label: "Grounded", max: 1, absurdChance: 0 },
  { key: "fortunate", label: "Fortunate", max: 4, absurdChance: 35 },
  { key: "uncanny", label: "Uncanny", max: 7, absurdChance: 70 },
  { key: "clover-cursed", label: "Clover-Cursed", max: Number.POSITIVE_INFINITY, absurdChance: 100 },
];

const DIALOGUE_LIBRARY = {
  encounterQuote: {
    grounded: [
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
      "Your boots say hero. Your face says unpaid tab.",
      "Good. Another customer for the violence department.",
    ],
    fortunate: [
      "Did luck carry you here, or did you wander in by clerical error?",
      "You have the posture of someone the dice keep excusing.",
      "If fortune is with you, tell it I filed a complaint.",
      "You look oddly highlighted. I dislike highlighted prey.",
      "This ambush had a better forecast before your luck arrived.",
      "I can feel probability leaning on the scale already.",
      "The room says you're favored. The room is a gossip.",
      "You have the smug aura of a player whose bad decisions keep landing well.",
    ],
    uncanny: [
      "I can hear the RNG rattling in the walls already.",
      "This seed was supposed to go my way. I checked.",
      "I know a scripted encounter when I see one, and I resent it.",
      "The algorithm loves you and I find that deeply unprofessional.",
      "If this is another difficulty spike, I'm writing patch notes in blood.",
      "The Dev set this room up to embarrass me specifically.",
      "I was atmospheric flavor ten seconds ago and now I have payroll responsibilities.",
      "Your spawn protection is showing.",
    ],
    "clover-cursed": [
      "Did the Dev really spawn you here with that loadout?",
      "The seed just winked at me, which feels illegal.",
      "This encounter was focus-tested on one goblin and he cried.",
      "I can see the spreadsheet where my odds are being falsified.",
      "You are not a traveler. You are a patch note with ankles.",
      "Someone offscreen is mousing over my suffering for tooltips.",
      "The room geometry is rooting for you and I would like that investigated.",
      "I just saw the encounter table cross itself.",
    ],
  },
  hurtQuote: {
    grounded: [
      "Oi. That's an organ.",
      "That was supposed to miss. We rehearsed this.",
      "You can't just stab a working professional.",
      "I demand a rematch with less humiliation.",
      "That was my favorite rib. Emotionally, if not structurally.",
      "I felt that in several future regrets.",
      "That's not combat, that's targeted embarrassment.",
      "Could you at least pretend this is difficult?",
      "I object to being turned into a cautionary tale.",
      "You swing like a tax audit in boots.",
      "That connected with enough force to become gossip.",
      "Ow. Very rude. Very effective.",
    ],
    fortunate: [
      "That had suspiciously good timing.",
      "Fortune is clearly freelancing on your behalf.",
      "I resent how convenient that was for you.",
      "That looked accidental, which makes it worse somehow.",
      "You miss like a person who always lands on the right square anyway.",
      "The room just decided to help you and I hate collaborative spaces.",
      "That hit had the smugness of a lucky bounce.",
      "You fight like a coin toss that already knows the result.",
    ],
    uncanny: [
      "That hitbox is a slander campaign.",
      "The RNG sold me out in broad daylight.",
      "I demand a balance pass and several apologies.",
      "This seed has become hostile to labor.",
      "Was that in the patch notes, or are you freelancing?",
      "My dignity just clipped through the floor.",
      "I should have alt-tabbed before that landed.",
      "That looked pre-rendered. Explain yourself.",
    ],
    "clover-cursed": [
      "I'm reporting that crit directly to the Dev.",
      "You just frame-perfected my self-esteem offscreen.",
      "Somewhere, an analytics dashboard lit up and laughed.",
      "The engine and your shoes are in a conspiracy.",
      "I felt the cursor hover over that damage.",
      "You hit me so hard the soundtrack looked embarrassed.",
      "That strike has moderator powers.",
      "My entire union is opening a ticket.",
    ],
  },
  enemyAttackQuote: {
    grounded: [
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
      "Stand there and let me justify my health bar.",
      "I hit hardest when under-reviewed.",
    ],
    fortunate: [
      "Let's see if your lucky streak has collision enabled.",
      "I'm cashing in a very modest miracle.",
      "If the dice are helping you, perhaps they can help you dodge this.",
      "Your probability aura is annoying me into violence.",
      "I am about to submit a rebuttal to your whole thing.",
      "Let's test whether fortune covers bruises.",
      "I refuse to lose to someone this narratively protected.",
      "The room says you're favored. I say duck.",
    ],
    uncanny: [
      "The seed says yes, the frame data says maybe.",
      "I'm cashing in the pity roll the engine owes me.",
      "If this whiffs, blame procedural comedy.",
      "Watch this, the Dev finally remembered my attack animation.",
      "I was background flavor ten seconds ago. Now look at me.",
      "This is what happens when the encounter table gets ambitious.",
      "The RNG says it's my turn now. Legally binding.",
      "I am hitting you under protest and suspicious lighting.",
    ],
    "clover-cursed": [
      "The Dev left this swing in the build as a threat.",
      "Your protagonist privileges are about to meet my budget animation.",
      "I borrowed this attack from tomorrow's patch notes.",
      "The seed signed off on this and then laughed.",
      "If this lands, blame the universe and maybe QA.",
      "I just heard the engine whisper, 'do it for the clip.'",
      "This strike is sponsored by catastrophic luck variance.",
      "Let's see if your plot armor covers dental.",
    ],
  },
  defeatQuote: {
    grounded: [
      "Tell the broker this settles nothing.",
      "I knew I should've mugged a priest instead.",
      "This is embarrassingly on brand for my week.",
      "I've had better shifts. Marginally.",
      "Tell the afterlife I was carrying the team.",
      "I leave this encounter with no gold and several opinions.",
      "This feels like the kind of loss people laugh at in taverns.",
      "Bury me with my dignity if you can still locate it.",
      "Next time I'm ambushing someone with worse reflexes.",
      "I am dying in a manner that will inspire songs and not the flattering sort.",
      "Please tell everyone this looked cooler from my angle.",
      "This is going straight into the pub rumor mill.",
    ],
    fortunate: [
      "Even your accidents are overachieving.",
      "I got outplayed by coincidence wearing boots.",
      "The lucky bounce did more work than either of us deserved.",
      "I hate losing to someone who looks this surprised.",
      "Please inform fortune that this feels smug.",
      "I was defeated by a chain of events that should require paperwork.",
      "That outcome had the vibe of a rigged raffle.",
      "I just lost to a shrug and a clover.",
    ],
    uncanny: [
      "Tell the RNG I said this seed is fraudulent.",
      "Wonderful. I die, you win, and the patch notes call it flavor.",
      "I'm filing a bug report titled 'player keeps being rude with damage.'",
      "The Dev overtuned your nonsense and undertuned my union protections.",
      "This encounter was rigged from the loading screen.",
      "I hope the analytics show how unfair this felt.",
      "If anyone asks, I lost to a balancing issue, not you.",
      "My obituary is going to read 'outperformed by suspect numbers.'",
    ],
    "clover-cursed": [
      "I'm taking this up with the Dev.",
      "I can see the metrics celebrating and I find that haunting.",
      "The seed itself testified against me.",
      "This defeat came with tooltips and that feels cruel.",
      "Tell the engine I said it lacks professional distance.",
      "The room just marked this as intended behavior and I disagree.",
      "I died to a bit. A polished, well-supported bit.",
      "Please note for the postmortem that the joke landed harder than the sword.",
    ],
  },
};

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

function formatTemplate(template, values) {
  return template.replace(/\{([^}]+)\}/g, (_, key) => `${values[key] ?? ""}`);
}

function getTierKey(luck) {
  return getLuckTier(luck).key;
}

function pickTierText(category, tierKey, seed) {
  return pickVariant(seed, getDialogueEntries(getLocale(), category, tierKey, DIALOGUE_LIBRARY));
}

function pickMonsterTierText(category, monsterId, tierKey, seed) {
  const fallbackEntries = getDialogueEntries(getLocale(), category, tierKey, DIALOGUE_LIBRARY);
  return pickVariant(seed, getMonsterDialogueEntries(getLocale(), monsterId, category, tierKey, fallbackEntries));
}

function quoteFor(category, monsterId, name, salt, luck) {
  const tierKey = getTierKey(luck);
  return `"${pickMonsterTierText(category, monsterId, tierKey, `${salt}:${monsterId || name}:${tierKey}`)}"`;
}

function shouldGoAbsurd(luck, seed) {
  const tier = getLuckTier(luck);
  if (tier.absurdChance <= 0) return false;
  return hashSeed(`absurd:${seed}`) % 100 < tier.absurdChance;
}

function getLootPrefix(source) {
  const fallback = source === "road" ? "Found roadside loot:" : source === "drop" ? "Loot dropped:" : "Found loot:";
  return getLootPrefixLabel(getLocale(), source, fallback);
}

export function getLuckTier(luck) {
  return LUCK_TIERS.find((tier) => luck <= tier.max) || LUCK_TIERS[LUCK_TIERS.length - 1];
}

Object.assign(DIALOGUE_LIBRARY, {
  attackNarration: {
    grounded: [
      "You strike {target} for {damage}. {quote}",
      "You lunge into {target} for {damage}. {quote}",
      "You clip {target} for {damage}. {quote}",
      "You bring the weapon down on {target} for {damage}. {quote}",
    ],
    fortunate: [
      "You nearly lose the plot, then tag {target} for {damage}. {quote}",
      "You fight like a lucky accident and still hit {target} for {damage}. {quote}",
      "A convenient stumble turns into {damage} on {target}. {quote}",
      "You swing first, understand later, and {target} eats {damage}. {quote}",
    ],
    uncanny: [
      "You trip over probability itself and carve {damage} into {target}. {quote}",
      "Your attack arrives with suspiciously good timing and hits {target} for {damage}. {quote}",
      "You perform what scholars would call nonsense and {target} takes {damage}. {quote}",
      "A sequence of bad footwork and excellent luck smacks {target} for {damage}. {quote}",
    ],
    "clover-cursed": [
      "You begin a complete miss, ricochet off destiny, and paste {target} for {damage}. {quote}",
      "The universe misfiles your mistake as a critical moment and {target} takes {damage}. {quote}",
      "You swing like a typo, the engine nods, and {target} suffers {damage}. {quote}",
      "A saint-touched pratfall rewrites itself into {damage} on {target}. {quote}",
    ],
  },
  enemyAttackNarration: {
    grounded: [
      "{attacker} hits you for {damage}. {quote}",
      "{attacker} catches you for {damage}. {quote}",
      "{attacker} lands a nasty {damage}. {quote}",
      "{attacker} clocks you for {damage}. {quote}",
    ],
    fortunate: [
      "{attacker} threads a very smug {damage} through your luck. {quote}",
      "{attacker} lands {damage} like fortune briefly took a smoke break. {quote}",
      "{attacker} manages {damage} despite your suspiciously favored existence. {quote}",
      "{attacker} sneaks {damage} past your lucky nonsense. {quote}",
    ],
    uncanny: [
      "{attacker} cashes in a hostile dice roll for {damage}. {quote}",
      "{attacker} bounces off a barrel, a wall, and your pride for {damage}. {quote}",
      "{attacker} submits {damage} directly to your face with engine support. {quote}",
      "{attacker} pelts you with bureaucratically approved pain for {damage}. {quote}",
    ],
    "clover-cursed": [
      "{attacker} swings through three camera cuts the engine swears are fair and bills you {damage}. {quote}",
      "{attacker} weaponizes the patch notes and lands {damage}. {quote}",
      "{attacker} arrives like a rendering error the Dev forgot to hide and leaves behind {damage}. {quote}",
      "{attacker} hits you with a clip-worthy procedural mess worth {damage}. {quote}",
    ],
  },
  defeatNarration: {
    grounded: [
      "{foe} is defeated. {quote}",
      "{foe} drops hard and stays there. {quote}",
      "{foe} folds under the pressure. {quote}",
      "{foe} is down for the count. {quote}",
    ],
    fortunate: [
      "{foe} goes down under a deeply suspicious turn of events. {quote}",
      "{foe} loses the argument with your luck and collapses. {quote}",
      "{foe} is defeated by a blow that had no business landing that well. {quote}",
      "{foe} folds when fortune leans on the scene. {quote}",
    ],
    uncanny: [
      "{foe} goes down after the universe overcommits to your bit. {quote}",
      "{foe} is defeated when fortune decides subtlety is overrated. {quote}",
      "{foe} crumples beneath a highly theatrical probability incident. {quote}",
      "{foe} loses to a chain of events that looks audited by chaos. {quote}",
    ],
    "clover-cursed": [
      "{foe} folds under a catastrophic shower of lucky nonsense. {quote}",
      "{foe} is defeated by a comedy routine with sharp edges. {quote}",
      "{foe} gets edited out of the scene by cursed good fortune. {quote}",
      "{foe} is removed from active service by a bizarre miracle. {quote}",
    ],
  },
  monsterNarration: {
    grounded: [
      "{monster} emerges from the dark. {quote}",
      "{monster} steps into the lantern glow. {quote}",
      "{monster} lurches into view. {quote}",
      "{monster} claims the room with hostile confidence. {quote}",
    ],
    fortunate: [
      "{monster} appears as if your luck requested a manager. {quote}",
      "{monster} rounds the corner looking personally offended by your blessings. {quote}",
      "{monster} shows up just in time to complicate your winning streak. {quote}",
      "{monster} arrives with the energy of a problem your luck will blame on weather. {quote}",
    ],
    uncanny: [
      "{monster} spawns in like the room just lost an argument with the RNG. {quote}",
      "{monster} enters as though the encounter table wanted attention. {quote}",
      "{monster} arrives with procedural malice and a line to read. {quote}",
      "{monster} appears right where the algorithm thought it would be funniest. {quote}",
    ],
    "clover-cursed": [
      "Lucky you. A clover-cursed champion erupts from the mist: {monster}. {quote}",
      "You trip over a rainbow root and unlock the worst guest star: {monster}. {quote}",
      "Fortune winks, the room groans, and {monster} arrives like a rare tavern horror. {quote}",
      "The dungeon rolls a natural disaster and names it {monster}. {quote}",
    ],
  },
  lootNarration: {
    grounded: [
      "{prefix} {item} [{rarity}] worth about {value}g.",
      "{prefix} {item} [{rarity}] at roughly {value}g.",
      "{prefix} {item} [{rarity}] and it should fetch around {value}g.",
    ],
    fortunate: [
      "Fortune nudges {item} [{rarity}] into reach. Call it about {value}g.",
      "{prefix} {item} [{rarity}], apparently because luck is feeling chatty. Around {value}g.",
      "A tidy coincidence produces {item} [{rarity}] worth about {value}g.",
    ],
    uncanny: [
      "You trip over absolutely nothing and somehow discover {item} [{rarity}] worth about {value}g.",
      "A wildly inappropriate gust of fortune slaps {item} [{rarity}] into your hands. About {value}g.",
      "The room misfiles a miracle and you walk away with {item} [{rarity}] for roughly {value}g.",
    ],
    "clover-cursed": [
      "A clover-shaped coincidence deposits {item} [{rarity}] directly in your path. It screams {value}g.",
      "The dungeon coughs up {item} [{rarity}] like the Dev hit the wrong reward column. About {value}g.",
      "Reality hiccups, then leaves {item} [{rarity}] at your feet worth about {value}g.",
    ],
  },
  travelNarration: {
    quiet: {
      grounded: [
        "The road is quiet.",
        "The road offers only mud, wind, and suspicious peace.",
        "Nothing but damp air and distant fiddles follow you.",
      ],
      fortunate: [
        "The road stays calm, as if luck filed the danger elsewhere for a moment.",
        "The road behaves itself, which feels oddly personal.",
        "Even the potholes seem briefly cooperative.",
      ],
      uncanny: [
        "The road behaves so politely that it becomes unsettling.",
        "The path goes quiet in the way a joke does before the punchline arrives.",
        "Everything is calm enough to feel procedurally suspicious.",
      ],
      "clover-cursed": [
        "The road goes so quiet you can hear probability clearing its throat.",
        "Nothing happens, but the scenery looks like it knows a secret.",
        "The road is still. Somewhere, the engine is winding a crank.",
      ],
    },
    potion: {
      grounded: [
        "A traveler hands you a potion.",
        "A roadside stranger presses a tonic into your palm and keeps walking.",
        "Someone on the road donates a bottle and declines all explanation.",
      ],
      fortunate: [
        "A passerby mistakes you for destiny and hands over a potion.",
        "A tonic falls into your day with suspicious convenience.",
        "A traveler decides your luck looks underfunded and shares a bottle.",
      ],
      uncanny: [
        "A passing auntie mistakes you for destiny and hurls a potion into your pocket.",
        "The road produces a tonic like it was trying to keep the bit alive.",
        "A stranger exits stage left after tossing you a potion with perfect comedic timing.",
      ],
      "clover-cursed": [
        "A potion enters your inventory so abruptly it feels pre-approved by the universe.",
        "A traveler appears, hands you a tonic, and vanishes like a loading-screen rumor.",
        "The road spawns a potion event with no regard for plausibility.",
      ],
    },
    loss: {
      grounded: [
        "A pothole throws {item} off the cart.",
        "{item} rattles loose and vanishes into roadside muck.",
        "A bad jolt sends {item} flying into the ditch.",
      ],
      fortunate: [
        "Luck takes a coffee break and {item} disappears into a ditch.",
        "A very specific bump ejects {item} from your custody.",
        "The road requests a tax payment and accepts {item}.",
      ],
      uncanny: [
        "A pothole opens like a greedy mouth and swallows {item}.",
        "The cart hits one dramatic stone and {item} resigns from the trip.",
        "The road performs a slapstick theft and steals {item}.",
      ],
      "clover-cursed": [
        "{item} is claimed by a pothole with clear narrative intent.",
        "The roadside edits {item} out of continuity.",
        "A ditch takes one look at {item} and decides it is loot now.",
      ],
    },
    none: {
      grounded: [
        "Nothing worth remembering happens on the road.",
        "The walk back is uneventful, which almost feels rude.",
        "The road refrains from inventing a new problem for once.",
      ],
      fortunate: [
        "Nothing happens, which at least counts as a small blessing.",
        "The road declines to escalate your life for a few minutes.",
        "Not even fate can be bothered to improvise on this stretch.",
      ],
      uncanny: [
        "Nothing happens, which at this luck level feels suspiciously restrained.",
        "The road passes without incident and the silence feels staged.",
        "No event fires, though the scenery clearly thought about it.",
      ],
      "clover-cursed": [
        "Nothing happens, which is somehow the weirdest event available.",
        "The road decides to save the joke for later and you do not trust it.",
        "Silence falls like a loading screen nobody asked for.",
      ],
    },
  },
  trapNarration: {
    grounded: {
      live: [
        "A trap springs for {damage} damage.",
        "Hidden hardware nails you for {damage}.",
        "A bad bit of dungeon engineering clips you for {damage}.",
      ],
      fatal: [
        "The trap finishes you off for {damage}.",
        "A final burst of dungeon malice deals {damage} and drops you.",
        "The trap takes the rest for {damage}.",
      ],
    },
    fortunate: {
      live: [
        "A trap clips you for {damage}, apparently annoyed by your luck.",
        "The room gets one petty victory and charges {damage}.",
        "A hidden mechanism catches you for {damage} and smugness.",
      ],
      fatal: [
        "A trap cashes in every small favor fortune owed you and deals {damage}.",
        "The room finally wins an argument and it costs {damage}.",
        "A bad mechanism lands {damage} and your luck stops negotiating.",
      ],
    },
    uncanny: {
      live: [
        "A ridiculous chain of lucky debris clips you for {damage}.",
        "The trap goes off like slapstick with sharp corners and deals {damage}.",
        "Some very theatrical hardware scrapes you for {damage}.",
      ],
      fatal: [
        "A shower of falling junk, cursed racks, and bad timing deals {damage} and ends the run.",
        "The room overcommits to a bit and crushes you for {damage}.",
        "An elaborate hazard sequence lands {damage} with hostile enthusiasm.",
      ],
    },
    "clover-cursed": {
      live: [
        "A shower of lucky hardware, bouncing coins, and one rude barrel clips you for {damage}.",
        "The trap triggers like a stage cue and bills you {damage}.",
        "A physics problem with malicious intent smacks you for {damage}.",
      ],
      fatal: [
        "A shower of lucky hardware, falling coin racks, and one cursed barrel flatten you for {damage}.",
        "The dungeon wins an award for comic timing and deals {damage} directly to your future.",
        "A catastrophic prop comedy lands {damage} and sends you out under protest.",
      ],
    },
  },
  deathNarration: {
    trap: {
      grounded: ["The trap finishes you off.", "The room goes silent around your remains.", "The dungeon claims the last word."],
      fortunate: [
        "The trap gets the last laugh, which feels petty.",
        "Fortune finally misplaces your paperwork and the trap collects.",
        "The room cashes in your earlier miracles all at once.",
      ],
      uncanny: [
        "The trap wins in a way that will sound fake in the retelling.",
        "A very dramatic chain of bad luck writes the obituary.",
        "The room turns your momentum into a cautionary anecdote.",
      ],
      "clover-cursed": [
        "You are crushed beneath an avalanche of celebratory gold. Lucky, technically.",
        "The dungeon buries you in a miracle with terrible bedside manner.",
        "A shower of lucky nonsense finishes the job and calls it a blessing.",
      ],
    },
    flee: {
      grounded: ["Slain while fleeing.", "You do not make it out in one piece.", "The escape falls apart at the worst possible moment."],
      fortunate: [
        "You almost get away. Almost is not a medical term.",
        "The retreat unravels in a manner fate will describe as funny.",
        "Your exit strategy develops character and then kills you.",
      ],
      uncanny: [
        "The escape fails with enough irony to power a tavern story for weeks.",
        "You run into the exact spot where luck stops cooperating.",
        "Your retreat turns into a public service announcement about hubris.",
      ],
      "clover-cursed": [
        "You escape the fight but not the stampede of lucky chaos trampling in behind you.",
        "The exit works right up until fortune turns it into slapstick homicide.",
        "You nearly flee the scene before destiny clotheslines the whole idea.",
      ],
    },
    combat: {
      grounded: ["You have been slain.", "The fight ends badly and finally.", "This is where the run runs out."],
      fortunate: [
        "Luck shrugs, steps aside, and lets the hit through.",
        "The fight cashes in all the near misses at once.",
        "You lose the brawl and the argument with destiny.",
      ],
      uncanny: [
        "You win the strangest obituary in town when the fight finally turns on you.",
        "The battle closes like a rude punchline.",
        "The run folds with enough drama to attract a narrator.",
      ],
      "clover-cursed": [
        "{foe} finishes the job while fortune turns the whole scene into absurd theater.",
        "The fight ends with reality overacting and your luck face-down on the floor.",
        "The universe writes a slapstick tragedy around your final hit point.",
      ],
    },
  },
  emptyRoomNarration: {
    grounded: ["{baseText}", "{baseText}", "{baseText}"],
    fortunate: [
      "{baseText} Luck has clearly been here first.",
      "{baseText} The room still feels smug about it.",
      "{baseText} Even empty, it looks pleased with itself.",
    ],
    uncanny: [
      "The room is empty except for the very loud feeling that luck just played a prank on you.",
      "Nothing waits here but a suspicious breeze and the smug sound of fortune giggling.",
      "The chamber is vacant, which somehow feels more theatrical than helpful.",
      "The room contains no treasure, only the aftertaste of a joke with your name on it.",
    ],
    "clover-cursed": [
      "The room is empty, but the lighting suggests the Dev wanted a reaction anyway.",
      "Nothing is here except a breeze, a pause, and the sense that reality just set up a callback.",
      "The chamber has been looted by either fate or a comedian with keys.",
      "You find no treasure, only the unsettling certainty that the room thinks this is hilarious.",
    ],
  },
});

export function decorateAttackOutcome(outcome, luck) {
  const tierKey = getTierKey(luck);
  const seed = `attack:${outcome.targetId || outcome.targetName}:${outcome.damage}:${outcome.highRoll}:${tierKey}`;
  const effectiveTier = outcome.highRoll && shouldGoAbsurd(luck, seed) ? tierKey : tierKey === "clover-cursed" ? "uncanny" : tierKey;
  const quote = quoteFor("hurtQuote", outcome.targetId, outcome.targetName, "hurt", luck);
  const template = pickTierText("attackNarration", effectiveTier, seed);
  return {
    ...outcome,
    message: formatTemplate(template, { target: outcome.targetName, damage: outcome.damage, quote }),
  };
}

export function decorateEnemyAttackOutcome(outcome, luck) {
  const tierKey = getTierKey(luck);
  const seed = `enemy-hit:${outcome.attackerId || outcome.attackerName}:${outcome.damage}:${tierKey}`;
  const template = pickTierText("enemyAttackNarration", tierKey, seed);
  const quote = quoteFor("enemyAttackQuote", outcome.attackerId, outcome.attackerName, "enemy-attack", luck);
  return {
    ...outcome,
    message: formatTemplate(template, { attacker: outcome.attackerName, damage: outcome.damage, quote }),
  };
}

export function decorateEnemyDefeatOutcome(outcome, luck) {
  const tierKey = getTierKey(luck);
  const seed = `enemy-defeat:${outcome.foeId || outcome.foeName}:${tierKey}`;
  const effectiveTier = shouldGoAbsurd(luck, seed) ? tierKey : tierKey === "clover-cursed" ? "uncanny" : tierKey;
  const quote = quoteFor("defeatQuote", outcome.foeId, outcome.foeName, "defeat", luck);
  const template = pickTierText("defeatNarration", effectiveTier, seed);
  return {
    ...outcome,
    message: formatTemplate(template, { foe: outcome.foeName, quote }),
  };
}

export function decorateDeathOutcome(outcome, luck) {
  const tierKey = getTierKey(luck);
  const cause = outcome.cause === "trap" ? "trap" : outcome.cause === "flee" ? "flee" : "combat";
  const seed = `death:${cause}:${outcome.foeName || "none"}:${tierKey}`;
  const effectiveTier = shouldGoAbsurd(luck, seed) ? tierKey : tierKey === "clover-cursed" ? "uncanny" : tierKey;
  const template = pickVariant(
    seed,
    getDialogueEntries(getLocale(), `deathNarration.${cause}`, effectiveTier, {
      [`deathNarration.${cause}`]: DIALOGUE_LIBRARY.deathNarration[cause],
    })
  );
  return {
    ...outcome,
    message: formatTemplate(template, { foe: outcome.foeName || "the dungeon" }),
  };
}

export function decorateMonsterEncounter(outcome, luck) {
  const tierKey = getTierKey(luck);
  const seed = `monster:${outcome.monster.id || outcome.monster.name}:${outcome.floor}:${outcome.rooms}:${tierKey}`;
  const quote = quoteFor("encounterQuote", outcome.monster.id, outcome.monster.name, "encounter", luck);
  return {
    ...outcome,
    encounterTitle: luck >= 8 && shouldGoAbsurd(luck, seed) ? getDialogueLabel(getLocale(), "luckyFindTitle", "Lucky Find!") : "",
    displayName: outcome.monster.name,
    message: formatTemplate(pickTierText("monsterNarration", tierKey, seed), {
      monster: outcome.monster.name,
      quote,
    }),
  };
}

export function decorateLootOutcome(outcome, luck) {
  const tierKey = getTierKey(luck);
  const seed = `loot:${outcome.source}:${outcome.item.name}:${outcome.item.rarity}:${tierKey}`;
  const effectiveTier = shouldGoAbsurd(luck, seed) ? tierKey : tierKey === "clover-cursed" ? "uncanny" : tierKey;
  const template = pickTierText("lootNarration", effectiveTier, seed);
  return {
    ...outcome,
    message: formatTemplate(template, {
      prefix: getLootPrefix(outcome.source),
      item: outcome.item.name,
      rarity: outcome.item.rarity,
      value: outcome.item.value,
    }),
  };
}

export function decorateTravelOutcome(outcome, luck) {
  const tierKey = getTierKey(luck);
  const seed = `travel:${outcome.kind}:${outcome.item?.name || "none"}:${tierKey}`;
  const effectiveTier = shouldGoAbsurd(luck, seed) ? tierKey : tierKey === "clover-cursed" ? "uncanny" : tierKey;
  const template = pickVariant(
    seed,
    getDialogueEntries(getLocale(), `travelNarration.${outcome.kind}`, effectiveTier, {
      [`travelNarration.${outcome.kind}`]: DIALOGUE_LIBRARY.travelNarration[outcome.kind],
    })
  );
  return {
    ...outcome,
    message: formatTemplate(template, { item: outcome.item?.name || "your cargo" }),
  };
}

export function decorateTrapOutcome(outcome, luck) {
  const tierKey = getTierKey(luck);
  const seed = `trap:${outcome.damage}:${outcome.fatal}:${tierKey}`;
  const effectiveTier = shouldGoAbsurd(luck, seed) ? tierKey : tierKey === "clover-cursed" ? "uncanny" : tierKey;
  const template = pickVariant(
    seed,
    getNestedDialogueEntries(
      getLocale(),
      "trapNarration",
      outcome.fatal ? "fatal" : "live",
      effectiveTier,
      DIALOGUE_LIBRARY
    )
  );
  return {
    ...outcome,
    message: formatTemplate(template, { damage: outcome.damage }),
  };
}

export function decorateEmptyRoomOutcome(outcome, luck) {
  const tierKey = getTierKey(luck);
  const seed = `empty:${outcome.baseText}:${tierKey}`;
  const effectiveTier = shouldGoAbsurd(luck, seed) ? tierKey : tierKey === "clover-cursed" ? "uncanny" : tierKey;
  return {
    ...outcome,
    message: formatTemplate(pickTierText("emptyRoomNarration", effectiveTier, seed), { baseText: outcome.baseText }),
  };
}
