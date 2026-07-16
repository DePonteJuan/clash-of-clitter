const STORAGE_KEY = "coc-evolution-planner-v1";

const defaultState = () => ({
  version: 1,
  lines: {},
  planOrder: [],
});

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      version: 1,
      lines: parsed.lines && typeof parsed.lines === "object" ? parsed.lines : {},
      planOrder: Array.isArray(parsed.planOrder) ? parsed.planOrder : [],
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getLineProgress(state, lineId) {
  const existing = state.lines[lineId];
  if (existing) {
    return {
      owned: Boolean(existing.owned),
      currentStageIndex: Number(existing.currentStageIndex) || 0,
      stars: Number(existing.stars) || 0,
      trialsDone: Array.isArray(existing.trialsDone) ? existing.trialsDone : [],
    };
  }
  return {
    owned: false,
    currentStageIndex: 0,
    stars: 0,
    trialsDone: [],
  };
}

export function setLineProgress(state, lineId, patch) {
  const prev = getLineProgress(state, lineId);
  state.lines[lineId] = { ...prev, ...patch };
  saveState(state);
  return state.lines[lineId];
}

export function togglePlan(state, lineId) {
  const idx = state.planOrder.indexOf(lineId);
  if (idx >= 0) state.planOrder.splice(idx, 1);
  else state.planOrder.push(lineId);
  saveState(state);
  return state.planOrder;
}

export function movePlan(state, lineId, direction) {
  const idx = state.planOrder.indexOf(lineId);
  if (idx < 0) return state.planOrder;
  const next = idx + direction;
  if (next < 0 || next >= state.planOrder.length) return state.planOrder;
  const copy = [...state.planOrder];
  [copy[idx], copy[next]] = [copy[next], copy[idx]];
  state.planOrder = copy;
  saveState(state);
  return state.planOrder;
}

export function exportState(state) {
  return JSON.stringify(state, null, 2);
}

export function importState(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Formato inválido");
  }
  const state = {
    version: 1,
    lines: parsed.lines && typeof parsed.lines === "object" ? parsed.lines : {},
    planOrder: Array.isArray(parsed.planOrder) ? parsed.planOrder : [],
  };
  saveState(state);
  return state;
}
