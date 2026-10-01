import { FIELDS } from './schema.js';

export const DIMENSIONS = { country: 'country', industry: 'industry', experience: 'experience', status: 'search_status' };
const APPLICATION_FIELDS = ['channels', 'daily_applications', 'response_share', 'positive_share', 'furthest_stage', 'ghosting_share'];
export const EXCLUDED = /^(Not sure|Not applicable|Prefer not|Still exploring|Not currently|Other stage|Cannot compare)/i;
const excludedFor = (field, value) => field === 'search_status' && value === 'Not currently looking' ? false : EXCLUDED.test(value);

export function dateFromCell(value) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 20000 && value < 100000) return new Date(Math.round((value - 25569) * 86400_000));
  // Do not guess ambiguous locale-specific strings. Sheets is read as serial numbers.
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value)) {
    const date = new Date(value); if (!Number.isNaN(date.valueOf())) return date;
  }
  return null;
}

export function normalizeRows(raw, { now = new Date(), start = null } = {}) {
  return raw.flatMap(row => {
    if (row.consent !== 'Yes, I agree') return [];
    const date = dateFromCell(row.submitted_at);
    // Sheet timestamps are local serial dates; permit the current local calendar day.
    if (!date || date > new Date(now.valueOf() + 86400_000) || (start && date < start)) return [];
    const clean = { date: date.toISOString().slice(0, 10) };
    for (const [id, field] of Object.entries(FIELDS)) {
      if (id === 'consent') continue;
      if (field.type === 'checkbox') {
        const parts = Array.isArray(row[id]) ? row[id] : String(row[id] || '').split(/,\s*/);
        clean[id] = field.options.filter(option => parts.includes(option));
      } else clean[id] = field.options.includes(row[id]) ? row[id] : null;
    }
    if (clean.recent_activity !== 'Yes') for (const id of APPLICATION_FIELDS) clean[id] = Array.isArray(clean[id]) ? [] : null;
    return [clean];
  });
}

// Secondary suppression prevents recovering a lone small category by subtracting
// the visible categories from a total. Overlapping cohorts still carry inference risk.
export function suppressCells(cells, minimum, partition = true) {
  const hidden = new Set(cells.flatMap((c, i) => c.count > 0 && c.count < minimum ? [i] : []));
  if (partition && hidden.size === 1) {
    const candidates = cells.map((c, i) => ({ ...c, i })).filter(c => c.count >= minimum).sort((a, b) => a.count - b.count);
    if (candidates.length) hidden.add(candidates[0].i);
  }
  return cells.map((cell, i) => ({ label: cell.label, count: hidden.has(i) ? null : cell.count, suppressed: hidden.has(i) }));
}

function distribution(rows, field, minimum, { multiple = false } = {}) {
  const options = FIELDS[field].options.filter(option => !excludedFor(field, option));
  const valid = rows.filter(r => multiple ? r[field]?.length : options.includes(r[field]));
  if (valid.length < minimum) return { available: false, n: null, multiple, rows: [] };
  const cells = options.map(label => ({ label, count: valid.filter(r => multiple ? r[field].includes(label) : r[field] === label).length }));
  return { available: true, n: valid.length, multiple, rows: suppressCells(cells, minimum, !multiple).map(c => ({ ...c, percent: c.count === null ? null : Math.round(c.count / valid.length * 100) })) };
}

function proportion(rows, field, predicate, minimum) {
  const valid = rows.filter(r => typeof r[field] === 'string' && !EXCLUDED.test(r[field]));
  const numerator = valid.filter(r => predicate(r[field])).length;
  if (valid.length < minimum || (numerator > 0 && numerator < minimum) || (valid.length - numerator > 0 && valid.length - numerator < minimum)) return { available: false, percent: null, n: null };
  return { available: true, percent: Math.round(numerator / valid.length * 100), n: valid.length };
}

function weeklyCounts(rows, minimum, now) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - (start.getUTCDay() + 6) % 7 - 7 * 7);
  const cells = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(start); d.setUTCDate(d.getUTCDate() + i * 7);
    const end = new Date(d); end.setUTCDate(end.getUTCDate() + 7);
    return { label: d.toISOString().slice(0, 10), count: rows.filter(r => r.date >= d.toISOString().slice(0, 10) && r.date < end.toISOString().slice(0, 10)).length };
  });
  return suppressCells(cells, minimum);
}

export function summarize(rows, minimum, now = new Date()) {
  if (rows.length < minimum) return { available: false, total: null, minimum };
  const charts = {};
  for (const field of ['response_share','positive_share','ghosting_share','furthest_stage','daily_applications','search_duration','difficulty','search_status','experience','industry','target_level','employment_status','age_group','target_market','function','country']) charts[field] = distribution(rows, field, minimum);
  charts.channels = distribution(rows, 'channels', minimum, { multiple: true });
  charts.work_arrangement = distribution(rows, 'work_arrangement', minimum, { multiple: true });
  return {
    available: true, total: rows.length, minimum,
    metrics: {
      lowReplies: proportion(rows, 'response_share', value => ['None', 'Almost none / very few'].includes(value), minimum),
      ghosting: proportion(rows, 'ghosting_share', value => value !== 'Never', minimum),
      difficult: proportion(rows, 'difficulty', value => ['Somewhat difficult', 'Very difficult'].includes(value), minimum)
    },
    charts, weekly: weeklyCounts(rows, minimum, now)
  };
}

export function buildSnapshot(raw, { minimum = 20, now = new Date(), start = null } = {}) {
  const rows = normalizeRows(raw, { now, start });
  const all = summarize(rows, minimum, now);
  const cohorts = {}, filters = {};
  for (const [dimension, field] of Object.entries(DIMENSIONS)) {
    const values = FIELDS[field].options.filter(v => !excludedFor(field, v));
    cohorts[dimension] = {}; filters[dimension] = [];
    for (const value of values) {
      const selected = rows.filter(row => row[field] === value);
      // Suppress small cohorts AND their small complements.
      if (selected.length < minimum || (rows.length - selected.length > 0 && rows.length - selected.length < minimum)) continue;
      cohorts[dimension][value] = summarize(selected, minimum, now);
      filters[dimension].push(value);
    }
  }
  return { all, cohorts, filters, generatedAt: now.toISOString(), minimum, roundStart: start ? start.toISOString().slice(0,10) : null };
}
