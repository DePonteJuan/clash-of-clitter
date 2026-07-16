/** Wiki image + star-tier helpers */

const WIKI_ORIGIN = "https://clashofcritters.wiki.gg";

/** Normalize a filename or wiki URL into a direct /images/ path. */
export function wikiImageUrl(filenameOrUrl) {
  if (!filenameOrUrl) return "";
  let name = String(filenameOrUrl).trim();

  if (name.includes("Special:FilePath/")) {
    name = decodeURIComponent(name.split("Special:FilePath/").pop().split("?")[0]);
  } else if (name.includes("/images/")) {
    name = decodeURIComponent(name.split("/images/").pop().split("?")[0]);
  } else {
    name = name.replace(/^File:/i, "").trim();
  }

  const underscored = name.replace(/ /g, "_");
  return `${WIKI_ORIGIN}/images/${underscored}`;
}

export function wikiFilePathUrl(filenameOrUrl) {
  if (!filenameOrUrl) return "";
  let name = String(filenameOrUrl).trim();
  if (name.includes("Special:FilePath/")) {
    name = decodeURIComponent(name.split("Special:FilePath/").pop().split("?")[0]);
  } else if (name.includes("/images/")) {
    name = decodeURIComponent(name.split("/images/").pop().split("?")[0].replace(/_/g, " "));
  } else {
    name = name.replace(/^File:/i, "").trim();
  }
  return `${WIKI_ORIGIN}/wiki/Special:FilePath/${encodeURIComponent(name)}`;
}

export function imgHtml({ src, alt = "", className = "", width, height }) {
  const primary = wikiImageUrl(src);
  const fallback = wikiFilePathUrl(src);
  const w = width ? ` width="${width}"` : "";
  const h = height ? ` height="${height}"` : "";
  const cls = className ? ` class="${className}"` : "";
  return `<img${cls} src="${primary}" alt="${alt}"${w}${h} loading="lazy" referrerpolicy="no-referrer" data-fallback="${fallback}" />`;
}

/** Star tiers matching clashofcritters.wiki.gg/wiki/Tatari (Star v3 icons). */
export const STAR_TIERS = [
  { min: 1, max: 6, label: "bronce", file: "Star v3 1.png" },
  { min: 7, max: 12, label: "plata", file: "Star v3 2.png" },
  { min: 13, max: 18, label: "oro", file: "Star v3 3.png" },
  { min: 19, max: 24, label: "lunas plata", file: "Star v3 4.png" },
  { min: 25, max: 30, label: "lunas oro", file: "Star v3 5.png" },
  { min: 31, max: 36, label: "lunas iridiscentes", file: "Star v3 6.png" },
  { min: 37, max: 42, label: "soles oro", file: "Star v3 7.png" },
  { min: 43, max: 48, label: "soles iridiscentes", file: "Star v3 8.png" },
  { min: 49, max: 54, label: "soles rojos", file: "Star v3 9.png" },
  { min: 55, max: 60, label: "coronas azules", file: "Star v3 10.png" },
  { min: 61, max: 66, label: "coronas oro", file: "Star v3 11.png" },
  { min: 67, max: 72, label: "coronas iridiscentes", file: "Star v3 12.png" },
  { min: 73, max: 79, label: "estrella con cintas", file: "Star v3 13.png" },
  {
    min: 80,
    max: 86,
    label: "estrella con alas",
    file: "Iridescent 6 pointed star with gold wings.png",
  },
];

export function getStarTier(stars) {
  const n = Math.max(0, Math.min(86, Number(stars) || 0));
  if (n <= 0) return null;
  const index = STAR_TIERS.findIndex((t) => n >= t.min && n <= t.max);
  if (index < 0) return null;
  const tier = STAR_TIERS[index];
  const slots = tier.max - tier.min + 1;
  const count = n - tier.min + 1;
  const prev = index > 0 ? STAR_TIERS[index - 1] : null;
  return {
    ...tier,
    index,
    slots,
    count,
    prevCount: prev ? slots - count : 0,
    prev,
    stars: n,
  };
}

function starIconHtml(file) {
  const icon = wikiImageUrl(file);
  const fallback = wikiFilePathUrl(file);
  return `<img src="${icon}" alt="" referrerpolicy="no-referrer" data-fallback="${fallback}" />`;
}

/**
 * Max 6 icons per tier row: current on the left, previous fills the rest
 * (e.g. 1 plata + 5 bronce).
 */
export function renderStarVisual(stars, { compact = false } = {}) {
  const tier = getStarTier(stars);
  if (!tier) {
    return compact
      ? ""
      : `<div class="star-visual is-empty"><span class="star-label">Sin estrellas</span></div>`;
  }

  const icons = [];
  for (let i = 0; i < tier.count; i++) icons.push(starIconHtml(tier.file));
  if (tier.prev) {
    for (let i = 0; i < tier.prevCount; i++) icons.push(starIconHtml(tier.prev.file));
  }

  const label = compact
    ? ""
    : `<span class="star-label">${tier.count}/${tier.slots} ${tier.label} · nv. ${tier.stars}</span>`;

  return `
    <div class="star-visual${compact ? " is-compact" : ""}" title="Nivel ${tier.stars}">
      <div class="star-icons">${icons.join("")}</div>
      ${label}
    </div>
  `;
}

export function bindImageFallbacks(root = document) {
  root.addEventListener(
    "error",
    (e) => {
      const t = e.target;
      if (!(t instanceof HTMLImageElement)) return;
      const fb = t.getAttribute("data-fallback");
      if (!fb || t.getAttribute("data-failed") === "1") return;
      if (t.src === fb || t.src.endsWith(fb)) {
        t.setAttribute("data-failed", "1");
        return;
      }
      t.setAttribute("data-fallback-tried", "1");
      t.src = fb;
    },
    true
  );
}
