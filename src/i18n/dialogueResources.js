import { DEFAULT_LOCALE, getLocaleChain, SUPPORTED_LOCALES } from "./localeMetadata.js";

const localeSkeleton = () => ({
  labels: {},
  lootPrefixes: {},
  library: {},
  monsterQuotes: {},
});

const MONSTER_PROFILES = {
  en: {
    pub_goblin: { place: "the sticky taproom", prop: "the last clean mug", gripe: "spilled stout and unpaid tabs" },
    roadside_toll_goblin: { place: "the roadside checkpoint", prop: "the toll bucket", gripe: "coin counting and passing travelers" },
    cellar_rat_of_ill_omen: { place: "the damp cellar", prop: "the warm cheese wheel", gripe: "omens, traps, and stomping boots" },
    coin_wraith: { place: "the counting vault", prop: "my last honest coin", gripe: "interest, echoes, and the living" },
    bog_lurker: { place: "the bog edge", prop: "the slick reeds", gripe: "mud, moonlight, and loud boots" },
    fae_debt_collector: { place: "the contract hall", prop: "the velvet ledger", gripe: "overdue names and loopholes" },
    wakehouse_spirit: { place: "the wake room", prop: "the mourning bell", gripe: "bad hymns and worse manners" },
    overdressed_lepre_bruiser: { place: "the velvet lounge", prop: "my emerald lapel", gripe: "wrinkled suits and public disrespect" },
    barrel_kicking_revenant: { place: "the old cellar run", prop: "the cursed barrel row", gripe: "broken staves and sloppy footwork" },
    bog_king_on_a_bad_night: { place: "my miserable court", prop: "the crown reeds", gripe: "tributes, frogs, and disappointment" },
    treasury_drake: { place: "the hot treasury", prop: "the premium gold pile", gripe: "dust, thieves, and undercooked worship" },
    the_last_toast: { place: "the funeral taproom", prop: "the final glass", gripe: "silence, stale songs, and survivors" },
    rainbow_mimic: { place: "the suspicious rainbow end", prop: "the bait chest", gripe: "greedy hands and predictable gasps" },
  },
  es: {
    pub_goblin: { place: "la taberna pegajosa", prop: "la última jarra limpia", gripe: "cerveza derramada y cuentas impagadas" },
    roadside_toll_goblin: { place: "el puesto de peaje", prop: "el cubo del peaje", gripe: "contar monedas y viajeros insolentes" },
    cellar_rat_of_ill_omen: { place: "el sótano húmedo", prop: "la rueda de queso tibio", gripe: "agüeros, trampas y botas pisoteando" },
    coin_wraith: { place: "la bóveda de recuento", prop: "mi última moneda honrada", gripe: "intereses, ecos y gente viva" },
    bog_lurker: { place: "la orilla del pantano", prop: "los juncos resbaladizos", gripe: "barro, luz lunar y botas ruidosas" },
    fae_debt_collector: { place: "la sala de contratos", prop: "el libro de terciopelo", gripe: "nombres vencidos y cláusulas tramposas" },
    wakehouse_spirit: { place: "la sala del velorio", prop: "la campana de duelo", gripe: "himnos malos y peores modales" },
    overdressed_lepre_bruiser: { place: "el salón de terciopelo", prop: "mi solapa esmeralda", gripe: "trajes arrugados y faltas de respeto públicas" },
    barrel_kicking_revenant: { place: "la vieja bodega", prop: "la fila de barriles malditos", gripe: "duelas rotas y pasos torpes" },
    bog_king_on_a_bad_night: { place: "mi corte miserable", prop: "las cañas de la corona", gripe: "tributos, ranas y decepciones" },
    treasury_drake: { place: "la tesorería ardiente", prop: "la pila premium de oro", gripe: "polvo, ladrones y adoración mediocre" },
    the_last_toast: { place: "la taberna funeraria", prop: "la última copa", gripe: "silencio, canciones rancias y supervivientes" },
    rainbow_mimic: { place: "el final sospechoso del arcoíris", prop: "el cofre-cebo", gripe: "manos codiciosas y jadeos previsibles" },
  },
};

const QUOTE_TEMPLATES = {
  en: {
    encounterQuote: {
      grounded: {
        patterns: [
          "I run things out of {place} and I already dislike your face.",
          "You walk into {place} like {prop} belongs to you.",
          "I had enough to deal with before you and {gripe}.",
          "Stand still. I want this ambush around {prop} to look rehearsed.",
        ],
        tails: [
          "Be professional and die scared.",
          "I am trying very hard to sound in charge.",
          "This was a calmer shift before you arrived.",
        ],
      },
      fortunate: {
        patterns: [
          "Your luck tracked mud all through {place}.",
          "Even {prop} looks smug now that you're here.",
          "I can hear probability leaning toward you over {gripe}.",
          "You carry the posture of a player the dice keep excusing.",
        ],
        tails: ["I filed a complaint with fate already.", "The room is being weirdly supportive of you.", "This encounter had better odds ten seconds ago."],
      },
      uncanny: {
        patterns: [
          "The seed is rattling behind the walls of {place}.",
          "I was scenery until the algorithm volunteered me for this.",
          "The Dev clearly wants drama around {prop}.",
          "I can smell patch notes mixed in with {gripe}.",
        ],
        tails: ["I object on professional grounds.", "This feels scripted against labor.", "My union is going to hate this replay."],
      },
      "clover-cursed": {
        patterns: [
          "Did the Dev hand-place you in {place} for audience metrics?",
          "The seed just winked at {prop} and I want a witness.",
          "You are less a traveler and more a patch note with ankles.",
          "This whole encounter smells like QA bait and {gripe}.",
        ],
        tails: ["If this becomes a clip, I want royalties.", "The geometry is cheering for you again.", "I can hear the analytics dashboard loading."],
      },
    },
    hurtQuote: {
      grounded: {
        patterns: [
          "That nearly folded my {prop}.",
          "You hit like a bounced tab and it still hurts.",
          "I felt that across {place}.",
          "That landed right on my professional pride.",
        ],
        tails: ["Very rude.", "I had plans for those bones.", "This is becoming embarrassing."],
      },
      fortunate: {
        patterns: [
          "That had suspiciously lucky timing.",
          "You just tripped into competence around {prop}.",
          "The room helped you and I resent that.",
          "Even {gripe} felt fairer than that hit.",
        ],
        tails: ["Fortune is freelancing for you.", "That bounce looked smug.", "I hate how convenient that was."],
      },
      uncanny: {
        patterns: [
          "That hitbox is slandering me.",
          "The RNG sold me out in {place}.",
          "My self-respect just clipped through {prop}.",
          "That impact had patch-note energy.",
        ],
        tails: ["I demand a balance pass.", "The frame data laughed on contact.", "This seed is anti-worker."],
      },
      "clover-cursed": {
        patterns: [
          "I'm reporting that damage spike to the Dev.",
          "You just frame-perfected my self-esteem offscreen.",
          "Even the soundtrack looked embarrassed by that one.",
          "The cursor hovered over my pain and approved it.",
        ],
        tails: ["My ticket queue just got longer.", "This had moderator privileges.", "Some analytics dashboard is cackling."],
      },
    },
    enemyAttackQuote: {
      grounded: {
        patterns: [
          "Stand still and let me justify my existence.",
          "This is for every bad idea you dragged into {place}.",
          "Consider this a toll paid in blunt force.",
          "I am billing you personally for this swing near {prop}.",
        ],
        tails: ["Take it physically.", "This is very professional violence.", "Try flinching more profitably."],
      },
      fortunate: {
        patterns: [
          "Let's see if your lucky streak has collision enabled.",
          "I'm spending one miracle to hit you back.",
          "The room says you're favored. I say duck.",
          "I'm rebutting your plot armor with direct contact and {gripe}.",
        ],
        tails: ["Fortune can cover bruises, I hope.", "This feels fair to me specifically.", "You had this coming narratively."],
      },
      uncanny: {
        patterns: [
          "The seed says yes, the frame data says maybe.",
          "I'm cashing in the pity roll the engine owes me.",
          "The Dev finally remembered my attack animation in {place}.",
          "This whole swing is sponsored by bad balancing around {prop}.",
        ],
        tails: ["Blame procedural comedy if it whiffs.", "The encounter table wanted content.", "I am attacking under protest."],
      },
      "clover-cursed": {
        patterns: [
          "The Dev left this swing in the build as a warning.",
          "Your protagonist privileges are meeting my budget animation.",
          "I borrowed this strike from tomorrow's patch notes.",
          "The engine whispered 'do it for the clip' and pointed at {prop}.",
        ],
        tails: ["Blame QA if this lands.", "This is sponsored by variance.", "Let's test your plot armor's dental plan."],
      },
    },
    defeatQuote: {
      grounded: {
        patterns: [
          "Tell the broker this settles nothing.",
          "This is humiliatingly on brand for my week.",
          "Bury me with whatever remains of my dignity near {prop}.",
          "This is going straight into the rumor mill of {place}.",
        ],
        tails: ["I object posthumously.", "Please say I looked cooler from your angle.", "I've had better shifts."],
      },
      fortunate: {
        patterns: [
          "I got outplayed by coincidence wearing boots.",
          "The lucky bounce did more work than either of us.",
          "I hate losing to someone who still looks surprised.",
          "Even my downfall arrived with suspicious convenience and {gripe}.",
        ],
        tails: ["Fortune feels smug.", "This needed paperwork.", "That looked like a rigged raffle."],
      },
      uncanny: {
        patterns: [
          "Tell the RNG this seed is fraudulent.",
          "The patch notes will call this flavor and I resent that.",
          "I'm filing a bug report from beyond {place}.",
          "My obituary will blame balancing and {prop}.",
        ],
        tails: ["The analytics better show my suffering.", "I lost to a joke with production values.", "This was rigged from loading screen onward."],
      },
      "clover-cursed": {
        patterns: [
          "I'm taking this straight to the Dev.",
          "I can see the metrics celebrating already.",
          "The room marked this intended behavior and I disagree.",
          "I died to a bit. A polished bit with {gripe}.",
        ],
        tails: ["If there's a highlight reel, I want residuals.", "This came with tooltips.", "The joke landed harder than the sword."],
      },
    },
  },
  es: {
    encounterQuote: {
      grounded: {
        patterns: [
          "Yo llevo esto desde {place} y tu cara ya me cae mal.",
          "Entras en {place} como si {prop} fuera tuyo.",
          "Ya tenía bastante con {gripe} antes de que aparecieras.",
          "Quieto. Quiero que esta emboscada alrededor de {prop} parezca ensayada.",
        ],
        tails: ["Muere con un poco de profesionalidad.", "Estoy haciendo un gran esfuerzo por sonar al mando.", "Este turno era más tranquilo antes de ti."],
      },
      fortunate: {
        patterns: [
          "Tu suerte acaba de llenar de barro todo {place}.",
          "Hasta {prop} te mira con suficiencia.",
          "Puedo oír la probabilidad inclinándose hacia ti por encima de {gripe}.",
          "Tienes la postura de alguien a quien los dados perdonan demasiado.",
        ],
        tails: ["Ya he presentado queja al destino.", "La sala te está apoyando demasiado.", "Este encuentro tenía mejores números hace un momento."],
      },
      uncanny: {
        patterns: [
          "La semilla está traqueteando dentro de {place}.",
          "Yo era decorado hasta que el algoritmo me metió en nómina.",
          "El Dev claramente quería drama alrededor de {prop}.",
          "Aquí huele a notas del parche mezcladas con {gripe}.",
        ],
        tails: ["Protesto por motivos laborales.", "Esto parece guion en contra del gremio.", "Mi sindicato va a odiar la repetición de esta escena."],
      },
      "clover-cursed": {
        patterns: [
          "¿El Dev te colocó a mano en {place} por métricas?",
          "La semilla acaba de guiñarle el ojo a {prop} y quiero testigos.",
          "No eres viajero, eres una nota del parche con tobillos.",
          "Este encuentro entero huele a cebo para QA y a {gripe}.",
        ],
        tails: ["Si esto acaba en clip, quiero regalías.", "La geometría te está animando otra vez.", "Puedo oír cargarse el panel de analítica."],
      },
    },
    hurtQuote: {
      grounded: {
        patterns: [
          "Eso casi me dobla {prop}.",
          "Pegas como una cuenta devuelta y aun así duele.",
          "He sentido eso en toda {place}.",
          "Eso me ha impactado justo en el orgullo profesional.",
        ],
        tails: ["Muy grosero.", "Yo contaba con esos huesos.", "Esto empieza a ser bochornoso."],
      },
      fortunate: {
        patterns: [
          "Eso ha tenido un timing sospechosamente afortunado.",
          "Acabas de tropezarte hasta la competencia junto a {prop}.",
          "La sala te ayudó y me parece feísimo.",
          "Hasta {gripe} parecía más justo que ese golpe.",
        ],
        tails: ["La fortuna está haciendo horas extra para ti.", "Ese rebote tenía arrogancia.", "Odio lo conveniente que fue eso."],
      },
      uncanny: {
        patterns: [
          "Esa hitbox me está difamando.",
          "El RNG me vendió delante de toda {place}.",
          "Mi autoestima acaba de cliparse a través de {prop}.",
          "Ese impacto tenía energía de nota del parche.",
        ],
        tails: ["Exijo un balance pass.", "La frame data se rió al tocarme.", "Esta semilla odia a la clase trabajadora."],
      },
      "clover-cursed": {
        patterns: [
          "Ese pico de daño va directo al escritorio del Dev.",
          "Acabas de hacer frame-perfect con mi autoestima fuera de cámara.",
          "Hasta la banda sonora se avergonzó de eso.",
          "El cursor pasó por encima de mi dolor y lo aprobó.",
        ],
        tails: ["Mi cola de tickets acaba de crecer.", "Eso tenía privilegios de moderador.", "Algún panel de analítica se está partiendo."],
      },
    },
    enemyAttackQuote: {
      grounded: {
        patterns: [
          "Quieto y déjame justificar mi existencia.",
          "Esto es por cada mala idea que has traído a {place}.",
          "Considera esto un peaje pagado en porrazos.",
          "Voy a cobrarte este golpe personalmente cerca de {prop}.",
        ],
        tails: ["Tómatelo con el pecho.", "Esta violencia es muy profesional.", "Prueba a apartarte de forma rentable."],
      },
      fortunate: {
        patterns: [
          "Vamos a ver si tu racha tiene colisiones activadas.",
          "Voy a gastar un milagro pequeño en devolverte el favor.",
          "La sala dice que eres el favorito. Yo digo: agáchate.",
          "Voy a refutar tu plot armor con contacto directo y {gripe}.",
        ],
        tails: ["Espero que la fortuna cubra moratones.", "A mí esto sí me parece justo.", "Narrativamente te lo estabas buscando."],
      },
      uncanny: {
        patterns: [
          "La semilla dice sí y la frame data dice depende.",
          "Estoy cobrando el pity roll que me debe el motor.",
          "El Dev por fin recordó mi animación en {place}.",
          "Este golpe viene patrocinado por balance horrible alrededor de {prop}.",
        ],
        tails: ["Si falla, culpa a la comedia procedural.", "La tabla de encuentros quería contenido.", "Ataco bajo protesta."],
      },
      "clover-cursed": {
        patterns: [
          "El Dev dejó este golpe en la build como advertencia.",
          "Tus privilegios de protagonista van a conocer mi animación barata.",
          "Le he robado este ataque a las notas del parche de mañana.",
          "El motor susurró 'hazlo por el clip' y señaló {prop}.",
        ],
        tails: ["Si entra, culpa a QA.", "Esto lo patrocina la varianza.", "Vamos a probar el seguro dental de tu plot armor."],
      },
    },
    defeatQuote: {
      grounded: {
        patterns: [
          "Dile al corredor que esto no zanja nada.",
          "Esto encaja demasiado bien con mi semana.",
          "Entiérrame con lo que quede de mi dignidad junto a {prop}.",
          "Esto va directo a la rumorología de {place}.",
        ],
        tails: ["Protesto desde el más allá.", "Di al menos que parecía más impresionante desde tu ángulo.", "He tenido turnos mejores."],
      },
      fortunate: {
        patterns: [
          "Me ha ganado una coincidencia con botas.",
          "Ese rebote afortunado trabajó más que cualquiera de nosotros.",
          "Odio perder contra alguien que sigue sorprendido.",
          "Hasta mi caída llegó con conveniencia sospechosa y {gripe}.",
        ],
        tails: ["La fortuna tiene una sonrisa asquerosa.", "Esto necesitaba papeleo.", "Parecía una rifa amañada."],
      },
      uncanny: {
        patterns: [
          "Dile al RNG que esta semilla es fraudulenta.",
          "Las notas del parche llamarán a esto sabor y lo detesto.",
          "Voy a abrir un bug report desde {place}.",
          "Mi epitafio culpará al balance y a {prop}.",
        ],
        tails: ["La analítica debería registrar mi sufrimiento.", "He perdido contra un chiste con presupuesto.", "Esto estaba amañado desde la pantalla de carga."],
      },
      "clover-cursed": {
        patterns: [
          "Esto va directo al despacho del Dev.",
          "Ya puedo ver las métricas celebrándolo.",
          "La sala ha marcado esto como comportamiento previsto y discrepo.",
          "He muerto a manos de un bit. Un bit con {gripe}.",
        ],
        tails: ["Si hay montaje, quiero residuales.", "Esto venía con tooltips.", "El chiste ha golpeado más fuerte que la espada."],
      },
    },
  },
};

const QUOTE_LINE_EXTRAS = {
  en: {
    encounterQuote: {
      grounded: [
        "I was having a perfectly respectable complaint about damp ceilings in {place} until you arrived.",
        "Before this turns violent, know that {prop} was doing fine without your opinion.",
        "Bad news from {place}: you are now the loudest problem in it.",
        "I had just sat down to hate {gripe} in peace.",
      ],
      fortunate: [
        "You walk in glowing like a clerical error and I already resent the paperwork.",
        "The weather over {place} was bad enough before your luck joined the conversation.",
        "You have the look of somebody who wins arguments by surviving them accidentally.",
        "A bird just flew past and booed me. That feels related to you somehow.",
      ],
      uncanny: [
        "I had a whole speech ready, but the RNG is clearly freelancing again.",
        "Breaking news from {place}: local encounter realizes it was generated for content.",
        "If you hear a clicking sound, that is the seed loading contempt.",
        "I was promised a routine shift and instead got patch-note energy in boots.",
      ],
      "clover-cursed": [
        "A fake patch note just floated through {place} and called this matchup 'educational.'",
        "The Dev does not even respect me enough to pretend this is subtle anymore.",
        "I just remembered weather used to be local before your luck turned it cinematic.",
        "Somewhere offscreen, QA muttered 'well, that's going in the reel.'",
      ],
    },
    hurtQuote: {
      grounded: [
        "That interrupted a completely unrelated grudge I was enjoying.",
        "I had just remembered where I left {prop}, and now that thought is gone.",
        "You hit like unpaid rent collected before breakfast.",
        "That was rude enough to become tavern news by dusk.",
      ],
      fortunate: [
        "You looked confused all the way through that and it still worked.",
        "That had the smug rhythm of a coin landing on its edge.",
        "Even the draft in {place} leaned in to help you there.",
        "I dislike how your mistakes keep arriving with excellent timing.",
      ],
      uncanny: [
        "That felt less like a hit and more like a patch being applied to my skeleton.",
        "Wonderful. My bones are now participating in procedural comedy.",
        "The frame data put its thumb on the scale and called it destiny.",
        "I heard a menu click somewhere inside that impact.",
      ],
      "clover-cursed": [
        "You hit me so hard I briefly remembered patch notes that have not been written yet.",
        "The universe just subtitled my pain and I hate the presentation values.",
        "That landed with the confidence of a bug the Dev secretly likes.",
        "A popup in my head just said THIS WOULD HAVE TESTED WELL.",
      ],
    },
    enemyAttackQuote: {
      grounded: [
        "This swing has nothing to do with you and everything to do with my morning.",
        "I blame the weather, the floor plan, and then your ribs.",
        "You happened to be standing where my patience ran out.",
        "This is what passes for customer service in {place}.",
      ],
      fortunate: [
        "If luck can improvise for you, it can improvise around this hit too.",
        "I am not trying to win, merely to worsen your travel story.",
        "This blow is dedicated to every coin toss that kept choosing your side.",
        "You look like the kind of person who should be charged extra for surviving.",
      ],
      uncanny: [
        "Tonight's forecast for {place}: resentment with a chance of frame-perfect violence.",
        "The seed wanted a dramatic beat, and unfortunately I am the prop with elbows.",
        "I am attacking because the algorithm said the scene lacked texture.",
        "This move tested well with focus groups composed entirely of liars.",
      ],
      "clover-cursed": [
        "Current events update: my attack animation has achieved sentience and demands screen time.",
        "The Dev called this move 'good enough for shipping' and now we both suffer for it.",
        "This strike is sponsored by cursed variance and one overworked intern.",
        "If this lands, the weather in {place} will start acting smug about it.",
      ],
    },
    defeatQuote: {
      grounded: [
        "If anyone asks, tell them I lost because the floor was morally against me.",
        "Please water {prop} for me. It has seen too much.",
        "I had more to say, but apparently dying is very schedule-intensive.",
        "Put in the papers that I opposed {gripe} to the end.",
      ],
      fortunate: [
        "I lost to someone who still looks like they need the controls explained.",
        "This is what happens when coincidence gets union protections.",
        "Tell fortune I said this outcome had ugly handwriting.",
        "I hope a witness writes this down badly enough to spare my reputation.",
      ],
      uncanny: [
        "Please tell the coroner this was caused by narrative tampering.",
        "Some invisible producer just yelled 'great take' over my last breath.",
        "I am dying in a way that suggests the engine has favorites.",
        "File this under weather, sabotage, and suspiciously polished comedy.",
      ],
      "clover-cursed": [
        "I would complain to the Dev, but this feels like the sort of note they would frame.",
        "The postmortem is going to call this 'fun emergent texture,' and I refuse.",
        "I can already hear a stream chat inventing nicknames for this death.",
        "Please log that I was defeated by vibes, tooltips, and one extremely committed bit.",
      ],
    },
  },
  es: {
    encounterQuote: {
      grounded: [
        "Yo estaba teniendo una queja perfectamente seria sobre el techo humedo de {place} hasta que llegaste.",
        "Antes de que esto se vuelva violento, que conste que {prop} estaba mejor sin tu criterio.",
        "Ultima hora en {place}: ahora tu eres el problema mas ruidoso.",
        "Justo me habia sentado a odiar {gripe} en paz.",
      ],
      fortunate: [
        "Llegas brillando como error administrativo y ya me imagino el papeleo.",
        "Bastante feo estaba el clima en {place} como para que encima aparezca tu suerte.",
        "Tienes pinta de ganar discusiones sobreviviendolas de casualidad.",
        "Paso un pajaro, me abucheo y sospecho que fue culpa tuya.",
      ],
      uncanny: [
        "Yo tenia un discurso listo, pero el RNG vuelve a hacer extras sin cobrar.",
        "Flash de noticias desde {place}: un encuentro local descubre que fue generado por contenido.",
        "Si oyes un chasquido, es la semilla cargando desprecio.",
        "Me prometieron un turno tranquilo y en vez de eso llego energia de notas del parche con botas.",
      ],
      "clover-cursed": [
        "Acaba de pasar una nota del parche falsa por {place} y llamo a esto 'didactico'.",
        "El Dev ya ni me respeta lo bastante como para fingir que esto es sutil.",
        "Justo recorde cuando el clima era local, antes de que tu suerte lo volviera cinematografico.",
        "En algun lado QA acaba de murmurar 'si, esto va al compilado'.",
      ],
    },
    hurtQuote: {
      grounded: [
        "Eso interrumpio un rencor totalmente ajeno que yo estaba disfrutando.",
        "Justo habia recordado donde deje {prop} y ahora esa idea se murio.",
        "Pegas como alquiler atrasado cobrado antes del desayuno.",
        "Eso fue tan grosero que va a ser noticia de taberna antes de la noche.",
      ],
      fortunate: [
        "Tenias cara de no entender nada y aun asi te salio bien.",
        "Eso tuvo el ritmo arrogante de una moneda cayendo de canto.",
        "Hasta la corriente de aire de {place} se inclino para ayudarte.",
        "Me molesta lo bien que les salen tus errores.",
      ],
      uncanny: [
        "Eso se sintio menos como golpe y mas como parche aplicado al esqueleto.",
        "Estupendo. Mis huesos ahora participan en comedia procedural.",
        "La frame data metio el pulgar en la balanza y lo llamo destino.",
        "Juro que escuche un clic de menu dentro de ese impacto.",
      ],
      "clover-cursed": [
        "Me pegaste tan fuerte que recorde notas del parche que todavia no existen.",
        "El universo acaba de subtitular mi dolor y detesto la produccion.",
        "Eso impacto con la confianza de un bug que al Dev le cae simpatico.",
        "Me acaba de saltar un cartel mental que dice ESTO TESTEO BIEN.",
      ],
    },
    enemyAttackQuote: {
      grounded: [
        "Este golpe no tiene tanto que ver contigo como con mi manana.",
        "Yo le echo la culpa al clima, al plano y despues a tus costillas.",
        "Tuviste la mala suerte de estar parado donde se me acabo la paciencia.",
        "Asi es como se entiende la atencion al cliente en {place}.",
      ],
      fortunate: [
        "Si la suerte improvisa para ti, tambien puede improvisar alrededor de este golpe.",
        "No intento ganar; apenas intento empeorar tu relato del viaje.",
        "Este porrazo va dedicado a cada moneda al aire que te eligio a vos.",
        "Tienes pinta de persona a la que deberian cobrarle extra por sobrevivir.",
      ],
      uncanny: [
        "Pronostico para {place}: resentimiento con chances de violencia frame-perfect.",
        "La semilla queria un momento dramatico y lamentablemente yo soy el accesorio con codos.",
        "Ataco porque el algoritmo dijo que a la escena le faltaba textura.",
        "Este movimiento testeaba bien con focus groups integrados por mentirosos.",
      ],
      "clover-cursed": [
        "Boletin de ultima hora: mi animacion de ataque ya tiene conciencia y exige tiempo en pantalla.",
        "El Dev llamo a este golpe 'suficientemente listo para salir' y ahora los dos pagamos el precio.",
        "Este ataque lo patrocina la varianza maldita y un pasante agotado.",
        "Si esto entra, hasta el clima de {place} se va a poner sobrador.",
      ],
    },
    defeatQuote: {
      grounded: [
        "Si preguntan, di que perdi porque el piso estaba moralmente en mi contra.",
        "Por favor regale agua a {prop}. Ha visto demasiado.",
        "Tenia mas para decir, pero morirse consume una barbaridad de agenda.",
        "Que conste en actas que me opuse a {gripe} hasta el final.",
      ],
      fortunate: [
        "Perdi contra alguien que todavia parece necesitar el manual.",
        "Asi termina todo cuando la coincidencia consigue respaldo sindical.",
        "Dile a la fortuna que este resultado tenia una letra espantosa.",
        "Ojala algun testigo lo cuente mal y me salve la reputacion.",
      ],
      uncanny: [
        "Por favor dile al forense que esto fue manipulacion narrativa.",
        "Alguna produccion invisible acaba de gritar 'gran toma' encima de mi ultimo suspiro.",
        "Me estoy muriendo de una forma que sugiere favoritismos del motor.",
        "Archivalo bajo clima, sabotaje y comedia demasiado bien lustrada.",
      ],
      "clover-cursed": [
        "Se lo reclamaria al Dev, pero esto tiene demasiada pinta de nota que enmarcaria.",
        "El postmortem va a llamar a esto 'textura emergente divertida' y me niego.",
        "Ya puedo oir un chat inventando apodos para esta muerte.",
        "Deja asentado que me derroto un clima raro, tooltips y un chiste peligrosamente comprometido.",
      ],
    },
  },
};

function replaceTemplate(text, values) {
  return text.replace(/\{([^}]+)\}/g, (_, key) => `${values[key] ?? ""}`);
}

function buildMonsterQuoteLibrary(localeId) {
  const localeTemplates = QUOTE_TEMPLATES[localeId];
  const profiles = MONSTER_PROFILES[localeId];
  const localeExtras = QUOTE_LINE_EXTRAS[localeId] || {};
  return Object.fromEntries(
    Object.entries(profiles).map(([monsterId, profile]) => [
      monsterId,
      Object.fromEntries(
        Object.entries(localeTemplates).map(([category, tiers]) => [
          category,
          Object.fromEntries(
            Object.entries(tiers).map(([tierKey, config]) => {
              const directLines = (localeExtras[category]?.[tierKey] || []).map((line) => replaceTemplate(line, profile));
              const composedLines = config.patterns.flatMap((pattern) =>
                config.tails.map((tail) => replaceTemplate(`${pattern} ${tail}`, profile))
              );
              return [tierKey, [...new Set([...directLines, ...composedLines])]];
            })
          ),
        ])
      ),
    ])
  );
}

export const dialogueResources = Object.fromEntries(SUPPORTED_LOCALES.map((locale) => [locale, localeSkeleton()]));

dialogueResources.en = {
  labels: {
    luckyFindTitle: "Lucky Find!",
  },
  lootPrefixes: {
    road: "Found roadside loot:",
    drop: "Loot dropped:",
    default: "Found loot:",
  },
  library: {},
  monsterQuotes: buildMonsterQuoteLibrary("en"),
};

dialogueResources.es = {
  labels: {
    luckyFindTitle: "¡Hallazgo con Suerte!",
  },
  lootPrefixes: {
    road: "Botín encontrado en el camino:",
    drop: "Botín soltado:",
    default: "Botín encontrado:",
  },
  library: {
    attackNarration: {
      grounded: ["Golpeas a {target} por {damage}. {quote}", "Le clavas un golpe a {target} por {damage}. {quote}", "Alcanzas a {target} por {damage}. {quote}", "Descargas el arma sobre {target} por {damage}. {quote}"],
      fortunate: ["Casi pierdes el hilo y aun así rozas a {target} por {damage}. {quote}", "Peleas como un accidente con suerte y aun así metes {damage} a {target}. {quote}", "Un tropiezo convenientísimo se convierte en {damage} sobre {target}. {quote}", "Pegas primero, entiendes después y {target} se come {damage}. {quote}"],
      uncanny: ["Tropiezas con la probabilidad misma y le grabas {damage} a {target}. {quote}", "Tu ataque llega con un timing sospechosamente perfecto y coloca {damage} a {target}. {quote}", "Haces algo que los expertos llamarían tontería efectiva y {target} sufre {damage}. {quote}", "Una secuencia de torpeza y suerte excelente revienta a {target} por {damage}. {quote}"],
      "clover-cursed": ["Empiezas fallando por completo, rebotas contra el destino y estampas {damage} en {target}. {quote}", "El universo archiva tu torpeza como crítico cósmico y {target} recibe {damage}. {quote}", "Atacas como una errata, el motor asiente y {target} se lleva {damage}. {quote}", "Una caída bendita por los santos se reescribe sola en {damage} para {target}. {quote}"],
    },
    enemyAttackNarration: {
      grounded: ["{attacker} te golpea por {damage}. {quote}", "{attacker} te alcanza por {damage}. {quote}", "{attacker} te mete un buen {damage}. {quote}", "{attacker} te sacude por {damage}. {quote}"],
      fortunate: ["{attacker} te cuela un {damage} muy satisfecho entre tu suerte. {quote}", "{attacker} coloca {damage} justo cuando la fortuna se va a fumar. {quote}", "{attacker} logra {damage} a pesar de tu sospechosa protección narrativa. {quote}", "{attacker} te rasca {damage} por entre tus payasadas con suerte. {quote}"],
      uncanny: ["{attacker} cobra una tirada hostil y te deja {damage}. {quote}", "{attacker} rebota en un barril, una pared y tu orgullo para meterte {damage}. {quote}", "{attacker} te entrega {damage} directamente a la cara con apoyo del motor. {quote}", "{attacker} tramita {damage} con dolor burocráticamente aprobado. {quote}"],
      "clover-cursed": ["{attacker} cruza tres cortes de cámara que el motor jura que son justos y te factura {damage}. {quote}", "{attacker} arma las notas del parche y te coloca {damage}. {quote}", "{attacker} llega como un error de render que el Dev olvidó ocultar y deja {damage}. {quote}", "{attacker} te sacude con un desastre procedural digno de clip por {damage}. {quote}"],
    },
    defeatNarration: {
      grounded: ["{foe} queda derrotado. {quote}", "{foe} cae y ya no se levanta. {quote}", "{foe} se derrumba bajo la presión. {quote}", "{foe} queda fuera de combate. {quote}"],
      fortunate: ["{foe} cae por una cadena de sucesos demasiado conveniente. {quote}", "{foe} pierde la discusión con tu suerte y se desploma. {quote}", "{foe} es derrotado por un golpe que no debería haber salido tan bien. {quote}", "{foe} se dobla cuando la fortuna mete la mano. {quote}"],
      uncanny: ["{foe} cae cuando el universo se toma demasiado en serio tu chiste. {quote}", "{foe} es derrotado cuando la fortuna decide que la sutileza está sobrevalorada. {quote}", "{foe} se desarma bajo un incidente probabilístico muy teatral. {quote}", "{foe} pierde contra una cadena de eventos auditada por el caos. {quote}"],
      "clover-cursed": ["{foe} se desploma bajo una lluvia catastrófica de suerte absurda. {quote}", "{foe} cae derrotado por una rutina cómica con filo. {quote}", "{foe} queda recortado de la escena por fortuna maldita. {quote}", "{foe} es retirado del servicio activo por un milagro rarísimo. {quote}"],
    },
    monsterNarration: {
      grounded: ["{monster} emerge de la oscuridad. {quote}", "{monster} entra en el resplandor de la lámpara. {quote}", "{monster} aparece con ganas de problemas. {quote}", "{monster} se adueña del cuarto con seguridad hostil. {quote}"],
      fortunate: ["{monster} aparece como si tu suerte hubiera pedido un supervisor. {quote}", "{monster} dobla la esquina ofendido por tus bendiciones. {quote}", "{monster} llega justo a tiempo para complicar tu racha. {quote}", "{monster} entra con la energía de un problema que tu suerte culpará al clima. {quote}"],
      uncanny: ["{monster} aparece como si la sala acabara de perder una discusión con el RNG. {quote}", "{monster} entra como si la tabla de encuentros pidiera atención. {quote}", "{monster} llega con mala leche procedural y una frase preparada. {quote}", "{monster} surge exactamente donde el algoritmo creyó que sería más gracioso. {quote}"],
      "clover-cursed": ["Qué suerte la tuya. Del vaho emerge un campeón maldito por el trébol: {monster}. {quote}", "Tropiezas con una raíz arcoíris y desbloqueas al peor invitado posible: {monster}. {quote}", "La fortuna guiña, la sala gime y {monster} entra como una rareza de taberna. {quote}", "La mazmorra tira un desastre natural y lo llama {monster}. {quote}"],
    },
    lootNarration: {
      grounded: ["{prefix} {item} [{rarity}] por unos {value}g.", "{prefix} {item} [{rarity}] rondando los {value}g.", "{prefix} {item} [{rarity}] y debería valer cerca de {value}g."],
      fortunate: ["La fortuna empuja {item} [{rarity}] hasta tus manos. Ponle {value}g.", "{prefix} {item} [{rarity}], aparentemente porque la suerte hoy habla mucho. Unos {value}g.", "Una coincidencia pulcra te deja {item} [{rarity}] por cerca de {value}g."],
      uncanny: ["Tropiezas con absolutamente nada y aun así descubres {item} [{rarity}] por unos {value}g.", "Una ráfaga muy impropia de fortuna te estampa {item} [{rarity}] en los brazos. Unos {value}g.", "La sala archiva mal un milagro y sales con {item} [{rarity}] por {value}g."],
      "clover-cursed": ["Una coincidencia con forma de trébol deja {item} [{rarity}] justo en tu camino. Grita {value}g.", "La mazmorra tose {item} [{rarity}] como si el Dev hubiera tocado la columna equivocada. Unos {value}g.", "La realidad da hipo y te deja {item} [{rarity}] a los pies por cerca de {value}g."],
    },
    travelNarration: {
      quiet: { grounded: ["El camino está en silencio.", "El camino solo ofrece barro, viento y una paz sospechosa.", "Nada te sigue salvo aire húmedo y violines lejanos."], fortunate: ["El camino se calma, como si la suerte hubiera archivado el peligro en otro sitio.", "El sendero se porta bien, lo cual ya parece personal.", "Hasta los baches cooperan por un momento."], uncanny: ["El camino se comporta con tanta cortesía que da miedo.", "El sendero se calla como un chiste justo antes del remate.", "Todo está tan tranquilo que parece sospechosamente procedural."], "clover-cursed": ["El camino se queda tan quieto que puedes oír a la probabilidad carraspear.", "No pasa nada, pero el paisaje parece saber un secreto.", "El camino está inmóvil. En alguna parte el motor está girando una manivela."] },
      potion: { grounded: ["Un viajero te entrega un tónico.", "Un extraño del camino te deja una botella y sigue andando.", "Alguien dona una botella y se niega a explicarlo."], fortunate: ["Un transeúnte te confunde con el destino y te entrega un tónico.", "Un tónico cae en tu día con una conveniencia obscena.", "Un viajero decide que tu suerte parece mal financiada y comparte botella."], uncanny: ["Una tía ambulante te confunde con el destino y te lanza un tónico al bolsillo.", "El camino produce un tónico como si quisiera mantener vivo el chiste.", "Un desconocido sale por la izquierda después de lanzarte un tónico con timing perfecto."], "clover-cursed": ["Un tónico entra en tu inventario tan de golpe que parece aprobado por el universo.", "Aparece un viajero, te da un tónico y desaparece como rumor de pantalla de carga.", "El camino genera un evento de tónico sin respetar la plausibilidad."] },
      loss: { grounded: ["Un bache hace volar {item} del carro.", "{item} se suelta y desaparece en el barro.", "Un mal golpe lanza {item} directo a la cuneta."], fortunate: ["La suerte se va a tomar café y {item} desaparece en una zanja.", "Un bache muy concreto expulsa {item} de tu custodia.", "El camino te cobra impuesto y acepta {item} como pago."], uncanny: ["Un bache se abre como una boca codiciosa y engulle {item}.", "El carro golpea una piedra teatral y {item} dimite del viaje.", "La carretera ejecuta un robo slapstick y se queda con {item}."], "clover-cursed": ["{item} es reclamado por un bache con intención narrativa clarísima.", "La cuneta edita {item} fuera de la continuidad.", "Una zanja mira {item} una vez y decide que ahora es botín suyo."] },
      none: { grounded: ["No pasa nada digno de recuerdo en el camino.", "La vuelta es tan tranquila que casi ofende.", "El camino se abstiene de inventarte un problema por una vez."], fortunate: ["No pasa nada, que ya es una bendición pequeñita.", "El camino decide no escalarte la vida durante unos minutos.", "Ni el destino tiene ganas de improvisar aquí."], uncanny: ["No pasa nada, y a este nivel de suerte eso ya parece raro.", "El camino transcurre sin incidentes y el silencio se siente escenificado.", "No se activa ningún evento, aunque el paisaje claramente se lo planteó."], "clover-cursed": ["No pasa nada, que curiosamente es el evento más raro disponible.", "El camino decide guardar el chiste para más tarde y no te fías nada.", "Cae un silencio con textura de pantalla de carga."] },
    },
    trapNarration: {
      grounded: { live: ["Una trampa salta y te hace {damage}.", "Herrajes ocultos te clavan {damage}.", "Una pieza de ingeniería bastante cutre te raspa {damage}."], fatal: ["La trampa te remata con {damage}.", "Una última puñalada de malicia te mete {damage} y te deja en el suelo.", "La trampa se lleva el resto con {damage}."] },
      fortunate: { live: ["Una trampa te roza por {damage}, molesta con tu suerte.", "La sala se cobra una pequeña victoria y te factura {damage}.", "Un mecanismo oculto te engancha por {damage} y mala leche."], fatal: ["La trampa cobra de golpe todos los favores que te debía la fortuna y te hace {damage}.", "La sala por fin gana una discusión y cuesta {damage}.", "Un mecanismo desagradable te mete {damage} y tu suerte deja de negociar."] },
      uncanny: { live: ["Una ridícula cadena de escombros afortunados te roza por {damage}.", "La trampa se dispara como slapstick con esquinas afiladas y te hace {damage}.", "Un montaje de herrajes teatrales te araña {damage}."], fatal: ["Una lluvia de trastos, estantes malditos y mal timing te mete {damage} y cierra la partida.", "La sala se toma demasiado en serio un chiste y te aplasta por {damage}.", "Una secuencia de peligros exagerada aterriza {damage} con entusiasmo hostil."] },
      "clover-cursed": { live: ["Una lluvia de herrajes afortunados, monedas rebotando y un barril grosero te raspa {damage}.", "La trampa entra como una acotación de escenario y te cobra {damage}.", "Un problema de física con rencor te asesta {damage}."], fatal: ["Una lluvia de herrajes afortunados, estantes de monedas y un barril maldito te aplasta por {damage}.", "La mazmorra gana un premio al timing cómico y te mete {damage} directamente en el futuro.", "Una catástrofe de utilería te suelta {damage} y te manda fuera bajo protesta."] },
    },
    deathNarration: {
      trap: { grounded: ["La trampa te remata.", "La sala se queda en silencio alrededor de tus restos.", "La mazmorra se queda con la última palabra."], fortunate: ["La trampa se queda con la última risa y resulta mezquina.", "La fortuna extravía tus papeles y la trampa cobra.", "La sala reúne todos tus milagros anteriores y te los factura a la vez."], uncanny: ["La trampa gana de una forma que sonará falsa cuando la cuenten.", "Una cadena demasiado dramática de mala suerte redacta el obituario.", "La sala convierte tu impulso en una anécdota preventiva."], "clover-cursed": ["Te aplasta una avalancha de monedas celebratorias. Suertudo, técnicamente.", "La mazmorra te entierra en un milagro con modales pésimos.", "Una lluvia de disparates afortunados termina el trabajo y lo llama bendición."] },
      flee: { grounded: ["Mueres mientras huyes.", "No sales entero de esta.", "La huida se desmorona en el peor momento."], fortunate: ["Casi escapas. Casi no es un término médico.", "La retirada se deshace de un modo que el destino llamará gracioso.", "Tu estrategia de salida desarrolla carácter y luego te mata."], uncanny: ["La fuga fracasa con ironía suficiente para alimentar rumores semanas.", "Huyes justo hasta el punto donde la suerte deja de colaborar.", "Tu retirada se convierte en anuncio de servicio público sobre la soberbia."], "clover-cursed": ["Escapas de la pelea, pero no de la estampida de caos afortunado que viene detrás.", "La salida funciona hasta que la fortuna la convierte en homicidio slapstick.", "Casi abandonas la escena antes de que el destino le haga una zancadilla a la idea."] },
      combat: { grounded: ["Has muerto.", "La pelea termina mal y del todo.", "Aquí es donde la partida se queda sin cuerda."], fortunate: ["La suerte se encoge de hombros, se aparta y deja pasar el golpe.", "La pelea cobra de golpe todos los casi fallos anteriores.", "Pierdes la bronca y la discusión con el destino."], uncanny: ["Ganas el obituario más raro del pueblo cuando la pelea finalmente gira.", "La batalla cierra como un remate grosero.", "La partida se pliega con drama suficiente para atraer narrador."], "clover-cursed": ["{foe} remata la faena mientras la fortuna vuelve la escena teatro absurdo.", "La pelea termina con la realidad sobreactuando y tu suerte boca abajo.", "El universo escribe una tragedia slapstick alrededor de tu último punto de vida."] },
    },
    emptyRoomNarration: {
      grounded: ["{baseText}", "{baseText}", "{baseText}"],
      fortunate: ["{baseText} La suerte ya pasó por aquí antes que tú.", "{baseText} La sala sigue con cara de enterada.", "{baseText} Incluso vacía, parece satisfecha consigo misma."],
      uncanny: ["La sala está vacía salvo por la ruidosa sensación de que la suerte acaba de gastarte una broma.", "No hay nada aquí salvo una brisa sospechosa y el sonido engreído de la fortuna riéndose.", "La cámara está vacía y, aun así, se siente más teatral que útil.", "La sala no guarda tesoro, solo el regusto de un chiste con tu nombre."],
      "clover-cursed": ["La sala está vacía, pero la iluminación sugiere que el Dev esperaba reacción.", "No hay nada aquí salvo una brisa, una pausa y la sensación de que la realidad preparó un callback.", "La cámara ha sido saqueada por el destino o por un cómico con llaves.", "No encuentras tesoro, solo la certeza inquietante de que la sala cree que esto tiene muchísima gracia."],
    },
  },
  monsterQuotes: buildMonsterQuoteLibrary("es"),
};

dialogueResources["pt-BR"] = {
  labels: {
    luckyFindTitle: "Achado Sortudo!",
  },
  lootPrefixes: {
    road: "Saque achado na estrada:",
    drop: "Saque derrubado:",
    default: "Saque encontrado:",
  },
  library: {},
  monsterQuotes: {},
};

dialogueResources.ja = {
  labels: {
    luckyFindTitle: "ラッキー発見！",
  },
  lootPrefixes: {
    road: "道端で見つけた戦利品:",
    drop: "落とした戦利品:",
    default: "見つけた戦利品:",
  },
  library: {},
  monsterQuotes: {},
};

function getLocaleChainValues(localeId, accessor) {
  for (const currentLocale of getLocaleChain(localeId)) {
    const value = accessor(dialogueResources[currentLocale]);
    if (value !== undefined) return value;
  }
  return undefined;
}

export function getDialogueEntries(localeId, category, tierKey, fallbackLibrary) {
  const localized = getLocaleChainValues(localeId, (resource) => resource?.library?.[category]?.[tierKey]);
  if (Array.isArray(localized) && localized.length > 0) return localized;
  return fallbackLibrary[category][tierKey];
}

export function getMonsterDialogueEntries(localeId, monsterId, category, tierKey, fallbackEntries) {
  const localized = getLocaleChainValues(
    localeId,
    (resource) => resource?.monsterQuotes?.[monsterId]?.[category]?.[tierKey]
  );
  if (Array.isArray(localized) && localized.length > 0) return localized;
  return fallbackEntries;
}

export function getNestedDialogueEntries(localeId, category, key, tierKey, fallbackLibrary) {
  const localized = getLocaleChainValues(
    localeId,
    (resource) => resource?.library?.[category]?.[tierKey]?.[key]
  );
  if (Array.isArray(localized) && localized.length > 0) return localized;
  return fallbackLibrary[category][tierKey][key];
}

export function getDialogueLabel(localeId, key, fallback) {
  return getLocaleChainValues(localeId, (resource) => resource?.labels?.[key]) || fallback;
}

export function getLootPrefixLabel(localeId, source, fallback) {
  return (
    getLocaleChainValues(localeId, (resource) => resource?.lootPrefixes?.[source]) ||
    getLocaleChainValues(localeId, (resource) => resource?.lootPrefixes?.default) ||
    fallback
  );
}
