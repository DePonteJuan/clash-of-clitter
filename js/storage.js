const STORAGE_KEY = "coc-evolution-planner-v1";

const TEAM_SIZE = 15;
const LANE_COUNT = 5;
const MAX_ENEMIES_PER_LANE = 3;
const ELEMENT_TYPES = ["Water", "Fire", "Grass", "Rock", "Lightning"];

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const defaultState = () => ({
  version: 2,
  lines: {},
  planOrder: [],
  teamSlots: Array(TEAM_SIZE).fill(null),
  laneEnemies: Array.from({ length: LANE_COUNT }, () => []),
  feedToday: { date: todayKey(), count: 0 },
});

function normalizeFeedToday(raw) {
  const date = raw?.date || todayKey();
  const count = Number(raw?.count) || 0;
  if (date !== todayKey()) return { date: todayKey(), count: 0 };
  return { date, count: Math.max(0, Math.min(99, count)) };
}

function normalizeTeamSlots(raw) {
  const slots = Array.isArray(raw) ? [...raw] : [];
  while (slots.length < TEAM_SIZE) slots.push(null);
  return slots.slice(0, TEAM_SIZE).map((id) => (id ? String(id) : null));
}

function normalizeLaneEnemies(raw) {
  const lanes = Array.isArray(raw) ? raw : [];
  const out = [];
  for (let i = 0; i < LANE_COUNT; i++) {
    const list = Array.isArray(lanes[i]) ? lanes[i] : [];
    const cleaned = [];
    for (const ty of list) {
      const t = String(ty || "");
      if (ELEMENT_TYPES.includes(t) && !cleaned.includes(t)) cleaned.push(t);
      if (cleaned.length >= MAX_ENEMIES_PER_LANE) break;
    }
    out.push(cleaned);
  }
  return out;
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const lines =
      parsed.lines && typeof parsed.lines === "object" ? parsed.lines : {};
    // Ensure feedGrade on lines is preserved as stored
    return {
      version: 2,
      lines,
      planOrder: Array.isArray(parsed.planOrder) ? parsed.planOrder : [],
      teamSlots: normalizeTeamSlots(parsed.teamSlots),
      laneEnemies: normalizeLaneEnemies(parsed.laneEnemies),
      feedToday: normalizeFeedToday(parsed.feedToday),
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
      feedGrade: existing.feedGrade != null ? String(existing.feedGrade) : "",
      feedStage:
        existing.feedStage != null && existing.feedStage !== ""
          ? Number(existing.feedStage)
          : null,
    };
  }
  return {
    owned: false,
    currentStageIndex: 0,
    stars: 0,
    trialsDone: [],
    feedGrade: "",
    feedStage: null,
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

export function setTeamSlot(state, index, lineId) {
  if (!state.teamSlots) state.teamSlots = normalizeTeamSlots([]);
  if (index < 0 || index >= TEAM_SIZE) return state.teamSlots;
  state.teamSlots[index] = lineId || null;
  saveState(state);
  return state.teamSlots;
}

export function clearTeamSlot(state, index) {
  return setTeamSlot(state, index, null);
}

export function getLaneEnemies(state) {
  state.laneEnemies = normalizeLaneEnemies(state.laneEnemies);
  return state.laneEnemies;
}

export function addLaneEnemy(state, laneIndex, type) {
  const lanes = getLaneEnemies(state);
  if (laneIndex < 0 || laneIndex >= LANE_COUNT) return lanes;
  if (!ELEMENT_TYPES.includes(type)) return lanes;
  const lane = [...lanes[laneIndex]];
  if (lane.includes(type) || lane.length >= MAX_ENEMIES_PER_LANE) {
    state.laneEnemies = lanes;
    return lanes;
  }
  lane.push(type);
  lanes[laneIndex] = lane;
  state.laneEnemies = lanes;
  saveState(state);
  return lanes;
}

export function removeLaneEnemy(state, laneIndex, type) {
  const lanes = getLaneEnemies(state);
  if (laneIndex < 0 || laneIndex >= LANE_COUNT) return lanes;
  lanes[laneIndex] = lanes[laneIndex].filter((t) => t !== type);
  state.laneEnemies = lanes;
  saveState(state);
  return lanes;
}

export function getFeedToday(state) {
  state.feedToday = normalizeFeedToday(state.feedToday);
  return state.feedToday;
}

export function setFeedTodayCount(state, count) {
  state.feedToday = {
    date: todayKey(),
    count: Math.max(0, Math.min(99, Number(count) || 0)),
  };
  saveState(state);
  return state.feedToday;
}

export function bumpFeedToday(state, delta = 1) {
  const cur = getFeedToday(state);
  return setFeedTodayCount(state, cur.count + delta);
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
    version: 2,
    lines: parsed.lines && typeof parsed.lines === "object" ? parsed.lines : {},
    planOrder: Array.isArray(parsed.planOrder) ? parsed.planOrder : [],
    teamSlots: normalizeTeamSlots(parsed.teamSlots),
    laneEnemies: normalizeLaneEnemies(parsed.laneEnemies),
    feedToday: normalizeFeedToday(parsed.feedToday),
  };
  saveState(state);
  return state;
}

export { TEAM_SIZE, LANE_COUNT, MAX_ENEMIES_PER_LANE, ELEMENT_TYPES };
