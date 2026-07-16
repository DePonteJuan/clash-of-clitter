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
