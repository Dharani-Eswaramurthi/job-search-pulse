import { buildSnapshot, DIMENSIONS } from './aggregate.js';
import { readGoogleRows, SourceError } from './google.js';
import { demoRows } from './demo.js';
import { FIELDS } from './schema.js';

let cache, pending;
const integer = (value, fallback, min, max) => { const n = Number(value); return Number.isInteger(n) && n >= min && n <= max ? n : fallback; };
const safeFormUrl = value => {
  try { const u = new URL(value); return u.protocol === 'https:' && ['docs.google.com','forms.gle'].includes(u.hostname) ? u.href : null; } catch { return null; }
};

export async function handleDashboard(method, rawUrl, env = process.env) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' };
  if (method !== 'GET') return { status: 405, headers: { ...headers, Allow: 'GET' }, body: { error: 'METHOD_NOT_ALLOWED' } };
  const url = new URL(rawUrl, 'http://localhost');
  if ([...url.searchParams.keys()].some(k => !['by','value'].includes(k)) || [...new Set(url.searchParams.keys())].some(k=>url.searchParams.getAll(k).length!==1)) return { status: 400, headers, body: { error: 'INVALID_FILTER' } };
  const by = url.searchParams.get('by') || 'all';
  const value = url.searchParams.get('value') || '';
  if ((by === 'all' && value) || (by !== 'all' && (!Object.hasOwn(DIMENSIONS,by) || !FIELDS[DIMENSIONS[by]].options.includes(value)))) return { status: 400, headers, body: { error: 'INVALID_FILTER' } };
  const mode = env.DATA_MODE || 'demo';
  const minimum = integer(env.MIN_GROUP_SIZE,20,10,1000);
  const ttl = integer(env.CACHE_SECONDS,120,60,3600);
  const roundStart = env.SURVEY_ROUND_START || '';
  let start = null;
  if(roundStart) {
    start = new Date(roundStart+'T00:00:00Z');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(roundStart) || Number.isNaN(start.valueOf()) || start.toISOString().slice(0,10)!==roundStart) return { status: 503, headers, body:{error:'CONFIGURATION_ERROR',message:'The survey date configuration needs attention.'} };
  }
  const cacheKey = [mode,minimum,ttl,roundStart,env.GOOGLE_SHEET_ID,env.GOOGLE_RESPONSE_TAB,env.HEADER_OVERRIDES_JSON].join('|');
  try {
    if (!['demo','live'].includes(mode)) throw new SourceError('INVALID_DATA_MODE');
    if (!cache || cache.key !== cacheKey || cache.expires <= Date.now()) {
      if (!pending || pending.key !== cacheKey) {
        const promise = (async () => {
          const now = new Date();
          const raw = mode === 'demo' ? demoRows(now) : await readGoogleRows(env);
          const snapshot = buildSnapshot(raw,{minimum,now,start});
          cache = { key: cacheKey, expires: Date.now()+ttl*1000, snapshot };
          return snapshot;
        })();
        pending = { key: cacheKey, promise };
        promise.finally(() => { if(pending?.promise === promise) pending = null; }).catch(()=>{});
      }
      await pending.promise;
    }
    const snapshot = cache.snapshot;
    const selected = by === 'all' ? snapshot.all : snapshot.cohorts[by]?.[value] || {available:false,total:null,minimum};
    return {
      status: 200,
      headers: { ...headers, 'Cache-Control': 'public, max-age=0, s-maxage=60' },
      body: {
        version: 1, mode, generatedAt: snapshot.generatedAt, refreshSeconds: Math.max(60,ttl), minimum,
        formUrl: safeFormUrl(env.SURVEY_FORM_URL), roundStart: snapshot.roundStart,
        filters: snapshot.filters, selection: { by, value }, data: selected
      }
    };
  } catch(error) {
    // Log a fixed code only. Never log credentials, upstream response bodies or sheet rows.
    console.error('Dashboard source error:', error instanceof SourceError ? error.code : 'UPSTREAM_UNAVAILABLE');
    return { status:503, headers, body:{error:'SOURCE_UNAVAILABLE',message:'Live responses are temporarily unavailable. Please try again shortly.'} };
  }
}
