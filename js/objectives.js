/** Categories for pending evolution trials (EN wiki text). */
export const OBJECTIVE_CATEGORIES = [
  "feed",
  "minigame",
  "craft",
  "team",
  "own",
  "other",
];

/**
 * @typedef {{ stars: number, type: string, count: number }} OwnGoal
 * @typedef {{ category: string, subtag?: string | null, own?: OwnGoal }} TrialClass
 */

/**
 * Classify a wiki trial string (English source).
 * @param {string} text
 * @returns {TrialClass}
 */
export function classifyTrial(text) {
  const s = String(text || "").trim();
  if (!s) return { category: "other" };

  const ownMatch = s.match(
    /Own\s+(\d+)[-\s]?stars?\s+(\w+)\s+Tatari\s+x\s*(\d+)/i
  );
  if (ownMatch) {
    return {
      category: "own",
      own: {
        stars: Number(ownMatch[1]),
        type: ownMatch[2],
        count: Number(ownMatch[3]),
      },
    };
  }

  if (/same\s+team|on\s+the\s+same\s+team/i.test(s)) {
    return { category: "team" };
  }
  if (/^Use\b.+\band\b/i.test(s) && /team|clear/i.test(s)) {
    return { category: "team" };
  }

  if (/^Craft\b/i.test(s) || /\bBento\b/i.test(s)) {
    return { category: "craft" };
  }

  if (
    /^Play\b/i.test(s) ||
    /Snowboard|Cozy\s*Farm|Fishing\s*Contest|Treasure\s*Hunt|Zobo|Island\s*Gold|Marathon\s*Party|pinball/i.test(
      s
    )
  ) {
    let subtag = "other";
    if (/Snowboard|Marathon|skateboard/i.test(s)) subtag = "snowboard";
    else if (/Cozy\s*Farm|fertilizer/i.test(s)) subtag = "farm";
    else if (/Fishing/i.test(s)) subtag = "fishing";
    else if (/Treasure|pickaxe/i.test(s)) subtag = "treasure";
    else if (/Zobo/i.test(s)) subtag = "zobo";
    else if (/Island\s*Gold|Gold\s*Rush|energy\s*drink/i.test(s))
      subtag = "island";
    else if (/pinball/i.test(s)) subtag = "pinball";
    return { category: "minigame", subtag };
  }

  if (/^Feed\b/i.test(s) || /\bFeed\b/i.test(s)) {
    return { category: "feed" };
  }

  return { category: "other" };
}

/**
 * Pending trial categories for the current evolution step.
 * @param {{ trials?: string[] } | null} next
 * @param {{ trialsDone?: boolean[] }} progress
 * @returns {string[]}
 */
export function pendingCategories(next, progress) {
  if (!next?.trials?.length) return [];
  /** @type {Set<string>} */
  const cats = new Set();
  next.trials.forEach((trial, i) => {
    if (progress.trialsDone?.[i]) return;
    cats.add(classifyTrial(trial).category);
  });
  return [...cats];
}

/**
 * @param {{ trials?: string[] } | null} next
 * @param {{ trialsDone?: boolean[] }} progress
 * @param {string} category
 */
export function hasPendingCategory(next, progress, category) {
  if (!category) return true;
  return pendingCategories(next, progress).includes(category);
}

/**
 * Parse Own goal from a trial if present.
 * @param {string} trial
 * @returns {OwnGoal | null}
 */
export function parseOwnGoal(trial) {
  const c = classifyTrial(trial);
  return c.category === "own" && c.own ? c.own : null;
}

/**
 * @param {{ lines: { id: string, type?: string }[] }} catalog
 * @param {object} state
 * @param {(state: object, id: string) => { owned: boolean, stars: number }} getLineProgress
 * @param {string} type
 * @param {number} minStars
 */
export function countOwnedOfType(
  catalog,
  state,
  getLineProgress,
  type,
  minStars
) {
  const want = String(type || "").toLowerCase();
  let n = 0;
  for (const line of catalog.lines || []) {
    if (String(line.type || "").toLowerCase() !== want) continue;
    const p = getLineProgress(state, line.id);
    if (p.owned && p.stars >= minStars) n += 1;
  }
  return n;
}

/**
 * Pull approximate resource amounts from a trial string.
 * @param {string} text
 * @returns {{ key: string, amount: number }[]}
 */
export function extractTrialCosts(text) {
  const s = String(text || "");
  /** @type {{ key: string, amount: number }[]} */
  const out = [];
  const patterns = [
    [/x\s*([\d,]+)\s*boards?/i, "boards"],
    [/([\d,]+)\s*boards?/i, "boards"],
    [/skateboards?/i, "boards"],
    [/x\s*([\d,]+)\s*fertilizer/i, "fertilizer"],
    [/fertilizer\s*x\s*([\d,]+)/i, "fertilizer"],
    [/([\d,]+)\s*fertilizer/i, "fertilizer"],
    [/x\s*([\d,]+)\s*(?:fishing\s*)?rods?/i, "rods"],
    [/([\d,]+)\s*(?:fishing\s*)?rods?/i, "rods"],
    [/([\d,]+)\s*energy\s*drinks?/i, "energy"],
    [/use\s*([\d,]+)\s*energy/i, "energy"],
    [/([\d,]+)\s*pickaxes?/i, "pickaxes"],
    [/dig\s*up\s*([\d,]+)\s*treasure/i, "treasure"],
    [/([\d,]+)\s*pinballs?/i, "pinballs"],
    [/shoot\s*([\d,]+)\s*pinballs?/i, "pinballs"],
    [/([\d,]+)\s*bullet\s*coi?ns?/i, "bullets"],
  ];
  const seen = new Set();
  for (const [re, key] of patterns) {
    const m = s.match(re);
    if (!m) continue;
    const raw = (m[1] || "").replace(/,/g, "");
    const amount = Number(raw);
    if (!amount || seen.has(key)) continue;
    seen.add(key);
    out.push({ key, amount });
  }
  return out;
}
