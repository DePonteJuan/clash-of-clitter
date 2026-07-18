import { t, getContentLang } from "./i18n.js";
import { TEAM_SIZE } from "./storage.js";
import {
  classifyTrial,
  parseOwnGoal,
  countOwnedOfType,
  extractTrialCosts,
} from "./objectives.js";
import { imgHtml } from "./wiki.js";
import { translatedTrial } from "./trialTranslate.js";

export const UTIL_PAGES = [
  { id: "types", labelKey: "utilTypes" },
  { id: "feed", labelKey: "utilFeed" },
  { id: "collection", labelKey: "utilCollection" },
  { id: "priority", labelKey: "utilPriority" },
  { id: "minigames", labelKey: "utilMinigames" },
];

export const CATALOG_PAGE_SIZE = 12;

/**
 * @param {{ tiers?: Record<string, string[]> }} tiersData
 * @param {string} lineId
 */
export function getTierLabel(tiersData, lineId) {
  const tiers = tiersData?.tiers || {};
  for (const [tier, ids] of Object.entries(tiers)) {
    if (ids.includes(lineId)) return tier;
  }
  return "";
}

export function tierSortKey(tier) {
  const order = { "S+": 0, S: 1, A: 2, B: 3, C: 4 };
  return order[tier] ?? 50;
}

/**
 * @param {object} typeChart
 * @param {string} attacker
 * @param {string} defender
 */
export function matchup(typeChart, attacker, defender) {
  if (!attacker || !defender) return "neutral";
  const strong = typeChart?.strongAgainst?.[attacker] || [];
  const weak = typeChart?.weakAgainst?.[attacker] || [];
  if (strong.includes(defender)) return "strong";
  if (weak.includes(defender)) return "weak";
  return "neutral";
}

export function renderUtilPager(activeId) {
  return `
    <div class="util-pager" role="tablist" aria-label="${t("utilPager")}">
      ${UTIL_PAGES.map(
        (p, i) => `
        <button type="button" class="util-page-chip ${
          p.id === activeId ? "is-active" : ""
        }" data-action="util-page" data-page="${p.id}" role="tab" aria-selected="${
          p.id === activeId
        }">
          <span class="util-page-num">${i + 1}</span>
          <span>${t(p.labelKey)}</span>
        </button>`
      ).join("")}
    </div>
  `;
}

export function renderTypesPage(typeChart, typeLabelFn) {
  const types = typeChart?.types || [];
  const rows = types
    .map((ty) => {
      const strong = (typeChart.strongAgainst?.[ty] || [])
        .map(typeLabelFn)
        .join(", ");
      const weak = (typeChart.weakAgainst?.[ty] || [])
        .map(typeLabelFn)
        .join(", ");
      return `<tr>
        <th>${typeLabelFn(ty)}</th>
        <td class="is-strong">${strong || "—"}</td>
        <td class="is-weak">${weak || "—"}</td>
      </tr>`;
    })
    .join("");

  const tips = types
    .map((enemy) => {
      const counters = types.filter((a) =>
        (typeChart.strongAgainst?.[a] || []).includes(enemy)
      );
      return `<li><strong>${typeLabelFn(enemy)}</strong> → ${
        counters.map(typeLabelFn).join(", ") || "—"
      }</li>`;
    })
    .join("");

  return `
    <div class="tool-block">
      <h2>${t("utilTypes")}</h2>
      <p class="tool-intro">${t("typesIntro")}</p>
      <div class="type-cycle" aria-hidden="true">
        ${(typeChart?.types || [])
          .map((ty) => `<span class="type-cycle-node type-${ty.toLowerCase()}">${typeLabelFn(ty)}</span>`)
          .join('<span class="type-cycle-arrow">→</span>')}
        <span class="type-cycle-arrow">↻</span>
      </div>
      <table class="tool-table">
        <thead>
          <tr>
            <th>${t("type")}</th>
            <th>${t("typesStrong")}</th>
            <th>${t("typesWeak")}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <h3>${t("typesEnemyTitle")}</h3>
      <ul class="tool-list">${tips}</ul>
    </div>
  `;
}

export function renderCollectionPage(ctx) {
  const { catalog, state, getLineProgress, typeLabel, roleLabel, rarityLabel } =
    ctx;
  const lines = catalog.lines || [];
  const owned = lines.filter((l) => getLineProgress(state, l.id).owned);
  const pct = lines.length
    ? Math.round((owned.length / lines.length) * 100)
    : 0;

  function bar(label, have, total) {
    const p = total ? Math.round((have / total) * 100) : 0;
    return `
      <div class="stat-bar">
        <div class="stat-bar-top">
          <span>${label}</span>
          <span>${have}/${total} (${p}%)</span>
        </div>
        <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${p}%"></div></div>
      </div>`;
  }

  const byType = {};
  const byRarity = {};
  const byRole = {};
  for (const l of lines) {
    byType[l.type] = byType[l.type] || { have: 0, total: 0 };
    byType[l.type].total += 1;
    byRarity[l.rarity] = byRarity[l.rarity] || { have: 0, total: 0 };
    byRarity[l.rarity].total += 1;
    const role = l.role || "?";
    byRole[role] = byRole[role] || { have: 0, total: 0 };
    byRole[role].total += 1;
  }
  for (const l of owned) {
    if (byType[l.type]) byType[l.type].have += 1;
    if (byRarity[l.rarity]) byRarity[l.rarity].have += 1;
    const role = l.role || "?";
    if (byRole[role]) byRole[role].have += 1;
  }

  const missing = lines
    .filter((l) => !getLineProgress(state, l.id).owned)
    .slice(0, 24)
    .map(
      (l) =>
        `<li><button type="button" class="linkish" data-action="filter-catalog-line" data-line="${l.id}">${l.id}</button> · ${typeLabel(l.type)} · ${rarityLabel(l.rarity)}</li>`
    )
    .join("");

  const ownGoals = [];
  for (const l of owned) {
    const progress = getLineProgress(state, l.id);
    const stage = l.stages?.[progress.currentStageIndex];
    if (!stage?.trials) continue;
    stage.trials.forEach((trial, i) => {
      if (progress.trialsDone[i]) return;
      const own = parseOwnGoal(trial);
      if (!own) return;
      const have = countOwnedOfType(
        catalog,
        state,
        getLineProgress,
        own.type,
        own.stars
      );
      ownGoals.push({
        lineId: l.id,
        have,
        need: own.count,
        stars: own.stars,
        type: own.type,
      });
    });
  }

  return `
    <div class="tool-block">
      <h2>${t("utilCollection")}</h2>
      <p class="tool-intro">${t("collectionIntro", {
        have: owned.length,
        total: lines.length,
        pct,
      })}</p>
      ${bar(t("collectionGlobal"), owned.length, lines.length)}
      <h3>${t("type")}</h3>
      ${Object.entries(byType)
        .map(([k, v]) => bar(typeLabel(k), v.have, v.total))
        .join("")}
      <h3>${t("rarity")}</h3>
      ${Object.entries(byRarity)
        .map(([k, v]) => bar(rarityLabel(k), v.have, v.total))
        .join("")}
      <h3>${t("role")}</h3>
      ${Object.entries(byRole)
        .map(([k, v]) => bar(roleLabel(k) || k, v.have, v.total))
        .join("")}
      ${
        ownGoals.length
          ? `<h3>${t("collectionOwnGoals")}</h3>
        <ul class="tool-list">${ownGoals
          .map(
            (g) =>
              `<li>${g.lineId}: ${t("ownProgress", {
                have: g.have,
                need: g.need,
                stars: g.stars,
                type: typeLabel(
                  ["Water", "Fire", "Grass", "Rock", "Lightning"].find(
                    (x) => x.toLowerCase() === String(g.type).toLowerCase()
                  ) || g.type
                ),
              })}</li>`
          )
          .join("")}</ul>`
          : ""
      }
      <h3>${t("collectionMissing")}</h3>
      <ul class="tool-list">${missing || `<li>${t("collectionComplete")}</li>`}</ul>
    </div>
  `;
}

export function renderFeedPage(ctx) {
  const {
    catalog,
    state,
    getLineProgress,
    feeding,
    getFeedToday,
    typeLabel,
  } = ctx;
  const today = getFeedToday(state);
  const limit = feeding?.dailyFeedLimit || 15;
  const stages = feeding?.stages || [];
  const owned = (catalog.lines || []).filter(
    (l) => getLineProgress(state, l.id).owned
  );

  const tableRows = stages
    .map(
      (s) => `<tr>
      <td>${s.stage}</td>
      <td>${s.pointsRequired ?? "—"}</td>
      <td>${s.starsRequired ?? "—"}</td>
    </tr>`
    )
    .join("");

  const needsB = owned.filter((l) => {
    const p = getLineProgress(state, l.id);
    const stage = l.stages?.[p.currentStageIndex];
    const trials = stage?.trials || [];
    const nextRarity = stage?.evolvesTo
      ? l.stages.find((s) => s.name === stage.evolvesTo)?.rarity
      : null;
    return (
      trials.some((tr) => /B\s*quality/i.test(tr)) || nextRarity === "Rainbow"
    );
  });

  const ownedRows = owned
    .map((l) => {
      const p = getLineProgress(state, l.id);
      const grades = (feeding?.gradeLetters || ["E", "D", "C", "B", "A", "S"])
        .map(
          (g) =>
            `<option value="${g}" ${p.feedGrade === g ? "selected" : ""}>${g}</option>`
        )
        .join("");
      return `<tr>
        <td>${l.id}</td>
        <td>${typeLabel(l.type)}</td>
        <td>
          <select data-action="feed-grade" data-line="${l.id}">
            <option value="">—</option>
            ${grades}
          </select>
        </td>
        <td>
          <input type="number" min="0" max="15" step="1" value="${
            p.feedStage ?? ""
          }" data-action="feed-stage" data-line="${l.id}" placeholder="0–15" />
        </td>
      </tr>`;
    })
    .join("");

  return `
    <div class="tool-block">
      <h2>${t("utilFeed")}</h2>
      <p class="tool-intro">${t("feedIntro", { limit })}</p>
      <div class="feed-counter">
        <button type="button" class="btn ghost" data-action="feed-bump" data-delta="-1">−</button>
        <strong>${today.count} / ${limit}</strong>
        <button type="button" class="btn" data-action="feed-bump" data-delta="1">+</button>
      </div>
      <table class="tool-table">
        <thead>
          <tr>
            <th>${t("feedStage")}</th>
            <th>${t("feedPoints")}</th>
            <th>${t("stars")}</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      ${
        needsB.length
          ? `<p class="tool-warn">${t("feedNeedsB")}: ${needsB
              .map((l) => l.id)
              .join(", ")}</p>`
          : ""
      }
      <h3>${t("feedOwnedTitle")}</h3>
      ${
        owned.length
          ? `<table class="tool-table">
        <thead>
          <tr>
            <th>Tatari</th>
            <th>${t("type")}</th>
            <th>${t("feedGrade")}</th>
            <th>${t("feedStage")}</th>
          </tr>
        </thead>
        <tbody>${ownedRows}</tbody>
      </table>`
          : `<p class="empty">${t("feedNoOwned")}</p>`
      }
    </div>
  `;
}

export function renderPriorityPage(ctx) {
  const {
    catalog,
    state,
    getLineProgress,
    getNextStep,
    isReadyToEvolve,
    tiersData,
    typeLabel,
  } = ctx;

  const rows = (catalog.lines || [])
    .map((line) => {
      const progress = getLineProgress(state, line.id);
      const next = getNextStep(line, progress);
      const tier = getTierLabel(tiersData, line.id);
      const ready = isReadyToEvolve(line, progress);
      const inPlan = state.planOrder.includes(line.id);
      return { line, progress, next, tier, ready, inPlan };
    })
    .filter((r) => r.progress.owned && r.next)
    .sort((a, b) => {
      const ta = tierSortKey(a.tier);
      const tb = tierSortKey(b.tier);
      if (ta !== tb) return ta - tb;
      if (a.ready !== b.ready) return a.ready ? -1 : 1;
      return a.line.id.localeCompare(b.line.id);
    });

  const list = rows
    .map((r) => {
      const display = r.progress.owned
        ? r.line.stages[r.progress.currentStageIndex]
        : r.line.stages[0];
      return `
      <article class="prio-row">
        ${imgHtml({
          src: display?.imageUrl || display?.image,
          alt: "",
          width: 40,
          height: 40,
        })}
        <div class="prio-text">
          <strong>${r.line.id}</strong>
          <span>${typeLabel(r.line.type)}${
            r.tier ? ` · ${r.tier}` : ""
          }${r.ready ? ` · ${t("ready")}` : ""}${
            r.inPlan ? ` · ${t("tabPlanned")}` : ""
          }</span>
        </div>
        <div class="prio-actions">
          ${
            r.inPlan
              ? ""
              : `<button type="button" class="btn sm" data-action="plan" data-line="${r.line.id}">${t("addToPlan")}</button>`
          }
          <button type="button" class="btn sm ghost" data-action="details" data-line="${r.line.id}">${t("seeDetails")}</button>
        </div>
      </article>`;
    })
    .join("");

  return `
    <div class="tool-block">
      <h2>${t("utilPriority")}</h2>
      <p class="tool-intro">${t("priorityIntro")}</p>
      <p class="tool-disclaimer">${t("priorityDisclaimer")}</p>
      <div class="prio-list">${list || `<p class="empty">${t("priorityEmpty")}</p>`}</div>
    </div>
  `;
}

export function renderMinigamesPage(ctx) {
  const {
    catalog,
    state,
    getLineProgress,
    getNextStep,
    planOnly,
  } = ctx;
  const lang = getContentLang();
  const planSet = new Set(state.planOrder || []);
  /** @type {Record<string, { trials: { lineId: string, text: string }[], costs: Record<string, number> }>} */
  const groups = {};

  for (const line of catalog.lines || []) {
    const progress = getLineProgress(state, line.id);
    if (!progress.owned) continue;
    if (planOnly && !planSet.has(line.id)) continue;
    const next = getNextStep(line, progress);
    if (!next) continue;
    next.trials.forEach((trial, i) => {
      if (progress.trialsDone[i]) return;
      const c = classifyTrial(trial);
      if (c.category !== "minigame") return;
      const tag = c.subtag || "other";
      if (!groups[tag]) groups[tag] = { trials: [], costs: {} };
      groups[tag].trials.push({ lineId: line.id, text: trial });
      for (const cost of extractTrialCosts(trial)) {
        groups[tag].costs[cost.key] =
          (groups[tag].costs[cost.key] || 0) + cost.amount;
      }
    });
  }

  const tags = Object.keys(groups).sort();
  const blocks = tags
    .map((tag) => {
      const g = groups[tag];
      const costLine = Object.entries(g.costs)
        .map(([k, v]) => `${t("cost_" + k)}: ${v.toLocaleString()}`)
        .join(" · ");
      return `
        <section class="objectives-group">
          <div class="objectives-group-head">
            <h3>${t("mini_" + tag)}</h3>
            <span class="objectives-group-count">${g.trials.length}</span>
          </div>
          ${costLine ? `<p class="mini-costs">${costLine}</p>` : ""}
          <ul class="tool-list">
            ${g.trials
              .map(
                (tr) =>
                  `<li><strong>${tr.lineId}</strong> — ${translatedTrial(
                    tr.text,
                    lang
                  )}</li>`
              )
              .join("")}
          </ul>
        </section>`;
    })
    .join("");

  return `
    <div class="tool-block">
      <h2>${t("utilMinigames")}</h2>
      <p class="tool-intro">${t("minigamesIntro")}</p>
      <label class="check-inline">
        <input type="checkbox" id="mini-plan-only" data-action="mini-plan-only" ${
          planOnly ? "checked" : ""
        } />
        <span data-i18n="objectivesPlanOnly">${t("miniPlanOnly")}</span>
      </label>
      <div class="objectives-list" style="margin-top:1rem">${
        blocks || `<p class="empty">${t("minigamesEmpty")}</p>`
      }</div>
    </div>
  `;
}

/**
 * Official-ish grids from wiki / community guides:
 * - Campaign ch.1–3: 3 columns × 3 rows = 9
 * - Campaign ch.4+: 5 lanes × 3 rows = 15
 * - Horde Invasion / Boss Challenge: same 15 board
 * - Badge Dojo: 5v5 (5 Tatari)
 *
 * Index layout for 15: front 0–4, mid 5–9, back 10–14 (left→right).
 * Index layout for 9:  front 0–2, mid 3–5, back 6–8.
 * Dojo: 0–4 in a compact front/mid/back shell.
 */
function cell(i, id, prefer = []) {
  return { i, id, prefer };
}

function row3(row, a, b, c) {
  return { row, cells: [a, b, c] };
}

function row5(row, a, b, c, d, e) {
  return { row, cells: [a, b, c, d, e] };
}

const PREF_FRONT = ["tank", "guardian"];
const PREF_MID = ["dps"];
const PREF_BACK = ["healer", "support", "specialist"];

export const TEAM_MODES = [
  {
    id: "early",
    deploy: 9,
    cols: 3,
    rows: [
      row3(
        "front",
        cell(0, "holder", PREF_FRONT),
        cell(1, "holder", PREF_FRONT),
        cell(2, "holder", PREF_FRONT)
      ),
      row3(
        "mid",
        cell(3, "damage", PREF_MID),
        cell(4, "damage", PREF_MID),
        cell(5, "damage", PREF_MID)
      ),
      row3(
        "back",
        cell(6, "util", PREF_BACK),
        cell(7, "util", PREF_BACK),
        cell(8, "util", PREF_BACK)
      ),
    ],
    checks: ["holder", "damage", "util"],
  },
  {
    id: "campaign",
    deploy: 15,
    cols: 5,
    rows: [
      row5(
        "front",
        cell(0, "holder", PREF_FRONT),
        cell(1, "holder", PREF_FRONT),
        cell(2, "holder", PREF_FRONT),
        cell(3, "holder", PREF_FRONT),
        cell(4, "holder", PREF_FRONT)
      ),
      row5(
        "mid",
        cell(5, "damage", PREF_MID),
        cell(6, "damage", PREF_MID),
        cell(7, "damage", PREF_MID),
        cell(8, "damage", PREF_MID),
        cell(9, "damage", PREF_MID)
      ),
      row5(
        "back",
        cell(10, "util", PREF_BACK),
        cell(11, "util", PREF_BACK),
        cell(12, "util", PREF_BACK),
        cell(13, "util", PREF_BACK),
        cell(14, "util", PREF_BACK)
      ),
    ],
    checks: ["holder", "damage", "util"],
  },
  {
    id: "invasion",
    deploy: 15,
    cols: 5,
    rows: [
      row5(
        "front",
        cell(0, "holder", PREF_FRONT),
        cell(1, "holder", PREF_FRONT),
        cell(2, "holder", PREF_FRONT),
        cell(3, "holder", PREF_FRONT),
        cell(4, "holder", PREF_FRONT)
      ),
      row5(
        "mid",
        cell(5, "wave", PREF_MID),
        cell(6, "wave", PREF_MID),
        cell(7, "control", ["specialist", "dps"]),
        cell(8, "wave", PREF_MID),
        cell(9, "wave", PREF_MID)
      ),
      row5(
        "back",
        cell(10, "support", ["healer", "support"]),
        cell(11, "support", ["healer", "support"]),
        cell(12, "aura", []),
        cell(13, "support", ["healer", "support"]),
        cell(14, "aura", [])
      ),
    ],
    checks: ["holder", "wave", "support"],
  },
  {
    id: "boss",
    deploy: 15,
    cols: 5,
    rows: [
      row5(
        "front",
        cell(0, "holder", PREF_FRONT),
        cell(1, "holder", PREF_FRONT),
        cell(2, "holder", PREF_FRONT),
        cell(3, "holder", PREF_FRONT),
        cell(4, "holder", PREF_FRONT)
      ),
      row5(
        "mid",
        cell(5, "burst", PREF_MID),
        cell(6, "burst", PREF_MID),
        cell(7, "burst", PREF_MID),
        cell(8, "utility", ["specialist", "support"]),
        cell(9, "burst", PREF_MID)
      ),
      row5(
        "back",
        cell(10, "buffer", ["healer", "support"]),
        cell(11, "buffer", ["healer", "support"]),
        cell(12, "buffer", ["healer", "support"]),
        cell(13, "utility", ["specialist", "support"]),
        cell(14, "buffer", ["healer", "support"])
      ),
    ],
    checks: ["holder", "burst", "buffer"],
  },
  {
    id: "dojo",
    deploy: 5,
    cols: 3,
    rows: [
      row3(
        "front",
        cell(0, "front", PREF_FRONT),
        cell(1, "front", PREF_FRONT),
        null
      ),
      row3("mid", null, cell(2, "carry", PREF_MID), null),
      row3(
        "back",
        cell(3, "support", ["healer", "support"]),
        cell(4, "control", ["specialist", "dps"]),
        null
      ),
    ],
    checks: ["front", "carry", "support"],
  },
];

export function getTeamMode(modeId) {
  return TEAM_MODES.find((m) => m.id === modeId) || TEAM_MODES[1];
}

/** Flat list of real slots for a mode (skips null cells). */
export function modeSlotDefs(mode) {
  const out = [];
  for (const row of mode.rows || []) {
    for (const c of row.cells || []) {
      if (c) out.push(c);
    }
  }
  return out.sort((a, b) => a.i - b.i);
}

function roleMatchesPrefer(role, prefer) {
  if (!prefer?.length) return true;
  const r = String(role || "").toLowerCase();
  return prefer.some((p) => r.includes(p));
}

function lineAura(line) {
  return (
    line?.aura ||
    line?.stages?.find((s) => s.aura)?.aura ||
    null
  );
}

function laneMatchClass(typeChart, attackerType, laneTypes) {
  if (!attackerType || !laneTypes?.length) return "";
  let strong = false;
  let weak = false;
  for (const def of laneTypes) {
    const m = matchup(typeChart, attackerType, def);
    if (m === "strong") strong = true;
    if (m === "weak") weak = true;
  }
  if (strong && !weak) return "is-strong";
  if (weak && !strong) return "is-weak";
  if (strong && weak) return "is-mixed";
  return "";
}

function renderTeamCell(
  slotDef,
  slots,
  catalog,
  laneTypes,
  globalEnemy,
  typeChart,
  ctx,
  laneIndex
) {
  const { typeLabel, roleLabel, imgForLine } = ctx;
  if (!slotDef) {
    return `<div class="team-cell is-spacer" aria-hidden="true"></div>`;
  }

  const i = slotDef.i;
  const id = slots[i];
  const line = id ? catalog.lines.find((l) => l.id === id) : null;
  let matchClass = "";
  if (line) {
    if (laneTypes?.length) {
      matchClass = laneMatchClass(typeChart, line.type, laneTypes);
    } else if (globalEnemy) {
      const m = matchup(typeChart, line.type, globalEnemy);
      if (m === "strong") matchClass = "is-strong";
      if (m === "weak") matchClass = "is-weak";
    }
  }
  const preferOk =
    !line ||
    !slotDef.prefer.length ||
    roleMatchesPrefer(line.role, slotDef.prefer);
  if (line && !preferOk) matchClass = `${matchClass} is-offrole`.trim();

  return `
    <div class="team-cell team-slot ${matchClass}" data-slot="${i}" data-lane="${laneIndex}">
      <span class="team-slot-role">${t(`teamSlot_${slotDef.id}`)}</span>
      ${
        line
          ? `${imgForLine(line)}
        <strong>${line.id}</strong>
        <span>${typeLabel(line.type)} · ${roleLabel(line.role)}</span>
        <div class="team-slot-actions">
          <button type="button" class="btn team-pick-btn ghost" data-action="team-pick" data-slot="${i}">${t(
            "teamChange"
          )}</button>
          <button type="button" class="btn team-pick-btn ghost" data-action="team-clear" data-slot="${i}">${t(
            "remove"
          )}</button>
        </div>`
          : `<button type="button" class="btn team-pick-btn" data-action="team-pick" data-slot="${i}">${t(
              "teamPick"
            )}</button>
        <span class="team-slot-hint">${
          slotDef.prefer.length
            ? slotDef.prefer.map((p) => roleLabel(p) || p).join(" / ")
            : t("teamSlotAny")
        }</span>`
      }
    </div>`;
}

function renderLaneEnemyRow(mode, laneEnemies, typeLabelFn, types) {
  if (mode.id !== "campaign" && mode.id !== "early") return "";
  const cols = mode.cols || 5;
  const colsHtml = Array.from({ length: cols }, (_, lane) => {
    const list = laneEnemies[lane] || [];
    const chips = list
      .map(
        (ty) => `
        <button type="button" class="team-zobo-chip type-${ty.toLowerCase()}" data-action="lane-enemy-remove" data-lane="${lane}" data-type="${ty}" title="${t(
          "teamZoboRemove"
        )}">
          ${typeLabelFn(ty)} ×
        </button>`
      )
      .join("");
    const available = types.filter((ty) => !list.includes(ty));
    const addSelect =
      list.length < 3 && available.length
        ? `<select class="team-zobo-add" data-action="lane-enemy-add" data-lane="${lane}" aria-label="${t(
            "teamZoboAdd"
          )}">
            <option value="">+</option>
            ${available
              .map((ty) => `<option value="${ty}">${typeLabelFn(ty)}</option>`)
              .join("")}
          </select>`
        : "";
    return `
      <div class="team-lane-zobo" data-lane="${lane}">
        ${chips || `<span class="team-zobo-empty">${t("teamZoboEmpty")}</span>`}
        ${addSelect}
      </div>`;
  }).join("");

  return `
    <div class="team-zobo-block">
      <p class="team-zobo-title">${t("teamZoboTitle")}</p>
      <p class="team-zobo-hint">${t("teamZoboHint")}</p>
      <div class="team-field-lanes team-zobo-lanes" style="--team-cols:${cols}">
        <span class="team-field-lane-spacer" aria-hidden="true"></span>
        <div class="team-field-lane-labels team-zobo-cols">${colsHtml}</div>
      </div>
    </div>`;
}

/**
 * @param {object} ctx
 */
export function renderTeamPanel(ctx) {
  const {
    catalog,
    state,
    typeChart,
    enemyType,
    teamMode,
    typeLabel,
    roleLabel,
  } = ctx;

  const mode = getTeamMode(teamMode);
  const slots = state.teamSlots || Array(TEAM_SIZE).fill(null);
  const laneEnemies = state.laneEnemies || [[], [], [], [], []];
  const modeSlots = modeSlotDefs(mode);
  const useLaneZobos = mode.id === "campaign" || mode.id === "early";
  const types = typeChart?.types || [
    "Water",
    "Fire",
    "Grass",
    "Rock",
    "Lightning",
  ];

  const filled = modeSlots
    .map((s) => {
      const id = slots[s.i];
      return id ? catalog.lines.find((l) => l.id === id) : null;
    })
    .filter(Boolean);

  const roleCounts = {};
  const typeCounts = {};
  const auras = [];
  for (const line of filled) {
    const role = String(line.role || "").toLowerCase() || "unknown";
    roleCounts[role] = (roleCounts[role] || 0) + 1;
    typeCounts[line.type] = (typeCounts[line.type] || 0) + 1;
    const aura = lineAura(line);
    if (aura) auras.push(`${line.id}: ${aura}`);
  }

  const warnings = [];
  if (filled.length) {
    for (const rowId of ["front", "mid", "back"]) {
      const row = (mode.rows || []).find((r) => r.row === rowId);
      if (!row) continue;
      const cells = (row.cells || []).filter(Boolean);
      if (!cells.length) continue;
      const n = cells.filter((c) => slots[c.i]).length;
      if (n === 0) {
        warnings.push(t("teamWarnRowEmpty", { row: t(`teamRow_${rowId}`) }));
      }
    }
    for (const checkId of mode.checks || []) {
      const defs = modeSlots.filter((s) => s.id === checkId);
      if (!defs.length) continue;
      const any = defs.some((s) => slots[s.i]);
      if (!any) {
        warnings.push(t("teamWarnSlot", { slot: t(`teamSlot_${checkId}`) }));
      }
    }
    if (mode.id === "invasion") {
      const hasAura = filled.some((l) => lineAura(l));
      if (!hasAura) warnings.push(t("teamWarnAura"));
    }
  }

  const typeOpts = (typeChart?.types || [])
    .map(
      (ty) =>
        `<option value="${ty}" ${
          enemyType === ty ? "selected" : ""
        }>${typeLabel(ty)}</option>`
    )
    .join("");

  const modeChips = TEAM_MODES.map(
    (m) => `
    <button type="button" class="type-chip ${
      m.id === mode.id ? "is-active" : ""
    }" data-action="team-mode" data-mode="${m.id}" role="option" aria-selected="${
      m.id === mode.id
    }">${t(`teamMode_${m.id}`)} <em class="team-mode-n">${m.deploy}</em></button>`
  ).join("");

  const cols = mode.cols || 5;
  const laneHeads =
    cols >= 3
      ? `<div class="team-field-lanes" style="--team-cols:${cols}">
          <span class="team-field-lane-spacer" aria-hidden="true"></span>
          <div class="team-field-lane-labels">
            ${Array.from(
              { length: cols },
              (_, i) =>
                `<span class="team-field-lane">${t("teamLane", {
                  n: i + 1,
                })}</span>`
            ).join("")}
          </div>
        </div>`
      : "";

  const boardRows = (mode.rows || [])
    .map((rowDef) => {
      const cells = (rowDef.cells || [])
        .map((c, laneIndex) =>
          renderTeamCell(
            c,
            slots,
            catalog,
            useLaneZobos ? laneEnemies[laneIndex] || [] : null,
            useLaneZobos ? "" : enemyType,
            typeChart,
            ctx,
            laneIndex
          )
        )
        .join("");
      return `
        <div class="team-field-row team-field-row-${rowDef.row}">
          <div class="team-field-row-label">
            <span class="team-field-row-name">${t(
              `teamRow_${rowDef.row}`
            )}</span>
            <span class="team-field-row-hint">${t(
              `teamRowHint_${rowDef.row}`
            )}</span>
          </div>
          <div class="team-field-cells" style="--team-cols:${cols}">${cells}</div>
        </div>`;
    })
    .join("");

  const deployMax = mode.deploy || modeSlots.length;
  const deployFilled = filled.length;
  const globalEnemySelect = useLaneZobos
    ? ""
    : `<label class="filter-search team-enemy-row">
        <span>${t("teamEnemyType")}</span>
        <select id="team-enemy-type" data-action="team-enemy">
          <option value="">—</option>
          ${typeOpts}
        </select>
      </label>`;

  return `
    <div class="tool-block">
      <h2>${t("tabTeam")}</h2>
      <p class="tool-intro">${t("teamIntro")}</p>
      <div class="filter-row team-mode-row">
        <span class="filter-row-label">${t("teamModeLabel")}</span>
        <div class="chip-picker" role="listbox" aria-label="${t(
          "teamModeLabel"
        )}">${modeChips}</div>
      </div>
      <p class="team-mode-blurb">${t(`teamModeBlurb_${mode.id}`)}</p>
      <p class="team-deploy-count">${t("teamDeployCount", {
        have: deployFilled,
        max: deployMax,
        cols,
      })}</p>
      ${globalEnemySelect}
      <div class="team-field team-field-cols-${cols}" aria-label="${t(
        "teamFieldLabel"
      )}">
        <div class="team-field-banner team-field-enemies">
          <span class="team-field-arrow" aria-hidden="true">▲</span>
          ${t("teamFieldEnemies")}
        </div>
        ${laneHeads}
        ${renderLaneEnemyRow(mode, laneEnemies, typeLabel, types)}
        ${boardRows}
        <div class="team-field-banner team-field-base">
          ${t("teamFieldBase")}
          <span class="team-field-arrow" aria-hidden="true">▼</span>
        </div>
      </div>
      <div class="team-summary">
        <p><strong>${t("role")}:</strong> ${
          Object.entries(roleCounts)
            .map(([k, v]) => `${roleLabel(k) || k} ${v}`)
            .join(" · ") || "—"
        }</p>
        <p><strong>${t("type")}:</strong> ${
          Object.entries(typeCounts)
            .map(([k, v]) => `${typeLabel(k)} ${v}`)
            .join(" · ") || "—"
        }</p>
        ${
          auras.length
            ? `<p><strong>${t("teamAuras")}:</strong> ${auras.join(" · ")}</p>`
            : `<p class="muted">${t("teamNoAuras")}</p>`
        }
        ${
          warnings.length
            ? `<ul class="tool-warn-list">${warnings
                .map((w) => `<li>${w}</li>`)
                .join("")}</ul>`
            : filled.length
              ? `<p class="team-ok">${t("teamLooksGood")}</p>`
              : ""
        }
      </div>
    </div>
  `;
}

/**
 * Modal grid of owned Tatari to pick into a slot.
 * @param {object} ctx
 */
export function renderTeamPicker(ctx) {
  const {
    catalog,
    state,
    getLineProgress,
    slotIndex,
    teamMode,
    typeLabel,
    roleLabel,
    imgForLine,
    filterType = "",
    filterRole = "",
  } = ctx;

  const mode = getTeamMode(teamMode);
  const slotDef = modeSlotDefs(mode).find((s) => s.i === slotIndex);
  const used = new Set((state.teamSlots || []).filter(Boolean));
  const currentId = state.teamSlots?.[slotIndex] || null;

  let owned = (catalog.lines || []).filter(
    (l) => getLineProgress(state, l.id).owned
  );
  if (filterType) owned = owned.filter((l) => l.type === filterType);
  if (filterRole) {
    owned = owned.filter(
      (l) => String(l.role || "").toLowerCase() === filterRole.toLowerCase()
    );
  }

  // Prefer matching role first
  if (slotDef?.prefer?.length) {
    owned = [...owned].sort((a, b) => {
      const am = roleMatchesPrefer(a.role, slotDef.prefer) ? 0 : 1;
      const bm = roleMatchesPrefer(b.role, slotDef.prefer) ? 0 : 1;
      if (am !== bm) return am - bm;
      return a.id.localeCompare(b.id);
    });
  }

  const cards = owned
    .map((l) => {
      const inTeam = used.has(l.id) && l.id !== currentId;
      const preferOk =
        !slotDef?.prefer?.length || roleMatchesPrefer(l.role, slotDef.prefer);
      const aura = lineAura(l);
      return `
      <button type="button" class="team-pick-card ${
        preferOk ? "" : "is-offrole"
      } ${inTeam ? "is-used" : ""} ${l.id === currentId ? "is-current" : ""}"
        data-action="team-assign" data-line="${l.id}" ${
          inTeam ? "disabled" : ""
        }>
        ${imgForLine(l)}
        <strong>${l.id}</strong>
        <span>${typeLabel(l.type)} · ${roleLabel(l.role)}</span>
        ${aura ? `<em class="team-pick-aura">Aura ${aura}</em>` : ""}
        ${inTeam ? `<em class="team-pick-used">${t("teamAlreadyIn")}</em>` : ""}
      </button>`;
    })
    .join("");

  const typeOpts = ["", ...(ctx.typeChart?.types || [])]
    .map(
      (ty) =>
        `<option value="${ty}" ${filterType === ty ? "selected" : ""}>${
          ty ? typeLabel(ty) : t("all")
        }</option>`
    )
    .join("");

  return `
    <div class="team-picker">
      <h2>${t("teamPickerTitle")}</h2>
      <p class="tool-intro">${
        slotDef
          ? t("teamPickerFor", { slot: t(`teamSlot_${slotDef.id}`) })
          : t("teamPickerTitle")
      }</p>
      <div class="team-picker-filters">
        <label>
          <span>${t("type")}</span>
          <select data-action="team-picker-type">${typeOpts}</select>
        </label>
        <label>
          <span>${t("role")}</span>
          <select data-action="team-picker-role">
            <option value="">${t("all")}</option>
            ${["dps", "tank", "guardian", "healer", "support", "specialist"]
              .map(
                (r) =>
                  `<option value="${r}" ${
                    filterRole === r ? "selected" : ""
                  }>${roleLabel(r)}</option>`
              )
              .join("")}
          </select>
        </label>
      </div>
      <div class="team-picker-grid">
        ${
          cards ||
          `<p class="empty">${t("teamPickerEmpty")}</p>`
        }
      </div>
    </div>
  `;
}
