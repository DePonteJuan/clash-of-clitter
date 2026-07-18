const STORAGE_KEY = "coc-evolution-planner-lang";
const GT_LANG_KEY = "coc-evolution-planner-gt-lang";

/** @type {Record<string, Record<string, string>>} */
export const LOCALES = {
  es: {
    name: "Español",
    title: "Clash of Critters — Planeador de evoluciones",
    description:
      "Planea el orden de evoluciones de tus Tatari. Datos del wiki, progreso guardado en tu navegador.",
    brand: "Clash of Critters",
    heroSub:
      "Planeador de evoluciones Tatari: marca lo que tienes, mira qué falta para el siguiente nivel y ordena tus prioridades.",
    wikiUpdated: "Datos del wiki actualizados:",
    langLabel: "Idioma",
    moreLangs: "Más idiomas…",
    moreLangsHint:
      "Los trials del wiki se traducen solos en Español/Português. Usa esto para otros idiomas.",
    searchLang: "Buscar idioma…",
    noLangMatch: "Sin coincidencias",
    tabCatalog: "Catálogo",
    tabPlanned: "Planeados",
    tabTeam: "Equipo",
    tabUtils: "Utilidades",
    pageOf: "Página {cur} de {total}",
    utilPager: "Páginas de utilidades",
    utilTypes: "Tipos",
    utilFeed: "Alimentar",
    utilCollection: "Colección",
    utilPriority: "Prioridad",
    utilMinigames: "Minijuegos",
    typesIntro:
      "Pentágono elemental: ventaja ~200% y desventaja ~50% (dato de comunidad/wiki).",
    typesStrong: "Fuerte contra",
    typesWeak: "Débil contra",
    typesEnemyTitle: "Si el enemigo es… lleva",
    collectionIntro: "Tienes {have} de {total} líneas ({pct}%).",
    collectionGlobal: "Colección global",
    collectionOwnGoals: "Own-goals pendientes",
    collectionMissing: "Aún te faltan",
    collectionComplete: "¡Colección completa!",
    feedIntro: "Máximo {limit} alimentaciones al día (reset a medianoche local).",
    feedStage: "Etapa",
    feedPoints: "Puntos",
    feedGrade: "Grade",
    feedNeedsB: "Necesitan grade B (trial o Rainbow)",
    feedOwnedTitle: "Tus Tatari",
    feedNoOwned: "Marca Tatari como “Lo tengo” para registrar grade/etapa.",
    priorityIntro: "Owned con evolución pendiente, ordenados por tier de comunidad.",
    priorityDisclaimer:
      "Los tiers son meta de guías externas, no oficiales. Úsalos como orientación.",
    priorityEmpty: "No hay owned con evolución pendiente.",
    minigamesIntro:
      "Trials de minijuegos pendientes en tus owned (o solo los del plan).",
    miniPlanOnly: "Solo planeados",
    minigamesEmpty: "Sin trials de minijuegos pendientes.",
    mini_snowboard: "Snowboard / boards",
    mini_farm: "Cozy Farm",
    mini_fishing: "Pesca",
    mini_treasure: "Treasure Hunt",
    mini_zobo: "Zobo / Island",
    mini_island: "Island Gold",
    mini_pinball: "Pinball",
    mini_other: "Otros minijuegos",
    cost_boards: "Boards",
    cost_fertilizer: "Fertilizer",
    cost_rods: "Cañas",
    cost_energy: "Energy drinks",
    cost_pickaxes: "Picos",
    cost_treasure: "Tesoros",
    cost_pinballs: "Pinballs",
    cost_bullets: "Bullet coins",
    teamIntro:
      "Elige el modo: el tablero refleja el grid real (carriles × filas). Arriba pelean los Zobos; abajo está tu base.",
    teamFieldLabel: "Campo de batalla",
    teamFieldEnemies: "Enemigos (Zobos)",
    teamFieldBase: "Tu base",
    teamLane: "C{n}",
    teamDeployCount: "Despliegue: {have}/{max} · {cols} carriles",
    teamWarnRowEmpty: "Fila vacía: {row}",
    teamRow_front: "Frente",
    teamRow_mid: "Medio",
    teamRow_back: "Atrás",
    teamRowHint_front: "Absorben el golpe",
    teamRowHint_mid: "Daño / control",
    teamRowHint_back: "Zona segura",
    teamModeLabel: "Modo",
    teamMode_early: "Cap. 1–3",
    teamMode_campaign: "Campaña",
    teamMode_invasion: "Invasión",
    teamMode_boss: "Jefe",
    teamMode_dojo: "Dojo",
    teamModeBlurb_early:
      "Capítulos 1–3: grid 3×3 (9 Tatari). Cada carril: holder delante, daño al medio, utilidad atrás.",
    teamModeBlurb_campaign:
      "Campaña (cap. 4+): 5 carriles × 3 filas = 15 Tatari. Cada carril necesita supervivencia + daño + flex.",
    teamModeBlurb_invasion:
      "Horde Invasion: cada jugador despliega hasta 15 (mismo 5×3). Con la pareja sumáis cobertura; no hay evidencia fiable de un tope de 10.",
    teamModeBlurb_boss:
      "Boss Challenge: 15 en 5 carriles. Encaja el elemento del jefe; reparte daño si teletransporta o quita unidades.",
    teamModeBlurb_dojo:
      "Badge Dojo: pelea 5v5 (solo 5 Tatari). Posición y rango importan más que en campaña.",
    teamSlot_front: "Tank",
    teamSlot_holder: "Hold",
    teamSlot_carry: "Carry",
    teamSlot_damage: "DPS",
    teamSlot_support: "Heal",
    teamSlot_util: "Util",
    teamSlot_flex: "Flex",
    teamSlot_flex2: "Flex",
    teamSlot_wave: "AoE",
    teamSlot_control: "CC",
    teamSlot_aura: "Aura",
    teamSlot_burst: "Burst",
    teamSlot_buffer: "Heal",
    teamSlot_utility: "Util",
    teamSlotAny: "Cualquiera",
    teamEnemyType: "Tipo enemigo (ventaja)",
    teamZoboTitle: "Zobos por carril (hasta 3 tipos)",
    teamZoboHint:
      "Marca los elementos de la oleada en cada carril. Las casillas se colorean según ventaja/desventaja.",
    teamZoboEmpty: "—",
    teamZoboAdd: "Añadir tipo de Zobo",
    teamZoboRemove: "Quitar tipo",
    teamPick: "Elegir",
    teamChange: "Cambiar",
    teamPickerTitle: "Elegir Tatari",
    teamPickerFor: "Slot: {slot}",
    teamPickerEmpty: "No hay owned con esos filtros. Márcalos en el catálogo.",
    teamAlreadyIn: "Ya en equipo",
    teamAuras: "Auras",
    teamNoAuras: "Sin auras en el equipo (suelen estar en formas finales).",
    teamWarnSlot: "Falta rellenar: {slot}",
    teamWarnRole: "{slot}: mejor un {role}",
    teamWarnAura: "Ningún slot aporta Aura (útil en Invasión/Dojo)",
    teamLooksGood: "Estructura del modo cubierta.",
    skillName: "Skill",
    plannedActivity: "Actividad",
    plannedActivityEmpty:
      "Ningún planeado tiene trials pendientes de esa actividad.",
    objCatFeed: "Alimentar / stats",
    objCatMinigame: "Minijuegos",
    objCatCraft: "Bento / fabricar",
    objCatTeam: "Mismo equipo",
    objCatOwn: "Tener Tatari ★",
    objCatOther: "Otros",
    starsNeed: "Faltan {n}★ ({cur}/{req})",
    ownProgress: "Poseer {type} {stars}★: {have}/{need}",
    search: "Buscar",
    searchPlaceholder: "Sealing, Frostnip…",
    type: "Tipo",
    role: "Rol",
    all: "Todos",
    rarity: "Rareza base",
    allRarities: "Todas las rarezas",
    ownership: "Posesión",
    ownershipAll: "Todas",
    ownershipYes: "Las que tengo",
    ownershipNo: "Las que no tengo",
    readyOnly: "Solo listos",
    sort: "Orden",
    sortName: "Nombre A–Z",
    sortStarsDesc: "Estrellas ↓",
    sortStarsAsc: "Estrellas ↑",
    lines: "{n} línea",
    lines_plural: "{n} líneas",
    updateStarsView: "Actualizar estrellas (vista)",
    ownAll: "Tengo todos",
    exportProgress: "Exportar progreso",
    import: "Importar",
    plannedIntro:
      "Lo que quieres mejorar y qué te falta para la siguiente evolución.",
    updateStars: "Actualizar estrellas",
    footerWiki: "Datos desde",
    footerLocal:
      "Tu progreso se guarda solo en este navegador (localStorage), sin servidor.",
    iHaveIt: "Lo tengo",
    seeDetails: "Ver detalles",
    ready: "Listo",
    chooseForm: "Elegir {name}",
    markOwnedNext: "Marca “Lo tengo” para ver el siguiente paso.",
    lineComplete: "Línea completa. No hay más evoluciones.",
    noTrialWiki: "Sin trial listado en el wiki (solo estrellas).",
    starsNoWiki: "Estrellas: sin dato en el wiki",
    starsProgress: "{cur} / {req} estrellas",
    next: "Siguiente:",
    markOwnedDetails: "Marca esta línea como “Lo tengo” en detalles.",
    evoComplete: "Evolución completa.",
    starsWikiMissing: "Estrellas: el wiki no tiene el umbral exacto.",
    starsHaveNeed:
      "Estrellas: tienes {cur}, faltan {need} (objetivo {req})",
    noTrialsListed:
      "Sin trials listados (solo estrellas o dato pendiente en el wiki).",
    currentForm: "Forma actual",
    stars: "Estrellas",
    hintPickForm: "Toca una forma de la cadena para indicar cuál tienes.",
    removeFromPlan: "Quitar del plan",
    addToPlan: "Añadir al plan",
    wiki: "Wiki",
    emptyFilters: "Nada coincide con los filtros.",
    emptyPlan: "Aún no hay nada en el plan.",
    emptyPlanHint: "Ve al catálogo y añade Tatari con “Ver detalles”.",
    goCatalog: "Ir al catálogo",
    notMarkedOwned: "Sin marcar como tuyo",
    complete: "completa",
    readyShort: "listo",
    wizardDone: "Listo",
    wizardDoneBody: "Ya pasaste por todos los Tatari de esta ronda.",
    close: "Cerrar",
    lineLabel: "Línea {id} · ahora {stars}★",
    currentLook: "Aspecto actual",
    keepSame: "Se queda igual",
    hasMoreStars: "Tiene más estrellas",
    newStars: "Nuevas",
    saveContinue: "Guardar y seguir",
    skip: "Saltar",
    noVisibleOwned:
      "No hay Tatari “Lo tengo” en la vista actual. Ajusta filtros (ej. tipo Fuego) o márcalos como tuyos.",
    noWizardQueue:
      "No hay Tatari para actualizar. Añade alguno al plan o marca “Lo tengo” en el catálogo.",
    ownAllConfirm:
      "¿Marcar todos los Tatari del catálogo como “Lo tengo”? No borra estrellas ni trials que ya tengas.",
    importFail: "No se pudo importar ese archivo.",
    loadFail: "No se pudo cargar data/evolutions.json ({msg}).",
    loadingTitle: "Cargando…",
    loadingData: "Preparando datos del wiki",
    loadingTranslate: "Traduciendo trials del wiki…",
    loadingReady: "Listo",
    notFound: "No se encontró esta línea.",
    water: "Agua",
    fire: "Fuego",
    grass: "Planta",
    lightning: "Rayo",
    rock: "Roca",
    blue: "Azul",
    purple: "Púrpura",
    gold: "Oro",
    red: "Rojo",
    rainbow: "Arcoíris",
    roleDps: "Ataque",
    roleGuardian: "Guardian",
    roleHealer: "Curación",
    roleTank: "Tanque",
    roleSupport: "Soporte",
    roleSpecialist: "Especialista",
    views: "Vistas",
    moveUp: "Subir",
    moveDown: "Bajar",
    remove: "Quitar",
    helpTour: "Ayuda — tour de la herramienta",
    tourNext: "Siguiente",
    tourPrev: "Anterior",
    tourDone: "Listo",
    tourWelcomeTitle: "Bienvenido",
    tourWelcomeBody:
      "Este planeador te ayuda a marcar qué Tatari tienes, ver qué falta para evolucionar y ordenar prioridades. Dale a Siguiente para un recorrido rápido.",
    tourLangTitle: "Idioma",
    tourLangBody:
      "Cambia la interfaz a Español, English o Português. En “Más idiomas…” puedes traducir con el buscador (también los trials del wiki).",
    tourTabsTitle: "Vistas",
    tourTabsBody:
      "Catálogo, Planeados, Equipo y Utilidades. La píldora de arriba cambia la vista principal.",
    tourSearchTitle: "Buscar",
    tourSearchBody: "Escribe un nombre (o parte) para filtrar líneas del catálogo.",
    tourTypeTitle: "Tipo",
    tourTypeBody: "Filtra por elemento (Agua, Fuego, Planta…). “Todos” quita el filtro.",
    tourRoleTitle: "Rol",
    tourRoleBody: "Filtra por rol de combate (Ataque, Curación, Tanque, etc.).",
    tourFiltersTitle: "Más filtros",
    tourFiltersBody:
      "Rareza base, posesión (las que tienes / no), orden (nombre o estrellas) y “Solo listos” para los que ya pueden evolucionar.",
    tourActionsTitle: "Acciones del catálogo",
    tourActionsBody:
      "Actualizar estrellas (vista) recorre los “Lo tengo” visibles. También puedes marcar todos, exportar o importar tu progreso.",
    tourCardTitle: "Cartas Tatari",
    tourCardBody:
      "Marca “Lo tengo”, abre Ver detalles para forma, estrellas, trials y añadir al plan. El chip Listo indica que cumple requisitos.",
    tourPagerTitle: "Paginación",
    tourPagerBody:
      "El catálogo se pagina tras aplicar filtros. Cambia de página sin perder búsqueda ni chips.",
    tourPlannedTabTitle: "Planeados",
    tourPlannedTabBody:
      "Aquí ves solo lo que añadiste al plan: orden, checklist de trials y estrellas.",
    tourWizardTitle: "Actualizar estrellas",
    tourWizardBody:
      "Abre un asistente paso a paso para revisar/actualizar estrellas de la cola del plan (o de los que tienes si el plan está vacío).",
    tourPlanListTitle: "Tu cola",
    tourPlanListBody:
      "Reordena con ↑↓, marca trials hechos, quita del plan con × y abre detalles cuando quieras. Si está vacío, añade Tatari desde el catálogo.",
    tourActivityFilterTitle: "Filtro por actividad",
    tourActivityFilterBody:
      "En Planeados, filtra por tipo de trial: alimentar, minijuegos, Bento, mismo equipo, tener Tatari ★…",
    tourTeamTitle: "Equipo",
    tourTeamBody:
      "Elige el modo: Cap.1–3 (9), Campaña/Invasión/Jefe (15 en 5×3) o Dojo (5v5). El grid muestra carriles y filas reales.",
    tourUtilsTitle: "Utilidades",
    tourUtilsBody:
      "Cinco herramientas: Tipos, Alimentar, Colección, Prioridad y Minijuegos. Usa el paginador 1·2·3·4·5.",
    tourDoneTitle: "¡Listo!",
    tourDoneBody:
      "Ya conoces lo esencial. Puedes repetir este tour cuando quieras con el botón ? abajo a la derecha.",
  },
  en: {
    name: "English",
    title: "Clash of Critters — Evolution planner",
    description:
      "Plan Tatari evolution order. Wiki data, progress saved in your browser.",
    brand: "Clash of Critters",
    heroSub:
      "Tatari evolution planner: mark what you own, see what’s next, and order your priorities.",
    wikiUpdated: "Wiki data updated:",
    langLabel: "Language",
    moreLangs: "More languages…",
    moreLangsHint:
      "Wiki trials auto-translate in Español/Português. Use this for other languages.",
    searchLang: "Search language…",
    noLangMatch: "No matches",
    tabCatalog: "Catalog",
    tabPlanned: "Planned",
    tabTeam: "Team",
    tabUtils: "Tools",
    pageOf: "Page {cur} of {total}",
    utilPager: "Tool pages",
    utilTypes: "Types",
    utilFeed: "Feeding",
    utilCollection: "Collection",
    utilPriority: "Priority",
    utilMinigames: "Minigames",
    typesIntro:
      "Elemental pentagon: ~200% advantage and ~50% disadvantage (community/wiki data).",
    typesStrong: "Strong vs",
    typesWeak: "Weak vs",
    typesEnemyTitle: "If the enemy is… bring",
    collectionIntro: "You own {have} of {total} lines ({pct}%).",
    collectionGlobal: "Global collection",
    collectionOwnGoals: "Pending own-goals",
    collectionMissing: "Still missing",
    collectionComplete: "Collection complete!",
    feedIntro: "Max {limit} feeds per day (resets at local midnight).",
    feedStage: "Stage",
    feedPoints: "Points",
    feedGrade: "Grade",
    feedNeedsB: "Need grade B (trial or Rainbow)",
    feedOwnedTitle: "Your Tatari",
    feedNoOwned: "Mark Tatari as owned to track grade/stage.",
    priorityIntro: "Owned with a pending evolution, sorted by community tiers.",
    priorityDisclaimer:
      "Tiers come from external community guides, not official. Use as guidance only.",
    priorityEmpty: "No owned lines with a pending evolution.",
    minigamesIntro: "Pending minigame trials on owned lines (or plan-only).",
    miniPlanOnly: "Plan only",
    minigamesEmpty: "No pending minigame trials.",
    mini_snowboard: "Snowboard / boards",
    mini_farm: "Cozy Farm",
    mini_fishing: "Fishing",
    mini_treasure: "Treasure Hunt",
    mini_zobo: "Zobo / Island",
    mini_island: "Island Gold",
    mini_pinball: "Pinball",
    mini_other: "Other minigames",
    cost_boards: "Boards",
    cost_fertilizer: "Fertilizer",
    cost_rods: "Rods",
    cost_energy: "Energy drinks",
    cost_pickaxes: "Pickaxes",
    cost_treasure: "Treasures",
    cost_pinballs: "Pinballs",
    cost_bullets: "Bullet coins",
    teamIntro:
      "Pick a mode: the board mirrors the real grid (lanes × rows). Zobos fight at the top; your base is at the bottom.",
    teamFieldLabel: "Battlefield",
    teamFieldEnemies: "Enemies (Zobos)",
    teamFieldBase: "Your base",
    teamLane: "L{n}",
    teamDeployCount: "Deploy: {have}/{max} · {cols} lanes",
    teamWarnRowEmpty: "Empty row: {row}",
    teamRow_front: "Front",
    teamRow_mid: "Mid",
    teamRow_back: "Back",
    teamRowHint_front: "Soak hits",
    teamRowHint_mid: "Damage / CC",
    teamRowHint_back: "Safe zone",
    teamModeLabel: "Mode",
    teamMode_early: "Ch. 1–3",
    teamMode_campaign: "Campaign",
    teamMode_invasion: "Invasion",
    teamMode_boss: "Boss",
    teamMode_dojo: "Dojo",
    teamModeBlurb_early:
      "Chapters 1–3: 3×3 grid (9 Tatari). Each lane: holder front, damage mid, utility back.",
    teamModeBlurb_campaign:
      "Campaign (ch. 4+): 5 lanes × 3 rows = 15 Tatari. Each lane needs survivability + damage + flex.",
    teamModeBlurb_invasion:
      "Horde Invasion: each player deploys up to 15 (same 5×3). Cover elements with your partner; no solid source for a 10-cap.",
    teamModeBlurb_boss:
      "Boss Challenge: 15 across 5 lanes. Match the boss element; spread damage if it teleports or removes units.",
    teamModeBlurb_dojo:
      "Badge Dojo: 5v5 fight (only 5 Tatari). Positioning and range matter more than in campaign.",
    teamSlot_front: "Tank",
    teamSlot_holder: "Hold",
    teamSlot_carry: "Carry",
    teamSlot_damage: "DPS",
    teamSlot_support: "Heal",
    teamSlot_util: "Util",
    teamSlot_flex: "Flex",
    teamSlot_flex2: "Flex",
    teamSlot_wave: "AoE",
    teamSlot_control: "CC",
    teamSlot_aura: "Aura",
    teamSlot_burst: "Burst",
    teamSlot_buffer: "Heal",
    teamSlot_utility: "Util",
    teamSlotAny: "Any",
    teamEnemyType: "Enemy type (matchup)",
    teamZoboTitle: "Zobos per lane (up to 3 types)",
    teamZoboHint:
      "Mark wave elements in each lane. Slots tint green/red by advantage.",
    teamZoboEmpty: "—",
    teamZoboAdd: "Add Zobo type",
    teamZoboRemove: "Remove type",
    teamPick: "Pick",
    teamChange: "Change",
    teamPickerTitle: "Pick Tatari",
    teamPickerFor: "Slot: {slot}",
    teamPickerEmpty: "No owned Tatari match those filters. Mark them in the catalog.",
    teamAlreadyIn: "Already in team",
    teamAuras: "Auras",
    teamNoAuras: "No auras on the team (often on final forms).",
    teamWarnSlot: "Still empty: {slot}",
    teamWarnRole: "{slot}: better a {role}",
    teamWarnAura: "No Aura on the team (helpful in Invasion/Dojo)",
    teamLooksGood: "Mode structure covered.",
    skillName: "Skill",
    plannedActivity: "Activity",
    plannedActivityEmpty: "No planned Tatari have pending trials in that activity.",
    objCatFeed: "Feed / stats",
    objCatMinigame: "Minigames",
    objCatCraft: "Bento / craft",
    objCatTeam: "Same team",
    objCatOwn: "Own Tatari ★",
    objCatOther: "Other",
    starsNeed: "Need {n}★ ({cur}/{req})",
    ownProgress: "Own {type} {stars}★: {have}/{need}",
    search: "Search",
    searchPlaceholder: "Sealing, Frostnip…",
    type: "Type",
    role: "Role",
    all: "All",
    rarity: "Base rarity",
    allRarities: "All rarities",
    ownership: "Owned",
    ownershipAll: "All",
    ownershipYes: "Ones I own",
    ownershipNo: "Ones I don’t own",
    readyOnly: "Ready only",
    sort: "Sort",
    sortName: "Name A–Z",
    sortStarsDesc: "Stars ↓",
    sortStarsAsc: "Stars ↑",
    lines: "{n} line",
    lines_plural: "{n} lines",
    updateStarsView: "Update stars (view)",
    ownAll: "I own all",
    exportProgress: "Export progress",
    import: "Import",
    plannedIntro: "What you want to improve and what’s left for the next evolution.",
    updateStars: "Update stars",
    footerWiki: "Data from",
    footerLocal:
      "Your progress is stored only in this browser (localStorage), no server.",
    iHaveIt: "I own it",
    seeDetails: "See details",
    ready: "Ready",
    chooseForm: "Choose {name}",
    markOwnedNext: "Mark “I own it” to see the next step.",
    lineComplete: "Line complete. No more evolutions.",
    noTrialWiki: "No trial listed on the wiki (stars only).",
    starsNoWiki: "Stars: no wiki data",
    starsProgress: "{cur} / {req} stars",
    next: "Next:",
    markOwnedDetails: "Mark this line as owned in details.",
    evoComplete: "Evolution complete.",
    starsWikiMissing: "Stars: wiki has no exact threshold.",
    starsHaveNeed: "Stars: you have {cur}, need {need} more (goal {req})",
    noTrialsListed: "No trials listed (stars only or missing wiki data).",
    currentForm: "Current form",
    stars: "Stars",
    hintPickForm: "Tap a form in the chain to set which one you have.",
    removeFromPlan: "Remove from plan",
    addToPlan: "Add to plan",
    wiki: "Wiki",
    emptyFilters: "Nothing matches the filters.",
    emptyPlan: "Nothing in the plan yet.",
    emptyPlanHint: "Go to the catalog and add Tatari via “See details”.",
    goCatalog: "Go to catalog",
    notMarkedOwned: "Not marked as owned",
    complete: "complete",
    readyShort: "ready",
    wizardDone: "Done",
    wizardDoneBody: "You’ve gone through every Tatari in this pass.",
    close: "Close",
    lineLabel: "Line {id} · now {stars}★",
    currentLook: "Current look",
    keepSame: "Unchanged",
    hasMoreStars: "Has more stars",
    newStars: "New",
    saveContinue: "Save & continue",
    skip: "Skip",
    noVisibleOwned:
      "No owned Tatari in the current view. Adjust filters (e.g. Fire) or mark them as owned.",
    noWizardQueue:
      "Nothing to update. Add some to the plan or mark “I own it” in the catalog.",
    ownAllConfirm:
      "Mark every Tatari in the catalog as owned? This won’t erase stars or trials you already set.",
    importFail: "Could not import that file.",
    loadFail: "Could not load data/evolutions.json ({msg}).",
    loadingTitle: "Loading…",
    loadingData: "Preparing wiki data",
    loadingTranslate: "Translating wiki trials…",
    loadingReady: "Ready",
    notFound: "Line not found.",
    water: "Water",
    fire: "Fire",
    grass: "Grass",
    lightning: "Lightning",
    rock: "Rock",
    blue: "Blue",
    purple: "Purple",
    gold: "Gold",
    red: "Red",
    rainbow: "Rainbow",
    roleDps: "Attack",
    roleGuardian: "Guardian",
    roleHealer: "Healer",
    roleTank: "Tank",
    roleSupport: "Support",
    roleSpecialist: "Specialist",
    views: "Views",
    moveUp: "Move up",
    moveDown: "Move down",
    remove: "Remove",
    helpTour: "Help — tool tour",
    tourNext: "Next",
    tourPrev: "Back",
    tourDone: "Done",
    tourWelcomeTitle: "Welcome",
    tourWelcomeBody:
      "This planner helps you mark which Tatari you own, see what’s left to evolve, and order priorities. Hit Next for a quick walkthrough.",
    tourLangTitle: "Language",
    tourLangBody:
      "Switch the UI to Español, English, or Português. “More languages…” uses the search translator (including wiki trials).",
    tourTabsTitle: "Views",
    tourTabsBody:
      "Catalog, Planned, Team, and Tools. The top pill switches the main view.",
    tourSearchTitle: "Search",
    tourSearchBody: "Type a name (or part of it) to filter catalog lines.",
    tourTypeTitle: "Type",
    tourTypeBody: "Filter by element (Water, Fire, Grass…). “All” clears the filter.",
    tourRoleTitle: "Role",
    tourRoleBody: "Filter by combat role (Attack, Healer, Tank, etc.).",
    tourFiltersTitle: "More filters",
    tourFiltersBody:
      "Base rarity, ownership, sort (name or stars), and “Ready only” for lines that can evolve now.",
    tourActionsTitle: "Catalog actions",
    tourActionsBody:
      "Update stars (view) walks owned Tatari in the current filters. You can also own all, export, or import progress.",
    tourCardTitle: "Tatari cards",
    tourCardBody:
      "Check “I own it”, open See details for form, stars, trials, and add to plan. Ready means requirements are met.",
    tourPagerTitle: "Pagination",
    tourPagerBody:
      "The catalog paginates after filters. Change pages without losing search or chips.",
    tourPlannedTabTitle: "Planned",
    tourPlannedTabBody:
      "Only what you added to the plan: order, trial checklist, and stars.",
    tourWizardTitle: "Update stars",
    tourWizardBody:
      "Opens a step-by-step wizard to review/update stars for the plan queue (or owned ones if the plan is empty).",
    tourPlanListTitle: "Your queue",
    tourPlanListBody:
      "Reorder with ↑↓, tick finished trials, remove with ×, and open details anytime. If empty, add Tatari from the catalog.",
    tourActivityFilterTitle: "Activity filter",
    tourActivityFilterBody:
      "In Planned, filter by trial type: feed, minigames, Bento, same team, own Tatari ★…",
    tourTeamTitle: "Team",
    tourTeamBody:
      "Pick the mode: Ch.1–3 (9), Campaign/Invasion/Boss (15 on 5×3), or Dojo (5v5). The grid shows real lanes and rows.",
    tourUtilsTitle: "Tools",
    tourUtilsBody:
      "Five tools: Types, Feeding, Collection, Priority, and Minigames. Use the 1·2·3·4·5 pager.",
    tourDoneTitle: "You’re set!",
    tourDoneBody:
      "That’s the essentials. Replay this tour anytime with the ? button at the bottom right.",
  },
  pt: {
    name: "Português",
    title: "Clash of Critters — Planejador de evoluções",
    description:
      "Planeje a ordem de evoluções dos Tatari. Dados do wiki, progresso no navegador.",
    brand: "Clash of Critters",
    heroSub:
      "Planejador de evoluções Tatari: marque o que você tem, veja o próximo passo e organize prioridades.",
    wikiUpdated: "Dados do wiki atualizados:",
    langLabel: "Idioma",
    moreLangs: "Mais idiomas…",
    moreLangsHint:
      "Os trials do wiki traduzem sozinhos em Espanhol/Português. Use isto para outros idiomas.",
    searchLang: "Buscar idioma…",
    noLangMatch: "Sem coincidências",
    tabCatalog: "Catálogo",
    tabPlanned: "Planejados",
    tabTeam: "Time",
    tabUtils: "Utilidades",
    pageOf: "Página {cur} de {total}",
    utilPager: "Páginas de utilidades",
    utilTypes: "Tipos",
    utilFeed: "Alimentar",
    utilCollection: "Coleção",
    utilPriority: "Prioridade",
    utilMinigames: "Minijogos",
    typesIntro:
      "Pentágono elemental: vantagem ~200% e desvantagem ~50% (dados da comunidade/wiki).",
    typesStrong: "Forte contra",
    typesWeak: "Fraco contra",
    typesEnemyTitle: "Se o inimigo for… leve",
    collectionIntro: "Você tem {have} de {total} linhas ({pct}%).",
    collectionGlobal: "Coleção global",
    collectionOwnGoals: "Own-goals pendentes",
    collectionMissing: "Ainda faltam",
    collectionComplete: "Coleção completa!",
    feedIntro: "Máximo {limit} alimentações por dia (reset à meia-noite local).",
    feedStage: "Etapa",
    feedPoints: "Pontos",
    feedGrade: "Grade",
    feedNeedsB: "Precisam de grade B (trial ou Rainbow)",
    feedOwnedTitle: "Seus Tatari",
    feedNoOwned: "Marque Tatari como “Eu tenho” para registrar grade/etapa.",
    priorityIntro: "Owned com evolução pendente, ordenados por tier da comunidade.",
    priorityDisclaimer:
      "Os tiers vêm de guias externos, não oficiais. Use só como orientação.",
    priorityEmpty: "Nenhum owned com evolução pendente.",
    minigamesIntro:
      "Trials de minijogos pendentes nos owned (ou só no plano).",
    miniPlanOnly: "Só planejados",
    minigamesEmpty: "Sem trials de minijogos pendentes.",
    mini_snowboard: "Snowboard / boards",
    mini_farm: "Cozy Farm",
    mini_fishing: "Pesca",
    mini_treasure: "Treasure Hunt",
    mini_zobo: "Zobo / Island",
    mini_island: "Island Gold",
    mini_pinball: "Pinball",
    mini_other: "Outros minijogos",
    cost_boards: "Boards",
    cost_fertilizer: "Fertilizer",
    cost_rods: "Varas",
    cost_energy: "Energy drinks",
    cost_pickaxes: "Picaretas",
    cost_treasure: "Tesouros",
    cost_pinballs: "Pinballs",
    cost_bullets: "Bullet coins",
    teamIntro:
      "Escolha o modo: o tabuleiro espelha o grid real (faixas × fileiras). Em cima lutam os Zobos; embaixo fica a base.",
    teamFieldLabel: "Campo de batalha",
    teamFieldEnemies: "Inimigos (Zobos)",
    teamFieldBase: "Sua base",
    teamLane: "F{n}",
    teamDeployCount: "Implantar: {have}/{max} · {cols} faixas",
    teamWarnRowEmpty: "Fileira vazia: {row}",
    teamRow_front: "Frente",
    teamRow_mid: "Meio",
    teamRow_back: "Atrás",
    teamRowHint_front: "Absorvem o golpe",
    teamRowHint_mid: "Dano / controle",
    teamRowHint_back: "Zona segura",
    teamModeLabel: "Modo",
    teamMode_early: "Cap. 1–3",
    teamMode_campaign: "Campanha",
    teamMode_invasion: "Invasão",
    teamMode_boss: "Chefe",
    teamMode_dojo: "Dojo",
    teamModeBlurb_early:
      "Capítulos 1–3: grid 3×3 (9 Tatari). Cada faixa: holder na frente, dano no meio, utilidade atrás.",
    teamModeBlurb_campaign:
      "Campanha (cap. 4+): 5 faixas × 3 fileiras = 15 Tatari. Cada faixa precisa sobrevivência + dano + flex.",
    teamModeBlurb_invasion:
      "Horde Invasion: cada jogador coloca até 15 (mesmo 5×3). Cubram elementos com o parceiro; não há fonte sólida de limite 10.",
    teamModeBlurb_boss:
      "Boss Challenge: 15 em 5 faixas. Case o elemento do chefe; espalhe dano se teleporta ou remove unidades.",
    teamModeBlurb_dojo:
      "Badge Dojo: luta 5v5 (só 5 Tatari). Posição e alcance importam mais do que na campanha.",
    teamSlot_front: "Tank",
    teamSlot_holder: "Hold",
    teamSlot_carry: "Carry",
    teamSlot_damage: "DPS",
    teamSlot_support: "Heal",
    teamSlot_util: "Util",
    teamSlot_flex: "Flex",
    teamSlot_flex2: "Flex",
    teamSlot_wave: "AoE",
    teamSlot_control: "CC",
    teamSlot_aura: "Aura",
    teamSlot_burst: "Burst",
    teamSlot_buffer: "Heal",
    teamSlot_utility: "Util",
    teamSlotAny: "Qualquer",
    teamEnemyType: "Tipo inimigo (vantagem)",
    teamZoboTitle: "Zobos por faixa (até 3 tipos)",
    teamZoboHint:
      "Marque os elementos da onda em cada faixa. As casas coloram por vantagem.",
    teamZoboEmpty: "—",
    teamZoboAdd: "Adicionar tipo de Zobo",
    teamZoboRemove: "Remover tipo",
    teamPick: "Escolher",
    teamChange: "Trocar",
    teamPickerTitle: "Escolher Tatari",
    teamPickerFor: "Slot: {slot}",
    teamPickerEmpty: "Nenhum owned com esses filtros. Marque-os no catálogo.",
    teamAlreadyIn: "Já no time",
    teamAuras: "Auras",
    teamNoAuras: "Sem auras no time (costumam estar nas formas finais).",
    teamWarnSlot: "Falta preencher: {slot}",
    teamWarnRole: "{slot}: melhor um {role}",
    teamWarnAura: "Nenhum slot traz Aura (útil em Invasão/Dojo)",
    teamLooksGood: "Estrutura do modo coberta.",
    skillName: "Skill",
    plannedActivity: "Atividade",
    plannedActivityEmpty:
      "Nenhum planejado tem trials pendentes dessa atividade.",
    objCatFeed: "Alimentar / stats",
    objCatMinigame: "Minijogos",
    objCatCraft: "Bento / fabricar",
    objCatTeam: "Mesmo time",
    objCatOwn: "Ter Tatari ★",
    objCatOther: "Outros",
    starsNeed: "Faltam {n}★ ({cur}/{req})",
    ownProgress: "Possuir {type} {stars}★: {have}/{need}",
    search: "Buscar",
    searchPlaceholder: "Sealing, Frostnip…",
    type: "Tipo",
    role: "Função",
    all: "Todos",
    rarity: "Raridade base",
    allRarities: "Todas as raridades",
    ownership: "Posse",
    ownershipAll: "Todas",
    ownershipYes: "As que eu tenho",
    ownershipNo: "As que não tenho",
    readyOnly: "Só prontos",
    sort: "Ordem",
    sortName: "Nome A–Z",
    sortStarsDesc: "Estrelas ↓",
    sortStarsAsc: "Estrelas ↑",
    lines: "{n} linha",
    lines_plural: "{n} linhas",
    updateStarsView: "Atualizar estrelas (vista)",
    ownAll: "Tenho todos",
    exportProgress: "Exportar progresso",
    import: "Importar",
    plannedIntro:
      "O que você quer melhorar e o que falta para a próxima evolução.",
    updateStars: "Atualizar estrelas",
    footerWiki: "Dados de",
    footerLocal:
      "Seu progresso fica só neste navegador (localStorage), sem servidor.",
    iHaveIt: "Eu tenho",
    seeDetails: "Ver detalhes",
    ready: "Pronto",
    chooseForm: "Escolher {name}",
    markOwnedNext: "Marque “Eu tenho” para ver o próximo passo.",
    lineComplete: "Linha completa. Sem mais evoluções.",
    noTrialWiki: "Sem trial no wiki (só estrelas).",
    starsNoWiki: "Estrelas: sem dado no wiki",
    starsProgress: "{cur} / {req} estrelas",
    next: "Próximo:",
    markOwnedDetails: "Marque esta linha como sua nos detalhes.",
    evoComplete: "Evolução completa.",
    starsWikiMissing: "Estrelas: o wiki não tem o limiar exato.",
    starsHaveNeed: "Estrelas: você tem {cur}, faltam {need} (meta {req})",
    noTrialsListed: "Sem trials listados (só estrelas ou dado ausente).",
    currentForm: "Forma atual",
    stars: "Estrelas",
    hintPickForm: "Toque uma forma da cadeia para indicar qual você tem.",
    removeFromPlan: "Tirar do plano",
    addToPlan: "Adicionar ao plano",
    wiki: "Wiki",
    emptyFilters: "Nada combina com os filtros.",
    emptyPlan: "Ainda não há nada no plano.",
    emptyPlanHint: "Vá ao catálogo e adicione Tatari em “Ver detalhes”.",
    goCatalog: "Ir ao catálogo",
    notMarkedOwned: "Não marcado como seu",
    complete: "completa",
    readyShort: "pronto",
    wizardDone: "Pronto",
    wizardDoneBody: "Você passou por todos os Tatari desta rodada.",
    close: "Fechar",
    lineLabel: "Linha {id} · agora {stars}★",
    currentLook: "Aparência atual",
    keepSame: "Continua igual",
    hasMoreStars: "Tem mais estrelas",
    newStars: "Novas",
    saveContinue: "Salvar e seguir",
    skip: "Pular",
    noVisibleOwned:
      "Não há Tatari “Eu tenho” na vista atual. Ajuste filtros ou marque-os.",
    noWizardQueue:
      "Nada para atualizar. Adicione ao plano ou marque “Eu tenho” no catálogo.",
    ownAllConfirm:
      "Marcar todos os Tatari do catálogo como seus? Não apaga estrelas nem trials já definidos.",
    importFail: "Não foi possível importar esse arquivo.",
    loadFail: "Não foi possível carregar data/evolutions.json ({msg}).",
    loadingTitle: "Carregando…",
    loadingData: "Preparando dados do wiki",
    loadingTranslate: "Traduzindo trials do wiki…",
    loadingReady: "Pronto",
    notFound: "Linha não encontrada.",
    water: "Água",
    fire: "Fogo",
    grass: "Planta",
    lightning: "Raio",
    rock: "Rocha",
    blue: "Azul",
    purple: "Roxo",
    gold: "Ouro",
    red: "Vermelho",
    rainbow: "Arco-íris",
    roleDps: "Ataque",
    roleGuardian: "Guardian",
    roleHealer: "Cura",
    roleTank: "Tanque",
    roleSupport: "Suporte",
    roleSpecialist: "Especialista",
    views: "Vistas",
    moveUp: "Subir",
    moveDown: "Baixar",
    remove: "Remover",
    helpTour: "Ajuda — tour da ferramenta",
    tourNext: "Seguinte",
    tourPrev: "Anterior",
    tourDone: "Pronto",
    tourWelcomeTitle: "Bem-vindo",
    tourWelcomeBody:
      "Este planejador ajuda a marcar quais Tatari você tem, ver o que falta para evoluir e ordenar prioridades. Toque em Seguinte para um passeio rápido.",
    tourLangTitle: "Idioma",
    tourLangBody:
      "Mude a interface para Español, English ou Português. Em “Mais idiomas…” use o buscador do tradutor (também trials do wiki).",
    tourTabsTitle: "Vistas",
    tourTabsBody:
      "Catálogo, Planejados, Time e Utilidades. A pílula de cima muda a vista principal.",
    tourSearchTitle: "Buscar",
    tourSearchBody: "Digite um nome (ou parte) para filtrar linhas do catálogo.",
    tourTypeTitle: "Tipo",
    tourTypeBody: "Filtre por elemento (Água, Fogo, Planta…). “Todos” limpa o filtro.",
    tourRoleTitle: "Função",
    tourRoleBody: "Filtre por função de combate (Ataque, Cura, Tanque, etc.).",
    tourFiltersTitle: "Mais filtros",
    tourFiltersBody:
      "Raridade base, posse, ordem (nome ou estrelas) e “Só prontos” para quem já pode evoluir.",
    tourActionsTitle: "Ações do catálogo",
    tourActionsBody:
      "Atualizar estrelas (vista) percorre os “Eu tenho” visíveis. Também pode marcar todos, exportar ou importar progresso.",
    tourCardTitle: "Cartas Tatari",
    tourCardBody:
      "Marque “Eu tenho”, abra Ver detalhes para forma, estrelas, trials e adicionar ao plano. Pronto indica requisitos cumpridos.",
    tourPagerTitle: "Paginação",
    tourPagerBody:
      "O catálogo pagina após os filtros. Mude de página sem perder busca nem chips.",
    tourPlannedTabTitle: "Planejados",
    tourPlannedTabBody:
      "Só o que você adicionou ao plano: ordem, checklist de trials e estrelas.",
    tourWizardTitle: "Atualizar estrelas",
    tourWizardBody:
      "Abre um assistente passo a passo para revisar/atualizar estrelas da fila do plano (ou dos que você tem se o plano estiver vazio).",
    tourPlanListTitle: "Sua fila",
    tourPlanListBody:
      "Reordene com ↑↓, marque trials feitos, remova com × e abra detalhes quando quiser. Se estiver vazia, adicione Tatari no catálogo.",
    tourActivityFilterTitle: "Filtro por atividade",
    tourActivityFilterBody:
      "Em Planejados, filtre por tipo de trial: alimentar, minijogos, Bento, mesmo time, ter Tatari ★…",
    tourTeamTitle: "Time",
    tourTeamBody:
      "Escolha o modo: Cap.1–3 (9), Campanha/Invasão/Chefe (15 em 5×3) ou Dojo (5v5). O grid mostra faixas e fileiras reais.",
    tourUtilsTitle: "Utilidades",
    tourUtilsBody:
      "Cinco ferramentas: Tipos, Alimentar, Coleção, Prioridade e Minijogos. Use o paginador 1·2·3·4·5.",
    tourDoneTitle: "Pronto!",
    tourDoneBody:
      "Você já conhece o essencial. Pode repetir este tour quando quiser com o botão ? no canto inferior direito.",
  },
};

export const MORE_LANG = "more";

let currentLang = "es";
/** @type {boolean} */
let useMoreLangs = false;

export function getSupportedLangs() {
  return [
    ...Object.keys(LOCALES).map((code) => ({
      code,
      name: LOCALES[code].name,
    })),
    { code: MORE_LANG, name: LOCALES.es.moreLangs },
  ];
}

export function detectBrowserLang() {
  const nav = (navigator.language || "es").toLowerCase();
  if (LOCALES[nav]) return nav;
  const short = nav.split("-")[0];
  if (LOCALES[short]) return short;
  return "es";
}

export function getLang() {
  return useMoreLangs ? MORE_LANG : currentLang;
}

/** Language used to translate wiki trial text (English → target). */
export function getContentLang() {
  if (useMoreLangs) {
    const stored = localStorage.getItem(GT_LANG_KEY);
    if (stored) return stored;
    const fromCookie = readGoogTransCookie();
    if (fromCookie) return fromCookie;
    return "en";
  }
  return currentLang;
}

export function t(key, vars = {}) {
  const pack = LOCALES[currentLang] || LOCALES.es;
  let str = pack[key] ?? LOCALES.es[key] ?? key;
  if (key === "lines" && Number(vars.n) !== 1) {
    str = pack.lines_plural ?? LOCALES.es.lines_plural ?? str;
  }
  return str.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] != null ? String(vars[k]) : `{${k}}`
  );
}

function clearGoogleTranslateCookie() {
  if (!/googtrans=/.test(document.cookie)) return false;
  document.cookie =
    "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  document.cookie =
    "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" +
    location.hostname;
  return true;
}

/**
 * @param {string} lang - Locale code or "more"
 * @param {{ skipReload?: boolean }} [opts]
 */
export function setLang(lang, opts = {}) {
  const wasMore = useMoreLangs;

  if (lang === MORE_LANG) {
    useMoreLangs = true;
    currentLang = "es";
    localStorage.setItem(STORAGE_KEY, MORE_LANG);
    document.documentElement.lang = "es";
    applyStaticI18n(document);
    setGoogleTranslateVisible(true);
    return MORE_LANG;
  }

  if (!LOCALES[lang]) lang = "es";
  useMoreLangs = false;
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  localStorage.removeItem(GT_LANG_KEY);
  document.documentElement.lang = lang;
  applyStaticI18n(document);
  setGoogleTranslateVisible(false);

  if (wasMore && !opts.skipReload && clearGoogleTranslateCookie()) {
    location.reload();
  }
  return currentLang;
}

export function initLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === MORE_LANG) {
    useMoreLangs = true;
    currentLang = "es";
    document.documentElement.lang = "es";
    return MORE_LANG;
  }
  const lang = saved && LOCALES[saved] ? saved : detectBrowserLang();
  useMoreLangs = false;
  currentLang = lang;
  document.documentElement.lang = lang;
  return lang;
}

export function applyStaticI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    el.setAttribute("placeholder", t(key));
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (!key) return;
    el.setAttribute("aria-label", t(key));
  });
  const moreOpt = document.querySelector(`#lang-select option[value="${MORE_LANG}"]`);
  if (moreOpt) moreOpt.textContent = t("moreLangs");
  const title = t("title");
  if (title) document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", t("description"));
}

/** Show/hide Google Translate element for any extra language. */
export function setGoogleTranslateVisible(show) {
  const wrap = document.getElementById("google-translate-wrap");
  if (wrap) wrap.hidden = !show;
  if (show) initGoogleLangSearch();
}

/** @type {{ code: string, name: string }[]} */
let gtLangs = [];
let gtSearchBound = false;

function getGoogTeCombo() {
  return /** @type {HTMLSelectElement | null} */ (
    document.querySelector("select.goog-te-combo")
  );
}

function readGoogTransCookie() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (!match) return "";
  const value = decodeURIComponent(match[1]);
  const parts = value.split("/");
  return parts[parts.length - 1] || "";
}

/** Extra labels so “español / spanish / es” always match even if GT omits them. */
const GT_LANG_ALIASES = {
  es: ["español", "espanol", "spanish", "castellano", "es"],
  en: ["english", "inglés", "ingles", "en"],
  pt: ["português", "portugues", "portuguese", "pt"],
};

function ensureSpanishInList() {
  if (gtLangs.some((l) => l.code === "es")) return;
  gtLangs.unshift({ code: "es", name: "Español" });
}

function syncLangsFromGoogle() {
  const combo = getGoogTeCombo();
  if (!combo) {
    // Combo still loading: at least allow searching Spanish for wiki texts.
    if (!gtLangs.length) {
      gtLangs = [{ code: "es", name: "Español" }];
    }
    ensureSpanishInList();
    return false;
  }
  gtLangs = [...combo.options]
    .filter((o) => o.value)
    .map((o) => ({ code: o.value, name: o.textContent?.trim() || o.value }));
  ensureSpanishInList();
  return gtLangs.length > 0;
}

function setGoogTransCookie(code) {
  // Source is English (wiki data). Target is the chosen language.
  const value = `/en/${code}`;
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};path=/;domain=${location.hostname}`;
}

function applyGoogleLang(code) {
  if (!code) {
    clearGoogleTranslateCookie();
    localStorage.removeItem(GT_LANG_KEY);
    location.reload();
    return;
  }
  localStorage.setItem(GT_LANG_KEY, code);
  setGoogTransCookie(code);
  const combo = getGoogTeCombo();
  const input = document.getElementById("gt-lang-input");
  const hit = gtLangs.find((l) => l.code === code);
  if (input && hit) input.value = hit.name;

  if (combo) {
    // Inject missing Spanish option so the native combo can select it.
    if (code === "es" && ![...combo.options].some((o) => o.value === "es")) {
      const opt = document.createElement("option");
      opt.value = "es";
      opt.textContent = "Español";
      combo.appendChild(opt);
    }
    combo.value = code;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
    // Cookie + reload is the reliable way to force wiki English → Spanish.
    location.reload();
    return;
  }
  location.reload();
}

function langMatchesQuery(lang, q) {
  if (!q) return true;
  const fold = (s) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "");
  const name = fold(lang.name);
  const code = fold(lang.code);
  if (name.includes(q) || code.includes(q)) return true;
  const aliases = GT_LANG_ALIASES[lang.code] || [];
  return aliases.some((a) => fold(a).includes(q) || q.includes(fold(a)));
}

function renderGtLangList(query = "") {
  const list = document.getElementById("gt-lang-list");
  if (!list) return;
  ensureSpanishInList();
  const q = query
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
  const filtered = gtLangs.filter((l) => langMatchesQuery(l, q));

  if (!filtered.length) {
    list.innerHTML = `<li class="gt-lang-empty">${t("noLangMatch")}</li>`;
    list.hidden = false;
    return;
  }

  list.innerHTML = filtered
    .slice(0, 40)
    .map(
      (l) =>
        `<li role="option" tabindex="-1" data-code="${l.code}">${l.name}</li>`
    )
    .join("");
  list.hidden = false;
}

function setGtInputFromCurrent() {
  const input = document.getElementById("gt-lang-input");
  if (!input) return;
  const code =
    localStorage.getItem(GT_LANG_KEY) ||
    readGoogTransCookie() ||
    getGoogTeCombo()?.value ||
    "";
  const hit = gtLangs.find((l) => l.code === code);
  if (hit) input.value = hit.name;
}

export function initGoogleLangSearch() {
  const input = document.getElementById("gt-lang-input");
  const list = document.getElementById("gt-lang-list");
  if (!input || !list) return;

  const trySync = () => {
    if (syncLangsFromGoogle()) {
      setGtInputFromCurrent();
      return true;
    }
    return false;
  };

  if (!trySync()) {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (trySync() || tries > 40) clearInterval(timer);
    }, 250);
    window.addEventListener("google-translate-ready", () => {
      setTimeout(trySync, 300);
    }, { once: true });
  }

  if (gtSearchBound) return;
  gtSearchBound = true;

  input.addEventListener("focus", () => {
    if (!gtLangs.length) syncLangsFromGoogle();
    renderGtLangList(input.value);
  });

  input.addEventListener("input", () => {
    if (!gtLangs.length) syncLangsFromGoogle();
    renderGtLangList(input.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      list.hidden = true;
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const first = list.querySelector("[data-code]");
      const code = first?.getAttribute("data-code");
      if (code) {
        applyGoogleLang(code);
        list.hidden = true;
      }
    }
  });

  list.addEventListener("mousedown", (e) => {
    const li = e.target instanceof HTMLElement ? e.target.closest("[data-code]") : null;
    if (!li) return;
    e.preventDefault();
    const code = li.getAttribute("data-code");
    if (code) {
      applyGoogleLang(code);
      list.hidden = true;
    }
  });

  document.addEventListener("click", (e) => {
    const wrap = document.getElementById("google-translate-wrap");
    if (!wrap || wrap.hidden) return;
    if (e.target instanceof Node && wrap.contains(e.target)) return;
    list.hidden = true;
  });
}
