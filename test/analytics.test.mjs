import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRows, buildSnapshot, suppressCells, dateFromCell } from '../server/aggregate.js';
import { mapHeaders, columnName, readGoogleRows } from '../server/google.js';
import { handleDashboard } from '../server/endpoint.js';
import { FIELDS } from '../server/schema.js';

const now = new Date('2026-10-01T12:00:00Z');
const base = { submitted_at: '2026-09-25T12:00:00Z', consent:'Yes, I agree', country:'India', experience:'3 to less than 5 years', recent_activity:'Yes', response_share:'None', positive_share:'None', ghosting_share:'Never', difficulty:'Very difficult', search_status:'Actively applying or interviewing' };

test('normalization excludes declines, bad dates and free text; uses enumerated answers only',()=>{
  const rows=normalizeRows([{...base,feedback:'PRIVATE SECRET',email:'secret@example.test',country_other:'PRIVATE PLACE',channels:'LinkedIn, Company career websites, PRIVATE CHANNEL'}, {...base,consent:'No, I do not want to take part'}, {...base,submitted_at:'01/10/2026'}, {...base,country:'<script>alert(1)</script>'}],{now});
  assert.equal(rows.length,2);assert.equal(rows[1].country,null);
  assert.deepEqual(rows[0].channels,['LinkedIn','Company career websites']);
  assert(!JSON.stringify(rows).includes('PRIVATE'));assert(!JSON.stringify(rows).includes('secret@'));
});

test('stale application answers are cleared after a respondent chooses no recent activity',()=>{
  const [row]=normalizeRows([{...base,recent_activity:'No',channels:['LinkedIn']}],{now});
  assert.equal(row.response_share,null);assert.equal(row.ghosting_share,null);assert.deepEqual(row.channels,[]);
});

test('serial timestamps are deterministic; round boundary excludes older rows',()=>{
  assert.equal(dateFromCell(25569).toISOString(),'1970-01-01T00:00:00.000Z');
  const rows=normalizeRows([base,{...base,submitted_at:'2026-08-01'}],{now,start:new Date('2026-09-01')});assert.equal(rows.length,1);
});

test('small cells and a second partition cell are withheld',()=>{
  const cells=suppressCells([{label:'A',count:5},{label:'B',count:45},{label:'C',count:50}],20);
  assert.equal(cells[0].count,null);assert.equal(cells[1].count,null);assert.equal(cells[2].count,50);
});

test('groups below the threshold expose no count or distributions',()=>{
  const s=buildSnapshot(Array.from({length:19},()=>base),{minimum:20,now});
  assert.deepEqual(s.all,{available:false,total:null,minimum:20});assert.deepEqual(s.filters.country,[]);
});

test('cohorts with tiny complements cannot be selected',()=>{
  const raw=Array.from({length:105},(_,i)=>({...base,country:i<100?'India':'Canada'}));
  const s=buildSnapshot(raw,{minimum:20,now});assert.deepEqual(s.filters.country,[]);
});

test('KPIs are respondent percentages, exclude ineligible answers, and suppress a small complement',()=>{
  const raw=Array.from({length:100},(_,i)=>({...base,response_share:i<40?'None':i<80?'About half (roughly 50/50)':'Not sure',ghosting_share:i<5?'Very few of those processes':'Never'}));
  const s=buildSnapshot(raw,{minimum:20,now});
  assert.deepEqual(s.all.metrics.lowReplies,{available:true,percent:50,n:80});
  assert.equal(s.all.metrics.ghosting.available,false);
});

test('headers require one exact match and never silently remap unknown columns',()=>{
  const titles=['Timestamp',...Object.values(FIELDS).map(f=>f.title),'Private feedback'];
  assert.equal(Object.keys(mapHeaders(titles)).length,Object.keys(FIELDS).length+1);
  assert.throws(()=>mapHeaders(titles.filter(t=>t!==FIELDS.consent.title)),/SCHEMA_MISMATCH/);
  assert.throws(()=>mapHeaders([...titles,FIELDS.consent.title]),/SCHEMA_MISMATCH/);
  assert.equal(columnName(0),'A');assert.equal(columnName(26),'AA');assert.equal(columnName(701),'ZZ');
});

test('Google reader refuses missing credentials before accessing the network',async()=>{
  await assert.rejects(()=>readGoogleRows({}),/MISSING_GOOGLE_CONFIGURATION/);
});

test('API rejects arbitrary filters; live failure never falls back to demo',async()=>{
  const env={DATA_MODE:'demo',CACHE_SECONDS:'120'};
  assert.equal((await handleDashboard('POST','/api/dashboard',env)).status,405);
  assert.equal((await handleDashboard('GET','/api/dashboard?by=__proto__&value=x',env)).status,400);
  assert.equal((await handleDashboard('GET','/api/dashboard?by=country&value=India&age=25',env)).status,400);
  assert.equal((await handleDashboard('GET','/api/dashboard?by=all&by=country',env)).status,400);
  const demo=await handleDashboard('GET','/api/dashboard',env);
  assert.equal(demo.status,200);assert.equal(demo.body.mode,'demo');assert.equal(demo.body.data.total,1840);
  const live=await handleDashboard('GET','/api/dashboard',{DATA_MODE:'live'});
  assert.equal(live.status,503);assert(!JSON.stringify(live.body).includes('1840'));
  const invalid=await handleDashboard('GET','/api/dashboard',{DATA_MODE:'demo',SURVEY_ROUND_START:'2026-02-31'});
  assert.equal(invalid.status,503);
});

test('public API contains aggregates and no raw rows, feedback, keys or private URLs',async()=>{
  const result=await handleDashboard('GET','/api/dashboard?by=country&value=India',{DATA_MODE:'demo',GOOGLE_PRIVATE_KEY:'SECRET',SURVEY_FORM_URL:'javascript:alert(1)'});
  assert.equal(result.status,200);assert.equal(result.body.formUrl,null);
  const text=JSON.stringify(result.body);for(const forbidden of ['SECRET','submitted_at','feedback','@example','GOOGLE_'])assert(!text.includes(forbidden));
});
