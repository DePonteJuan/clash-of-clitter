#!/usr/bin/env node
/**
 * Scrapes Clash of Critters wiki for Tatari evolution lines.
 * Writes ../data/evolutions.json
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API = "https://clashofcritters.wiki.gg/api.php";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "evolutions.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = new URL(API);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("format", "json");
  const res = await fetch(url, {
    headers: { "User-Agent": "ClashOfCrittersEvolutionPlanner/1.0 (GitHub Pages scraper)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function listInfoboxPages() {
  const titles = [];
  let offset = 0;
  for (;;) {
    const data = await api({
      action: "query",
      list: "search",
      srsearch: 'insource:"Infobox critter"',
      srnamespace: "0",
      srlimit: "50",
      sroffset: String(offset),
    });
    const hits = data?.query?.search ?? [];
    for (const h of hits) titles.push(h.title);
    if (!data.continue?.sroffset) break;
    offset = data.continue.sroffset;
    await sleep(200);
  }
  return [...new Set(titles)];
}

async function fetchWikitext(title) {
  const data = await api({
    action: "parse",
    page: title,
    prop: "wikitext",
    formatversion: "2",
  });
  return data?.parse?.wikitext ?? "";
}

function extractInfobox(wikitext) {
  const start = wikitext.indexOf("{{Infobox critter");
  if (start < 0) return null;
  let i = start;
  let depth = 0;
  while (i < wikitext.length) {
    if (wikitext.startsWith("{{", i)) {
      depth++;
      i += 2;
      continue;
    }
    if (wikitext.startsWith("}}", i)) {
      depth--;
      i += 2;
      if (depth === 0) return wikitext.slice(start, i);
      continue;
    }
    i++;
  }
  return null;
}

function parseInfoboxFields(box) {
  const fields = {};
  const re = /^\|\s*([^=|\n]+?)\s*=\s*(.*)$/gm;
  let m;
  while ((m = re.exec(box))) {
    const key = m[1].trim();
    let val = m[2].trim();
    if (key === "Feeding Upgrade List") continue;
    fields[key] = val;
  }
  return fields;
}

function parseStages(fields) {
  const stages = [];
  for (let n = 1; n <= 4; n++) {
    let raw = (fields[`Stage ${n}`] || "").trim();
    // Wiki often writes "|Stage 3=|Feeding Upgrade List=..." on one line
    if (raw.includes("|")) raw = raw.split("|")[0].trim();
    if (!raw || raw.includes("{{") || raw.includes("Feedrow")) continue;
    if (!/^[A-Za-z][\w' -]*$/.test(raw)) continue;
    stages.push(raw);
  }
  return stages;
}

function starPhraseToLevel(count, unit) {
  const u = String(unit || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  if (!u || u === "star" || u === "stars") return count;
  const table = [
    [/^bronze\s+stars?$/, 0],
    [/^silver\s+stars?$/, 6],
    [/^gold\s+stars?$/, 12],
    [/^silver\s+(?:crescent\s+)?moons?$/, 18],
    [/^gold\s+(?:crescent\s+)?moons?$/, 24],
    [/^iridescent\s+(?:crescent\s+)?moons?$/, 30],
    [/^gold\s+suns?$/, 36],
    [/^iridescent\s+suns?$/, 42],
    [/^red\s+suns?$/, 48],
    [/^blue\s+crowns?$/, 54],
    [/^gold\s+crowns?$/, 60],
    [/^iridescent\s+crowns?$/, 66],
  ];
  for (const [re, base] of table) {
    if (re.test(u)) return base + count;
  }
  return count;
}

function extractStarsRequired(wikitext, evolvesTo) {
  if (!evolvesTo) return null;
  const escaped = evolvesTo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const unit =
    String.raw`((?:bronze|silver|gold|iridescent|red|blue)\s+(?:crescent\s+)?(?:stars?|moons?|suns?|crowns?)|stars?)`;
  const patterns = [
    new RegExp(
      String.raw`(?:evolves\s+)?into\s*\[\[${escaped}[^\]]*\]\]\s*at\s+(\d+)\s*${unit}`,
      "i"
    ),
    new RegExp(
      String.raw`evolution trial (?:unlocks|begins) once[^.]*?(?:reaches\s+)?(\d+)\s*${unit}`,
      "i"
    ),
    new RegExp(
      String.raw`evolves into\s*\[\[[^\]]+\]\]\s*at\s+(\d+)\s*${unit}`,
      "i"
    ),
  ];
  for (const p of patterns) {
    const m = wikitext.match(p);
    if (m) return starPhraseToLevel(Number(m[1]), m[2]);
  }
  return null;
}

function extractTrials(wikitext) {
  const sectionMatch = wikitext.match(
    /==\s*Evolution Trials?\s*==([\s\S]*?)(?=\n==[^=]|$)/i
  );
  if (!sectionMatch) return [];
  const section = sectionMatch[1];
  const bullets = [];
  for (const line of section.split("\n")) {
    const m = line.match(/^\*\s*(.+)$/);
    if (!m) continue;
    let text = m[1]
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
      .replace(/\[\[([^\]]+)\]\]/g, "$1")
      .replace(/'{2,}/g, "")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (text) bullets.push(text);
  }
  return bullets;
}

function imageUrl(filename) {
  if (!filename) return null;
  const name = filename.replace(/^File:/i, "").trim().replace(/ /g, "_");
  // Direct /images/ path works better in browsers than Special:FilePath (403/hotlink).
  return `https://clashofcritters.wiki.gg/images/${name}`;
}

async function main() {
  console.log("Discovering Infobox pages…");
  const titles = await listInfoboxPages();
  console.log(`Found ${titles.length} pages`);

  const byTitle = new Map();
  let i = 0;
  for (const title of titles) {
    i++;
    if (i % 20 === 0 || i === 1) console.log(`  [${i}/${titles.length}] ${title}`);
    try {
      const wikitext = await fetchWikitext(title);
      const box = extractInfobox(wikitext);
      if (!box) continue;
      const fields = parseInfoboxFields(box);
      const stages = parseStages(fields);
      if (!stages.length) continue;
      const name = (fields.Name || title).trim();
      const stageIndex = stages.findIndex((s) => s.toLowerCase() === name.toLowerCase());
      const nextName =
        stageIndex >= 0 && stageIndex < stages.length - 1 ? stages[stageIndex + 1] : null;
      byTitle.set(name, {
        name,
        type: (fields.Type || "").trim() || null,
        rarity: (fields.Rarity || "").trim() || null,
        role: (fields.Role || "").trim() || null,
        image: (fields.image || `${name}.png`).trim(),
        stages,
        stageIndex: stageIndex >= 0 ? stageIndex : 0,
        evolvesTo: nextName,
        starsRequired: extractStarsRequired(wikitext, nextName),
        trials: nextName ? extractTrials(wikitext) : [],
        wikiTitle: title,
      });
    } catch (err) {
      console.warn(`  skip ${title}: ${err.message}`);
    }
    await sleep(150);
  }

  // Group into lines by Stage 1
  const lineMap = new Map();
  for (const entry of byTitle.values()) {
    const lineId = entry.stages[0];
    if (!lineMap.has(lineId)) {
      lineMap.set(lineId, {
        id: lineId,
        type: entry.type,
        role: entry.role,
        stageNames: entry.stages,
        entries: [],
      });
    }
    const line = lineMap.get(lineId);
    line.entries.push(entry);
    if (!line.type && entry.type) line.type = entry.type;
    if (!line.role && entry.role) line.role = entry.role;
    if (entry.stages.length > line.stageNames.length) line.stageNames = entry.stages;
  }

  const lines = [];
  for (const line of lineMap.values()) {
    const stageNames = line.stageNames;
    const stages = stageNames.map((stageName, idx) => {
      const entry =
        line.entries.find((e) => e.name.toLowerCase() === stageName.toLowerCase()) ||
        byTitle.get(stageName);
      const next = idx < stageNames.length - 1 ? stageNames[idx + 1] : null;
      const fromEntry = entry || {};
      return {
        name: stageName,
        rarity: fromEntry.rarity || null,
        image: fromEntry.image || `${stageName}.png`,
        imageUrl: imageUrl(fromEntry.image || `${stageName}.png`),
        wiki: `https://clashofcritters.wiki.gg/wiki/${encodeURIComponent(
          (fromEntry.wikiTitle || stageName).replace(/ /g, "_")
        )}`,
        evolvesTo: next,
        starsRequired: next ? fromEntry.starsRequired ?? null : null,
        trials: next ? fromEntry.trials || [] : [],
      };
    });

    // Prefer type/role from stage 1 entry
    const base = line.entries.find((e) => e.stageIndex === 0) || line.entries[0];
    lines.push({
      id: line.id,
      type: line.type || base?.type || null,
      role: line.role || base?.role || null,
      rarity: stages[0]?.rarity || null,
      stages,
    });
  }

  lines.sort((a, b) => a.id.localeCompare(b.id));

  const payload = {
    updatedAt: new Date().toISOString(),
    source: "https://clashofcritters.wiki.gg",
    lineCount: lines.length,
    lines,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`Wrote ${lines.length} lines → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
