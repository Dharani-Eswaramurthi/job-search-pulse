import { createSign } from 'node:crypto';
import { FIELDS } from './schema.js';

let tokenCache;
export class SourceError extends Error {
  constructor(code) { super(code); this.code = code; }
}
const timeout = () => AbortSignal.timeout(12000);
const b64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');

async function accessToken(env) {
  if (tokenCache && tokenCache.email === env.GOOGLE_SERVICE_ACCOUNT_EMAIL && tokenCache.until > Date.now()) return tokenCache.token;
  const now = Math.floor(Date.now() / 1000);
  const header = b64({ alg: 'RS256', typ: 'JWT' });
  const claims = b64({ iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, scope: 'https://www.googleapis.com/auth/spreadsheets.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const unsigned = `${header}.${claims}`;
  let signature;
  try { signature = createSign('RSA-SHA256').update(unsigned).sign(env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 'base64url'); }
  catch { throw new SourceError('INVALID_PRIVATE_KEY'); }
  const result = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', signal: timeout(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}` })
  });
  if (!result.ok) throw new SourceError('GOOGLE_AUTH_FAILED');
  const payload = await result.json();
  if (!payload.access_token) throw new SourceError('GOOGLE_AUTH_FAILED');
  tokenCache = { email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, token: payload.access_token, until: Date.now() + 3300_000 };
  return tokenCache.token;
}

export function columnName(index) {
  let name = '';
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + (n - 1) % 26) + name;
  return name;
}

export function mapHeaders(headers, overrides = {}) {
  const result = { submitted_at: 0 };
  for (const [id, question] of Object.entries(FIELDS)) {
    const title = overrides[id] || question.title;
    const indexes = headers.flatMap((value, index) => String(value).trim() === title.trim() ? [index] : []);
    if (indexes.length !== 1) throw new SourceError('SCHEMA_MISMATCH');
    result[id] = indexes[0];
  }
  return result;
}

export async function readGoogleRows(env) {
  if (![env.GOOGLE_SHEET_ID, env.GOOGLE_SERVICE_ACCOUNT_EMAIL, env.GOOGLE_PRIVATE_KEY].every(Boolean)) throw new SourceError('MISSING_GOOGLE_CONFIGURATION');
  if (!/^[a-zA-Z0-9_-]+$/.test(env.GOOGLE_SHEET_ID)) throw new SourceError('INVALID_SHEET_ID');
  const token = await accessToken(env);
  const tab = `'${(env.GOOGLE_RESPONSE_TAB || 'Form Responses 1').replaceAll("'", "''")}'`;
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values:batchGet`;
  async function batch(ranges, dimension = 'ROWS') {
    const url = new URL(base);
    ranges.forEach(r => url.searchParams.append('ranges', r));
    url.searchParams.set('majorDimension', dimension);
    url.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
    url.searchParams.set('dateTimeRenderOption', 'SERIAL_NUMBER');
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: timeout() });
    if (!response.ok) throw new SourceError(response.status === 403 ? 'SHEET_ACCESS_DENIED' : 'SHEET_READ_FAILED');
    return (await response.json()).valueRanges || [];
  }
  const headerResult = await batch([`${tab}!A1:ZZ1`]);
  const headers = headerResult[0]?.values?.[0] || [];
  let overrides;
  try { overrides = JSON.parse(env.HEADER_OVERRIDES_JSON || '{}'); }
  catch { throw new SourceError('INVALID_HEADER_OVERRIDES'); }
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides) || Object.values(overrides).some(v => typeof v !== 'string')) throw new SourceError('INVALID_HEADER_OVERRIDES');
  const mapping = mapHeaders(headers, overrides);
  // Request only enumerated, allowlisted columns. Feedback, age detail, location detail,
  // names, emails and all other free-text columns are never fetched.
  const entries = Object.entries(mapping);
  const values = await batch(entries.map(([, i]) => `${tab}!${columnName(i)}2:${columnName(i)}`), 'COLUMNS');
  const columns = values.map(v => v.values?.[0] || []);
  const size = columns[0]?.length || 0;
  if (size > 100_000) throw new SourceError('DATASET_TOO_LARGE');
  return Array.from({ length: size }, (_, i) => Object.fromEntries(entries.map(([id], j) => [id, columns[j][i] ?? ''])));
}
