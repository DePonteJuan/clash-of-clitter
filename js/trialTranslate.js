/**
 * Translates wiki trial texts (English source) for the active UI language.
 * Uses Google’s public gtx endpoint — same engine as the page widget, but works
 * on content inserted dynamically after load (Planeados checklist, details, etc.).
 */

const CACHE_KEY = "coc-evolution-planner-trial-i18n-v1";

/** @type {Map<string, string>} */
const memory = new Map();

function cacheKey(lang, text) {
  return `${lang}::${text}`;
}

function loadDiskCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") memory.set(k, v);
    }
  } catch {
    /* ignore */
  }
}

function saveDiskCache() {
  try {
    const obj = Object.fromEntries(memory);
    // Cap size roughly
    const keys = Object.keys(obj);
    if (keys.length > 2000) {
      for (const k of keys.slice(0, keys.length - 1500)) delete obj[k];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch {
    /* ignore quota */
  }
}

loadDiskCache();

/**
 * @param {string} text
 * @param {string} lang
 */
async function translateOne(text, lang) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" +
    encodeURIComponent(lang) +
    "&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const out = (data?.[0] || []).map((chunk) => chunk?.[0] || "").join("");
  return out.trim() || text;
}

/**
 * @param {string} text
 * @param {string} lang
 */
export function translatedTrial(text, lang) {
  if (!text || !lang || lang === "en") return text;
  return memory.get(cacheKey(lang, text)) || text;
}

/**
 * Ensure all trial strings are cached for `lang`, then return.
 * @param {string[]} texts
 * @param {string} lang
 */
export async function ensureTrialsTranslated(texts, lang) {
  if (!lang || lang === "en") return;

  const unique = [...new Set(texts.filter(Boolean))];
  const missing = unique.filter((t) => !memory.has(cacheKey(lang, t)));
  if (!missing.length) return;

  const CONCURRENCY = 4;
  for (let i = 0; i < missing.length; i += CONCURRENCY) {
    const batch = missing.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (text) => {
        try {
          const translated = await translateOne(text, lang);
          memory.set(cacheKey(lang, text), translated);
        } catch {
          memory.set(cacheKey(lang, text), text);
        }
      })
    );
  }
  saveDiskCache();
}

/**
 * Collect every trial string from the catalog.
 * @param {{ lines?: { stages?: { trials?: string[] }[] }[] }} catalog
 */
export function collectTrialTexts(catalog) {
  /** @type {string[]} */
  const out = [];
  for (const line of catalog.lines || []) {
    for (const stage of line.stages || []) {
      for (const trial of stage.trials || []) {
        if (trial) out.push(trial);
      }
    }
  }
  return out;
}
