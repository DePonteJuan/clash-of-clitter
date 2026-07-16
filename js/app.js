import {
  loadState,
  saveState,
  getLineProgress,
  setLineProgress,
  togglePlan,
  movePlan,
  exportState,
  importState,
} from "./storage.js";
import {
  wikiImageUrl,
  imgHtml,
  renderStarVisual,
  bindImageFallbacks,
} from "./wiki.js";
import {
  t,
  initLang,
  setLang,
  getLang,
  getContentLang,
  getSupportedLangs,
  applyStaticI18n,
  setGoogleTranslateVisible,
  MORE_LANG,
} from "./i18n.js";
import {
  translatedTrial,
  ensureTrialsTranslated,
  collectTrialTexts,
} from "./trialTranslate.js";

const TYPE_KEYS = {
  Water: "water",
  Fire: "fire",
  Grass: "grass",
  Lightning: "lightning",
  Rock: "rock",
};

const RARITY_KEYS = {
  Blue: "blue",
  Purple: "purple",
  Gold: "gold",
  Red: "red",
  Rainbow: "rainbow",
};

const ROLE_FILES = {
  dps: "DPS.png",
  guardian: "Guardian.png",
  healer: "Healer.png",
  tank: "Tank.png",
  support: "Support.png",
  specialist: "Specialist.png",
};

const ROLE_KEYS = {
  dps: "roleDps",
  guardian: "roleGuardian",
  healer: "roleHealer",
  tank: "roleTank",
  support: "roleSupport",
  specialist: "roleSpecialist",
};

function typeLabel(type) {
  const key = TYPE_KEYS[type];
  return key ? t(key) : type || "";
}

function rarityLabel(rarity) {
  const key = RARITY_KEYS[rarity];
  return key ? t(key) : rarity || "—";
}

function roleLabel(role) {
  if (!role) return "";
  const key = String(role).trim().toLowerCase();
  return ROLE_KEYS[key] ? t(ROLE_KEYS[key]) : role;
}

function typeIconHtml(type, size = 20) {
  if (!type) return "";
  const label = typeLabel(type);
  return imgHtml({
    src: `${type}.png`,
    alt: label,
    className: "type-icon",
    width: size,
    height: size,
  });
}

function roleIconHtml(role, size = 20) {
  if (!role) return "";
  const key = String(role).trim().toLowerCase();
  const file = ROLE_FILES[key];
  if (!file) return "";
  return imgHtml({
    src: file,
    alt: roleLabel(role),
    className: "role-icon",
    width: size,
    height: size,
  });
}

let catalog = { lines: [], updatedAt: null };
let state = loadState();
let filters = {
  query: "",
  type: "",
  role: "",
  rarity: "",
  owned: "all",
  ready: false,
  sort: "name",
};
let activeTab = "catalog";
let openDetailId = null;

const els = {
  list: document.getElementById("line-list"),
  planList: document.getElementById("plan-list"),
  planCount: document.getElementById("plan-count"),
  syncDate: document.getElementById("sync-date"),
  search: document.getElementById("filter-search"),
  typePicker: document.getElementById("filter-type-picker"),
  rolePicker: document.getElementById("filter-role-picker"),
  rarity: document.getElementById("filter-rarity"),
  owned: document.getElementById("filter-owned"),
  ready: document.getElementById("filter-ready"),
  sort: document.getElementById("filter-sort"),
  count: document.getElementById("result-count"),
  exportBtn: document.getElementById("btn-export"),
  importBtn: document.getElementById("btn-import"),
  importFile: document.getElementById("import-file"),
  ownAllBtn: document.getElementById("btn-own-all"),
  starsWizardBtn: document.getElementById("btn-stars-wizard"),
  starsWizardCatalogBtn: document.getElementById("btn-stars-wizard-catalog"),
  modal: document.getElementById("detail-modal"),
  detailBody: document.getElementById("detail-body"),
  detailClose: document.getElementById("detail-close"),
  wizard: document.getElementById("stars-wizard"),
  wizardBody: document.getElementById("wizard-body"),
  wizardClose: document.getElementById("wizard-close"),
  panelCatalog: document.getElementById("panel-catalog"),
  panelPlanned: document.getElementById("panel-planned"),
  tabCatalog: document.getElementById("tab-catalog"),
  tabPlanned: document.getElementById("tab-planned"),
};

/** @type {{ ids: string[], index: number } | null} */
let starsWizard = null;

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const loc = getLang() === MORE_LANG ? "es" : getLang();
    return new Intl.DateTimeFormat(loc, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function normalizeCatalogImages(data) {
  for (const line of data.lines || []) {
    for (const stage of line.stages || []) {
      const src = stage.image || stage.imageUrl || `${stage.name}.png`;
      stage.imageUrl = wikiImageUrl(src);
    }
  }
  return data;
}

function getCurrentStage(line, progress) {
  const idx = Math.min(
    Math.max(0, progress.currentStageIndex),
    line.stages.length - 1
  );
  return { stage: line.stages[idx], index: idx };
}

function getDisplayStage(line, progress) {
  if (progress.owned) return getCurrentStage(line, progress).stage;
  return line.stages[0];
}

function getNextStep(line, progress) {
  const { stage, index } = getCurrentStage(line, progress);
  if (!stage.evolvesTo) return null;
  return {
    fromIndex: index,
    stage,
    target: stage.evolvesTo,
    starsRequired: stage.starsRequired,
    trials: stage.trials || [],
    starsOk:
      stage.starsRequired == null || progress.stars >= stage.starsRequired,
    trialsOk: (stage.trials || []).every((_, i) => progress.trialsDone[i]),
  };
}

function isReadyToEvolve(line, progress) {
  if (!progress.owned) return false;
  const next = getNextStep(line, progress);
  if (!next) return false;
  return next.starsOk && next.trialsOk;
}

function matchesFilters(line) {
  const progress = getLineProgress(state, line.id);
  const q = filters.query.trim().toLowerCase();
  if (q) {
    const hay = [line.id, ...line.stages.map((s) => s.name)]
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (filters.type && line.type !== filters.type) return false;
  if (filters.role) {
    const lineRole = String(line.role || "").trim().toLowerCase();
    if (lineRole !== filters.role.toLowerCase()) return false;
  }
  if (filters.rarity && line.rarity !== filters.rarity) return false;
  if (filters.owned === "yes" && !progress.owned) return false;
  if (filters.owned === "no" && progress.owned) return false;
  if (filters.ready && !isReadyToEvolve(line, progress)) return false;
  return true;
}

function typeClass(type) {
  return `type-${(type || "unknown").toLowerCase()}`;
}

function renderStageChain(line, progress) {
  return line.stages
    .map((stage, idx) => {
      const current = progress.owned && idx === progress.currentStageIndex;
      const past = progress.owned && idx < progress.currentStageIndex;
      const cls = [
        "stage",
        current ? "is-current" : "",
        past ? "is-past" : "",
        !progress.owned ? "is-dim" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return `
        <button type="button" class="${cls}" title="${t("chooseForm", { name: stage.name })}"
          data-action="set-stage" data-line="${line.id}" data-idx="${idx}">
          ${imgHtml({ src: stage.imageUrl || stage.image, alt: stage.name, width: 44, height: 44 })}
          <span>${stage.name}</span>
        </button>
        ${idx < line.stages.length - 1 ? '<span class="stage-arrow" aria-hidden="true">→</span>' : ""}
      `;
    })
    .join("");
}

function renderNextRequirements(line, progress) {
  const next = getNextStep(line, progress);
  if (!progress.owned) {
    return `<p class="req-empty">${t("markOwnedNext")}</p>`;
  }
  if (!next) {
    return `<p class="req-done">${t("lineComplete")}</p>`;
  }

  const trialsHtml =
    next.trials.length === 0
      ? `<li class="trial-none">${t("noTrialWiki")}</li>`
      : next.trials
          .map((trial, i) => {
            const done = Boolean(progress.trialsDone[i]);
            return `
              <li>
                <label class="trial-check">
                  <input type="checkbox" data-action="trial" data-line="${line.id}" data-idx="${i}" ${done ? "checked" : ""} />
                  <span>${translatedTrial(trial, getContentLang())}</span>
                </label>
              </li>
            `;
          })
          .join("");

  const starsLabel =
    next.starsRequired == null
      ? t("starsNoWiki")
      : t("starsProgress", {
          cur: progress.stars,
          req: next.starsRequired,
        });

  const ready = next.starsOk && next.trialsOk;

  return `
    <div class="next-block ${ready ? "is-ready" : ""}">
      <p class="next-title">${t("next")} <strong>${next.target}</strong></p>
      <p class="stars-req ${next.starsOk ? "ok" : ""}">${starsLabel}</p>
      <ul class="trial-list">${trialsHtml}</ul>
    </div>
  `;
}

function renderChecklist(line, progress) {
  if (!progress.owned) {
    return `
      <ul class="checklist">
        <li class="is-todo"><span class="mark">!</span><span>${t("markOwnedDetails")}</span></li>
      </ul>
    `;
  }

  const next = getNextStep(line, progress);
  if (!next) {
    return `
      <ul class="checklist">
        <li class="is-done"><span class="mark">✓</span><span>${t("evoComplete")}</span></li>
      </ul>
    `;
  }

  const items = [];

  if (next.starsRequired == null) {
    items.push(`
      <li class="is-todo"><span class="mark">?</span>
        <span>${t("starsWikiMissing")}</span>
      </li>
    `);
  } else if (next.starsOk) {
    items.push(`
      <li class="is-done"><span class="mark">✓</span>
        <span>${t("starsProgress", { cur: progress.stars, req: next.starsRequired })}</span>
      </li>
    `);
  } else {
    const faltan = next.starsRequired - progress.stars;
    items.push(`
      <li class="is-todo"><span class="mark">★</span>
        <span>${t("starsHaveNeed", { cur: progress.stars, need: faltan, req: next.starsRequired })}</span>
      </li>
    `);
  }

  if (next.trials.length === 0) {
    items.push(`
      <li class="is-todo"><span class="mark">·</span>
        <span>${t("noTrialsListed")}</span>
      </li>
    `);
  } else {
    next.trials.forEach((trial, i) => {
      const done = Boolean(progress.trialsDone[i]);
      items.push(`
        <li class="${done ? "is-done" : "is-todo"} is-check">
          <label class="trial-check">
            <input type="checkbox" data-action="trial" data-line="${line.id}" data-idx="${i}" ${done ? "checked" : ""} />
            <span>${translatedTrial(trial, getContentLang())}</span>
          </label>
        </li>
      `);
    });
  }

  return `<ul class="checklist">${items.join("")}</ul>`;
}

function renderLineCard(line) {
  const progress = getLineProgress(state, line.id);
  const ready = isReadyToEvolve(line, progress);
  const display = getDisplayStage(line, progress);
  const starsLabel = progress.owned ? `${progress.stars}★` : "—";

  return `
    <article
      class="poke-card ${typeClass(line.type)} ${ready ? "ready" : ""} ${progress.owned ? "" : "owned-off"}"
      data-id="${line.id}"
    >
      <div class="poke-top">
        <h2 class="poke-name">${display.name}</h2>
        <span class="poke-hp">${starsLabel}</span>
      </div>
      <div class="poke-art">
        ${imgHtml({ src: display.imageUrl || display.image, alt: display.name })}
      </div>
      ${
        progress.owned && progress.stars > 0
          ? `<div class="poke-stars">${renderStarVisual(progress.stars, { compact: true })}</div>`
          : ""
      }
      <div class="poke-meta">
        ${
          line.type
            ? `<span class="icon-badge" title="${typeLabel(line.type)}">${typeIconHtml(line.type, 22)}</span>`
            : ""
        }
        ${
          line.role
            ? `<span class="icon-badge" title="${roleLabel(line.role)}">${roleIconHtml(line.role, 22)}</span>`
            : ""
        }
        <span class="chip">${rarityLabel(line.rarity)}</span>
        ${ready ? `<span class="chip ready">${t("ready")}</span>` : ""}
      </div>
      <div class="poke-actions">
        <label class="poke-owned">
          <input type="checkbox" data-action="owned" data-line="${line.id}" ${progress.owned ? "checked" : ""} />
          ${t("iHaveIt")}
        </label>
        <button type="button" class="btn-detail" data-action="details" data-line="${line.id}">
          ${t("seeDetails")}
        </button>
      </div>
    </article>
  `;
}

function renderDetail(lineId) {
  const line = catalog.lines.find((l) => l.id === lineId);
  if (!line) {
    els.detailBody.innerHTML = `<p class="empty">${t("notFound")}</p>`;
    return;
  }

  const progress = getLineProgress(state, line.id);
  const inPlan = state.planOrder.includes(line.id);
  const ready = isReadyToEvolve(line, progress);
  const display = getDisplayStage(line, progress);
  const stageOptions = line.stages
    .map(
      (s, i) =>
        `<option value="${i}" ${i === progress.currentStageIndex ? "selected" : ""}>${s.name}</option>`
    )
    .join("");

  els.detailBody.innerHTML = `
    <div class="detail-head">
      ${imgHtml({ src: display.imageUrl || display.image, alt: display.name })}
      <div>
        <h2>${line.id}</h2>
        <p class="meta">
          ${
            line.type
              ? `<span class="pill type icon-pill" title="${typeLabel(line.type)}">${typeIconHtml(line.type, 18)}</span>`
              : ""
          }
          ${
            line.role
              ? `<span class="pill icon-pill" title="${roleLabel(line.role)}">${roleIconHtml(line.role, 18)}</span>`
              : ""
          }
          <span class="pill">${rarityLabel(line.rarity)}</span>
          ${ready ? `<span class="pill ready-pill">${t("ready")}</span>` : ""}
        </p>
      </div>
    </div>

    <label class="owned-toggle">
      <input type="checkbox" data-action="owned" data-line="${line.id}" ${progress.owned ? "checked" : ""} />
      ${t("iHaveIt")}
    </label>

    <p class="hint">${t("hintPickForm")}</p>
    <div class="stage-chain">${renderStageChain(line, progress)}</div>

    <div class="controls ${progress.owned ? "" : "is-disabled"}">
      <label>
        ${t("currentForm")}
        <select data-action="stage" data-line="${line.id}" ${progress.owned ? "" : "disabled"}>
          ${stageOptions}
        </select>
      </label>
      <div class="stars-field">
        <label>
          ${t("stars")}
          <input type="number" min="0" max="86" step="1" value="${progress.stars}"
            data-action="stars" data-line="${line.id}" ${progress.owned ? "" : "disabled"} />
        </label>
        <div class="star-visual-host" data-star-visual>
          ${renderStarVisual(progress.stars)}
        </div>
      </div>
    </div>

    ${renderNextRequirements(line, progress)}

    <div class="detail-actions">
      <button type="button" class="btn" data-action="plan" data-line="${line.id}">
        ${inPlan ? t("removeFromPlan") : t("addToPlan")}
      </button>
      <a class="btn ghost" href="${display.wiki}" target="_blank" rel="noopener">${t("wiki")}</a>
    </div>
  `;
}

function openDetails(lineId) {
  openDetailId = lineId;
  renderDetail(lineId);
  if (typeof els.modal.showModal === "function") {
    if (!els.modal.open) els.modal.showModal();
  } else {
    els.modal.setAttribute("open", "");
  }
}

function closeDetails() {
  openDetailId = null;
  if (els.modal.open) els.modal.close();
  else els.modal.removeAttribute("open");
}

function updateStarVisualInModal(stars) {
  const host = els.detailBody.querySelector("[data-star-visual]");
  if (host) host.innerHTML = renderStarVisual(stars);
}

function getVisibleCatalogLines() {
  const lines = catalog.lines.filter(matchesFilters);
  if (filters.sort === "stars-desc") {
    lines.sort((a, b) => {
      const sa = getLineProgress(state, a.id).stars;
      const sb = getLineProgress(state, b.id).stars;
      if (sb !== sa) return sb - sa;
      return a.id.localeCompare(b.id);
    });
  } else if (filters.sort === "stars-asc") {
    lines.sort((a, b) => {
      const sa = getLineProgress(state, a.id).stars;
      const sb = getLineProgress(state, b.id).stars;
      if (sa !== sb) return sa - sb;
      return a.id.localeCompare(b.id);
    });
  } else {
    lines.sort((a, b) => a.id.localeCompare(b.id));
  }
  return lines;
}

function renderList() {
  const lines = getVisibleCatalogLines();
  els.count.textContent = t("lines", { n: lines.length });
  if (!lines.length) {
    els.list.innerHTML = `<p class="empty">${t("emptyFilters")}</p>`;
    return;
  }
  els.list.innerHTML = lines.map(renderLineCard).join("");
}

function renderPlan() {
  els.planCount.textContent = String(state.planOrder.length);

  if (!state.planOrder.length) {
    els.planList.innerHTML = `
      <div class="empty">
        <p>${t("emptyPlan")}</p>
        <p>${t("emptyPlanHint")}</p>
        <button type="button" class="btn" data-action="goto-catalog">${t("goCatalog")}</button>
      </div>
    `;
    return;
  }

  els.planList.innerHTML = state.planOrder
    .map((id, order) => {
      const line = catalog.lines.find((l) => l.id === id);
      if (!line) return "";
      const progress = getLineProgress(state, id);
      const next = getNextStep(line, progress);
      const ready = isReadyToEvolve(line, progress);
      const display = getDisplayStage(line, progress);
      const { stage } = getCurrentStage(line, progress);
      const subtitle = !progress.owned
        ? t("notMarkedOwned")
        : next
          ? `${stage.name} → ${next.target}${ready ? ` · ${t("readyShort")}` : ""}`
          : `${stage.name} · ${t("complete")}`;

      return `
        <article class="plan-card ${typeClass(line.type)} ${ready ? "ready" : ""}" data-id="${id}">
          <div class="plan-card-top">
            <span class="plan-rank">${order + 1}</span>
            ${imgHtml({ src: display.imageUrl || display.image, alt: "", width: 48, height: 48 })}
            <div class="plan-text">
              <strong>${line.id}</strong>
              <span>${subtitle}</span>
            </div>
            <div class="plan-actions">
              <button type="button" class="icon-btn" data-action="plan-up" data-line="${id}" aria-label="${t("moveUp")}">↑</button>
              <button type="button" class="icon-btn" data-action="plan-down" data-line="${id}" aria-label="${t("moveDown")}">↓</button>
              <button type="button" class="icon-btn" data-action="plan" data-line="${id}" aria-label="${t("remove")}">×</button>
            </div>
          </div>
          <div class="plan-stars">${renderStarVisual(progress.stars)}</div>
          ${renderChecklist(line, progress)}
          <div class="plan-card-foot">
            <button type="button" class="btn sm ghost" data-action="details" data-line="${id}">
              ${t("seeDetails")}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function setTab(tab) {
  activeTab = tab;
  const isCatalog = tab === "catalog";

  els.tabCatalog.classList.toggle("is-active", isCatalog);
  els.tabPlanned.classList.toggle("is-active", !isCatalog);
  els.tabCatalog.setAttribute("aria-selected", String(isCatalog));
  els.tabPlanned.setAttribute("aria-selected", String(!isCatalog));

  els.panelCatalog.classList.toggle("is-active", isCatalog);
  els.panelPlanned.classList.toggle("is-active", !isCatalog);
  els.panelCatalog.hidden = !isCatalog;
  els.panelPlanned.hidden = isCatalog;
}

/** @param {"plan" | "visible"} mode */
function getWizardQueue(mode = "plan") {
  const byId = new Map(catalog.lines.map((l) => [l.id, l]));
  const queued = [];
  const seen = new Set();

  if (mode === "visible") {
    for (const line of getVisibleCatalogLines()) {
      const progress = getLineProgress(state, line.id);
      if (progress.owned && !seen.has(line.id)) {
        queued.push(line.id);
        seen.add(line.id);
      }
    }
    return queued;
  }

  if (mode === "plan") {
    for (const id of state.planOrder) {
      if (byId.has(id) && !seen.has(id)) {
        queued.push(id);
        seen.add(id);
      }
    }
    if (queued.length) return queued;
  }

  for (const line of catalog.lines) {
    const progress = getLineProgress(state, line.id);
    if (progress.owned && !seen.has(line.id)) {
      queued.push(line.id);
      seen.add(line.id);
    }
  }
  return queued;
}

function closeStarsWizard() {
  starsWizard = null;
  if (els.wizard.open) els.wizard.close();
  else els.wizard.removeAttribute("open");
}

function renderStarsWizard() {
  if (!starsWizard) return;

  if (starsWizard.index >= starsWizard.ids.length) {
    els.wizardBody.innerHTML = `
      <div class="wizard-done">
        <h2>${t("wizardDone")}</h2>
        <p>${t("wizardDoneBody")}</p>
        <button type="button" class="btn" data-action="wizard-close">${t("close")}</button>
      </div>
    `;
    return;
  }

  const lineId = starsWizard.ids[starsWizard.index];
  const line = catalog.lines.find((l) => l.id === lineId);
  if (!line) {
    starsWizard.index += 1;
    renderStarsWizard();
    return;
  }

  const progress = getLineProgress(state, lineId);
  const display = getDisplayStage(line, progress);
  const minStars = progress.stars;
  const step = starsWizard.index + 1;
  const total = starsWizard.ids.length;

  els.wizardBody.innerHTML = `
    <p class="wizard-progress">${step} / ${total}</p>
    <div class="wizard-hero">
      ${imgHtml({ src: display.imageUrl || display.image, alt: display.name })}
      <div>
        <h2>${display.name}</h2>
        <p>${t("lineLabel", { id: line.id, stars: progress.stars })}</p>
      </div>
    </div>
    <div class="wizard-current">
      <strong>${t("currentLook")}</strong>
      ${renderStarVisual(progress.stars)}
    </div>
    <div class="wizard-actions">
      <button type="button" class="btn" data-action="wizard-keep">
        ${t("keepSame")}
      </button>
      <div class="wizard-more">
        <span style="font-weight:800;font-size:0.9rem">${t("hasMoreStars")}</span>
        <div class="wizard-more-row">
          <label>
            ${t("newStars")}
            <input type="number" id="wizard-stars-input" min="${minStars}" max="86" step="1" value="${Math.max(minStars, progress.stars)}" />
          </label>
          <div data-wizard-star-visual>${renderStarVisual(Math.max(minStars, progress.stars))}</div>
        </div>
        <button type="button" class="btn ghost" data-action="wizard-save">
          ${t("saveContinue")}
        </button>
      </div>
    </div>
    <div class="wizard-foot">
      <button type="button" class="btn ghost" data-action="wizard-skip">${t("skip")}</button>
      <button type="button" class="btn ghost" data-action="wizard-close">${t("close")}</button>
    </div>
  `;
}

/** @param {"plan" | "visible"} mode */
function openStarsWizard(mode = "plan") {
  const ids = getWizardQueue(mode);
  if (!ids.length) {
    alert(
      mode === "visible"
        ? t("noVisibleOwned")
        : t("noWizardQueue")
    );
    return;
  }
  starsWizard = { ids, index: 0 };
  renderStarsWizard();
  if (typeof els.wizard.showModal === "function") {
    if (!els.wizard.open) els.wizard.showModal();
  } else {
    els.wizard.setAttribute("open", "");
  }
}

function wizardAdvance() {
  if (!starsWizard) return;
  starsWizard.index += 1;
  renderStarsWizard();
  refresh();
}

function wizardKeep() {
  wizardAdvance();
}

function wizardSkip() {
  wizardAdvance();
}

function wizardSaveMore() {
  if (!starsWizard) return;
  const lineId = starsWizard.ids[starsWizard.index];
  const progress = getLineProgress(state, lineId);
  const input = document.getElementById("wizard-stars-input");
  let stars = Number(input?.value) || progress.stars;
  stars = Math.max(progress.stars, Math.min(86, stars));
  setLineProgress(state, lineId, { stars });
  wizardAdvance();
}

function refresh({ keepStarsFocus = false } = {}) {
  const active = document.activeElement;
  const starsFocused =
    keepStarsFocus &&
    active instanceof HTMLInputElement &&
    active.getAttribute("data-action") === "stars";
  const starsValue = starsFocused ? active.value : null;
  const starsLine = starsFocused ? active.getAttribute("data-line") : null;

  renderList();
  renderPlan();
  if (openDetailId && els.modal.open) {
    renderDetail(openDetailId);
    if (starsFocused && starsLine === openDetailId) {
      const input = els.detailBody.querySelector(
        `input[data-action="stars"][data-line="${starsLine}"]`
      );
      if (input) {
        input.value = starsValue;
        input.focus();
        const len = input.value.length;
        input.setSelectionRange(len, len);
        updateStarVisualInModal(Number(starsValue) || 0);
      }
    }
  }
}

function onClick(e) {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const actionEl = target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.getAttribute("data-action");
  const lineId = actionEl.getAttribute("data-line");

  if (action === "goto-catalog") {
    setTab("catalog");
    return;
  }

  if (action === "set-type") {
    filters.type = actionEl.getAttribute("data-type") || "";
    els.typePicker.querySelectorAll(".type-chip").forEach((btn) => {
      const on = (btn.getAttribute("data-type") || "") === filters.type;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", String(on));
    });
    renderList();
    return;
  }

  if (action === "set-role") {
    filters.role = actionEl.getAttribute("data-role") || "";
    els.rolePicker.querySelectorAll(".type-chip").forEach((btn) => {
      const on = (btn.getAttribute("data-role") || "") === filters.role;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", String(on));
    });
    renderList();
    return;
  }

  if (action === "wizard-close") {
    closeStarsWizard();
    return;
  }

  if (action === "wizard-keep") {
    wizardKeep();
    return;
  }

  if (action === "wizard-skip") {
    wizardSkip();
    return;
  }

  if (action === "wizard-save") {
    wizardSaveMore();
    return;
  }

  if (action === "details" && lineId) {
    openDetails(lineId);
    return;
  }

  if (!lineId) return;

  if (action === "set-stage") {
    const idx = Number(actionEl.getAttribute("data-idx")) || 0;
    setLineProgress(state, lineId, {
      owned: true,
      currentStageIndex: idx,
      trialsDone: [],
    });
    refresh();
    return;
  }

  if (action === "plan") {
    togglePlan(state, lineId);
    refresh();
    return;
  }

  if (action === "plan-up") {
    movePlan(state, lineId, -1);
    refresh();
    return;
  }

  if (action === "plan-down") {
    movePlan(state, lineId, 1);
    refresh();
    return;
  }
}

function onInput(e) {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) return;

  if (target.id === "wizard-stars-input") {
    const stars = Math.max(0, Math.min(86, Number(target.value) || 0));
    const host = els.wizardBody.querySelector("[data-wizard-star-visual]");
    if (host) host.innerHTML = renderStarVisual(stars);
    return;
  }

  if (target.getAttribute("data-action") !== "stars") return;
  const stars = Math.max(0, Math.min(86, Number(target.value) || 0));
  updateStarVisualInModal(stars);
}

function onChange(e) {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.getAttribute("data-action");
  const lineId = target.getAttribute("data-line");
  if (!action || !lineId) return;

  if (action === "owned") {
    setLineProgress(state, lineId, {
      owned: /** @type {HTMLInputElement} */ (target).checked,
    });
    refresh();
    return;
  }

  if (action === "trial") {
    const idx = Number(target.getAttribute("data-idx"));
    const progress = getLineProgress(state, lineId);
    const trialsDone = [...progress.trialsDone];
    trialsDone[idx] = /** @type {HTMLInputElement} */ (target).checked;
    setLineProgress(state, lineId, { trialsDone });
    refresh();
    return;
  }

  if (action === "stage") {
    setLineProgress(state, lineId, {
      currentStageIndex:
        Number(/** @type {HTMLSelectElement} */ (target).value) || 0,
      trialsDone: [],
    });
    refresh();
    return;
  }

  if (action === "stars") {
    const stars = Math.max(
      0,
      Math.min(86, Number(/** @type {HTMLInputElement} */ (target).value) || 0)
    );
    setLineProgress(state, lineId, { stars });
    updateStarVisualInModal(stars);
    renderList();
    renderPlan();
  }
}

function setupTabs() {
  els.tabCatalog.addEventListener("click", () => setTab("catalog"));
  els.tabPlanned.addEventListener("click", () => setTab("planned"));
}

function setupModal() {
  els.detailClose.addEventListener("click", () => closeDetails());
  els.modal.addEventListener("click", (e) => {
    if (e.target === els.modal) closeDetails();
  });
  els.modal.addEventListener("close", () => {
    openDetailId = null;
  });

  els.wizardClose.addEventListener("click", () => closeStarsWizard());
  els.wizard.addEventListener("click", (e) => {
    if (e.target === els.wizard) closeStarsWizard();
  });
  els.wizard.addEventListener("close", () => {
    starsWizard = null;
  });
}

function renderFilterPickers(types, roles, rarities) {
  els.typePicker.innerHTML =
    `<button type="button" class="type-chip ${filters.type ? "" : "is-active"}" data-action="set-type" data-type="" role="option" aria-selected="${filters.type ? "false" : "true"}">${t("all")}</button>` +
    types
      .map((typeName) => {
        const active = filters.type === typeName;
        return `<button type="button" class="type-chip ${active ? "is-active" : ""}" data-action="set-type" data-type="${typeName}" role="option" aria-selected="${active}" title="${typeLabel(typeName)}">
          ${typeIconHtml(typeName, 18)}
          <span>${typeLabel(typeName)}</span>
        </button>`;
      })
      .join("");

  els.rolePicker.innerHTML =
    `<button type="button" class="type-chip ${filters.role ? "" : "is-active"}" data-action="set-role" data-role="" role="option" aria-selected="${filters.role ? "false" : "true"}">${t("all")}</button>` +
    roles
      .map((r) => {
        const key = r.toLowerCase();
        const active = filters.role.toLowerCase() === key;
        return `<button type="button" class="type-chip ${active ? "is-active" : ""}" data-action="set-role" data-role="${key}" role="option" aria-selected="${active}" title="${roleLabel(r)}">
          ${roleIconHtml(r, 18)}
          <span>${roleLabel(r)}</span>
        </button>`;
      })
      .join("");

  const rarityValue = els.rarity.value;
  els.rarity.innerHTML =
    `<option value="">${t("allRarities")}</option>` +
    rarities
      .map((r) => `<option value="${r}">${rarityLabel(r)}</option>`)
      .join("");
  if ([...els.rarity.options].some((o) => o.value === rarityValue)) {
    els.rarity.value = rarityValue;
  }
}

function setupLanguage() {
  const select = document.getElementById("lang-select");
  if (!select) return;
  const current = getLang();
  select.innerHTML = getSupportedLangs()
    .map(
      ({ code, name }) =>
        `<option value="${code}" ${code === current ? "selected" : ""}>${
          code === MORE_LANG ? t("moreLangs") : name
        }</option>`
    )
    .join("");
  setGoogleTranslateVisible(current === MORE_LANG);
  select.addEventListener("change", async () => {
    showLoader("loadingTranslate");
    setLang(select.value);
    applyStaticI18n(document);
    setupLanguageOptionsRefresh();
    els.syncDate.textContent = formatDate(catalog.updatedAt);
    await prepareTrialTranslations();
    refresh();
    if (starsWizard) renderStarsWizard();
    hideLoader();
  });
}

function setupLanguageOptionsRefresh() {
  const select = document.getElementById("lang-select");
  if (!select) return;
  const current = getLang();
  select.innerHTML = getSupportedLangs()
    .map(
      ({ code, name }) =>
        `<option value="${code}" ${code === current ? "selected" : ""}>${
          code === MORE_LANG ? t("moreLangs") : name
        }</option>`
    )
    .join("");
  setGoogleTranslateVisible(current === MORE_LANG);
  // Re-render chip pickers with translated labels
  if (catalog.lines?.length) {
    const types = [...new Set(catalog.lines.map((l) => l.type).filter(Boolean))].sort();
    const roleOrder = Object.keys(ROLE_FILES);
    const rolesRaw = [
      ...new Set(
        catalog.lines.map((l) => String(l.role || "").trim()).filter(Boolean)
      ),
    ];
    const roles = rolesRaw.sort((a, b) => {
      const ia = roleOrder.indexOf(a.toLowerCase());
      const ib = roleOrder.indexOf(b.toLowerCase());
      const ra = ia < 0 ? 99 : ia;
      const rb = ib < 0 ? 99 : ib;
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    });
    const rarities = [
      ...new Set(catalog.lines.map((l) => l.rarity).filter(Boolean)),
    ].sort();
    renderFilterPickers(types, roles, rarities);
  }
}

function setupFilters() {
  const types = [...new Set(catalog.lines.map((l) => l.type).filter(Boolean))].sort();
  const roleOrder = Object.keys(ROLE_FILES);
  const rolesRaw = [
    ...new Set(
      catalog.lines
        .map((l) => String(l.role || "").trim())
        .filter(Boolean)
    ),
  ];
  const roles = rolesRaw.sort((a, b) => {
    const ia = roleOrder.indexOf(a.toLowerCase());
    const ib = roleOrder.indexOf(b.toLowerCase());
    const ra = ia < 0 ? 99 : ia;
    const rb = ib < 0 ? 99 : ib;
    if (ra !== rb) return ra - rb;
    return a.localeCompare(b);
  });
  const rarities = [
    ...new Set(catalog.lines.map((l) => l.rarity).filter(Boolean)),
  ].sort();

  renderFilterPickers(types, roles, rarities);

  els.search.addEventListener("input", () => {
    filters.query = els.search.value;
    renderList();
  });
  els.rarity.addEventListener("change", () => {
    filters.rarity = els.rarity.value;
    renderList();
  });
  els.owned.addEventListener("change", () => {
    filters.owned = els.owned.value;
    renderList();
  });
  els.ready.addEventListener("change", () => {
    filters.ready = els.ready.checked;
    renderList();
  });
  els.sort.addEventListener("change", () => {
    filters.sort = els.sort.value;
    renderList();
  });
}

function setupImportExport() {
  els.ownAllBtn.addEventListener("click", () => {
    const ok = window.confirm(t("ownAllConfirm"));
    if (!ok) return;
    for (const line of catalog.lines) {
      setLineProgress(state, line.id, { owned: true });
    }
    refresh();
  });

  els.exportBtn.addEventListener("click", () => {
    const blob = new Blob([exportState(state)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tatari-plan-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  els.importBtn.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", async () => {
    const file = els.importFile.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      state = importState(text);
      refresh();
    } catch {
      alert(t("importFail"));
    }
    els.importFile.value = "";
  });
}

async function init() {
  initLang();
  applyStaticI18n(document);
  showLoader("loadingData");
  setupLanguage();
  bindImageFallbacks(document);

  try {
    setLoaderStatus("loadingData");
    const res = await fetch("./data/evolutions.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    catalog = normalizeCatalogImages(await res.json());
  } catch (err) {
    els.list.innerHTML = `<p class="empty">${t("loadFail", { msg: err.message })}</p>`;
    hideLoader();
    return;
  }

  const ids = new Set(catalog.lines.map((l) => l.id));
  const cleaned = state.planOrder.filter((id) => ids.has(id));
  if (cleaned.length !== state.planOrder.length) {
    state.planOrder = cleaned;
    saveState(state);
  }

  els.syncDate.textContent = formatDate(catalog.updatedAt);
  setupTabs();
  setupModal();
  setupFilters();
  setupImportExport();

  els.starsWizardBtn.addEventListener("click", () => openStarsWizard("plan"));
  els.starsWizardCatalogBtn.addEventListener("click", () =>
    openStarsWizard("visible")
  );

  document.body.addEventListener("click", onClick);
  document.body.addEventListener("change", onChange);
  document.body.addEventListener("input", onInput);

  setTab("catalog");
  await prepareTrialTranslations();
  refresh();
  hideLoader();
}

function showLoader(statusKey = "loadingData") {
  const loader = document.getElementById("app-loader");
  const shell = document.getElementById("app-shell");
  if (loader) {
    loader.classList.remove("is-done");
    loader.setAttribute("aria-busy", "true");
    loader.hidden = false;
  }
  if (shell) shell.classList.add("is-booting");
  setLoaderStatus(statusKey);
}

function setLoaderStatus(statusKey) {
  const status = document.getElementById("loader-status");
  if (status) status.textContent = t(statusKey);
  const title = document.querySelector(".app-loader-title");
  if (title) title.textContent = t("loadingTitle");
}

function hideLoader() {
  const loader = document.getElementById("app-loader");
  const shell = document.getElementById("app-shell");
  if (shell) shell.classList.remove("is-booting");
  if (!loader) return;
  setLoaderStatus("loadingReady");
  loader.setAttribute("aria-busy", "false");
  loader.classList.add("is-done");
  window.setTimeout(() => {
    loader.hidden = true;
  }, 320);
}

async function prepareTrialTranslations() {
  const lang = getContentLang();
  if (!lang || lang === "en" || !catalog.lines?.length) return;
  setLoaderStatus("loadingTranslate");
  await ensureTrialsTranslated(collectTrialTexts(catalog), lang);
}

init();
