const $ = selector => document.querySelector(selector);
const number = value => Number(value).toLocaleString('en');
const esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const short = label => ({
  'Almost none / very few':'Very few', 'About half (roughly 50/50)':'About half', 'Almost all / all':'Almost all or all',
  'Very few of those processes':'Very few', 'Company career websites':'Company career sites', 'Employee referrals / personal network':'Referrals & personal networks',
  'Recruiters / staffing agencies contacting me':'Recruiters & agencies', 'Other local or industry-specific job boards':'Local / specialist job boards',
  'Direct email / direct messages to employers':'Direct email / messages', 'University / campus placement / career fairs':'Campus / career fairs',
  'Wellfound / startup job boards':'Wellfound / startup boards', 'Application submitted / acknowledgment only':'Applied / acknowledgment only',
  'Recruiter conversation or screening call':'Recruiter screening', 'Assessment / take-home task completed':'Assessment completed',
  'Final interview / reference or background checks':'Final interview / checks', 'Offer accepted / started the role':'Accepted offer / started',
  'I did not submit applications; I was only interviewing or contacted by recruiters':'Interviewing / recruiter contact only',
  'Employed, have not resigned, and exploring a change':'Employed, exploring a change', 'Student / recent graduate seeking my first full-time role':'Student / recent graduate',
  'Freelancing / self-employed and seeking an employed role':'Freelancing / self-employed', 'Serving notice and still looking for my next role':'Serving notice, still looking',
  'Serving notice with my next role already secured':'Serving notice, next role secured', 'Returning after a career break':'Returning from a career break',
  'Open to opportunities, but not actively searching':'Open, not actively searching', 'Looking, but have not started applying':'Looking, not yet applying',
  'Recently finished my search / accepted an offer':'Recently completed search', 'Lead / staff / principal specialist':'Lead / staff / principal',
  'In the country where I currently live':'Country of residence', 'Across several countries / international remote roles':'Several countries / remote',
  'Not sure / not currently targeting roles':'Not targeting roles', 'No professional experience yet':'No experience yet',
  '1 to less than 3 years':'1–<3 years', '3 to less than 5 years':'3–<5 years', '5 to less than 8 years':'5–<8 years', '8 to less than 12 years':'8–<12 years','12 to less than 16 years':'12–<16 years',
  '1 to less than 3 months':'1–<3 months','3 to less than 6 months':'3–<6 months','6 to less than 12 months':'6–<12 months'
}[label] || label);
let current = null, activeTab = 'overview', replyView = 'response_share', requestNumber = 0, controller = null, timer;

function table(chart) {
  if (!chart?.available) return '';
  return `<details><summary>View data table</summary><div class="table-wrap"><table><caption class="sr-only">Eligible respondents: ${number(chart.n)}</caption><thead><tr><th scope="col">Response</th><th scope="col">People</th><th scope="col">Share</th></tr></thead><tbody>${chart.rows.map(r=>`<tr><th scope="row">${esc(r.label)}</th><td>${r.suppressed?'Withheld':number(r.count)}</td><td>${r.suppressed?'Withheld':r.percent+'%'}</td></tr>`).join('')}</tbody></table></div></details>`;
}
function bars(chart, color = '', sort = false) {
  if (!chart?.available) return '<div class="chart-empty">More eligible responses are needed to show this breakdown.</div>';
  const rows = [...chart.rows];
  if (sort) rows.sort((a,b)=>(b.count ?? -1)-(a.count ?? -1));
  const max = Math.max(1,...rows.map(r=>r.percent||0));
  return `<div class="chart-legend"><span class="legend-dot ${color}"></span>Share of eligible respondents</div><div class="bar-list ${color}">${rows.map(r=>`<div class="bar-item" title="${esc(r.label)}: ${r.suppressed?'withheld':number(r.count)+' of '+number(chart.n)+' respondents ('+r.percent+'%)'}"><span class="bar-name">${esc(short(r.label))}</span><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${r.suppressed?0:r.percent/max*100}%"></div></div><span class="bar-value ${r.suppressed?'suppressed':''}">${r.suppressed?'Withheld':r.percent+'%'}</span></div>`).join('')}</div>`;
}
function card(field, title, description, {color='',sort=false,note='',controls=''}={}) {
  const chart = current.data.charts[field];
  return `<article class="chart-card" data-chart="${field}"><div class="chart-top"><div><h2>${esc(title)}</h2><p class="chart-desc">${esc(description)}</p></div>${chart?.available?`<span class="sample-label">n = ${number(chart.n)}</span>`:''}</div>${controls}${bars(chart,color,sort)}${note?`<p class="chart-note">${esc(note)}</p>`:''}${table(chart)}</article>`;
}
function metric(title, item, description, icon) {
  return `<article class="metric"><div class="metric-label">${esc(title)}<span class="mini-icon" aria-hidden="true">${icon}</span></div><div class="metric-value">${item?.available ? item.percent+'<small>%</small>' : '—'}</div><p class="metric-note">${esc(description)}</p><p class="metric-note">${item?.available ? 'Of '+number(item.n)+' eligible respondents' : 'Not enough publishable data'}</p></article>`;
}
function renderMetrics() {
  const {data,mode} = current;
  $('#metrics').classList.remove('skeleton');
  $('#metrics').innerHTML = `<article class="metric"><div class="metric-label">Survey respondents<span class="mini-icon" aria-hidden="true">▥</span></div><div class="metric-value">${number(data.total)}</div><p class="metric-note">In this view · self-reported experiences</p><span class="metric-pill">${mode==='demo'?'SYNTHETIC EXAMPLE':'COMMUNITY RESPONSES'}</span></article>`+
    metric('Few or no employer replies',data.metrics.lowReplies,'Reported “none” or “very few” replies','◷')+
    metric('Communication stopped',data.metrics.ghosting,'Reported this in at least some processes','◌')+
    metric('Finding suitable roles is hard',data.metrics.difficult,'Reported “somewhat” or “very” difficult','⌕');
}
function renderWeekly() {
  const cells=current.data.weekly, width=640, height=170, floor=128, max=Math.max(1,...cells.map(x=>x.count||0)), step=width/8;
  const svg = cells.map((c,i)=>{
    const h=(c.count||0)/max*94, x=i*step+20, label=new Date(c.label+'T00:00:00Z').toLocaleDateString('en',{month:'short',day:'numeric',timeZone:'UTC'});
    return `<g><text class="count" x="${x+20}" y="${floor-h-10}" text-anchor="middle">${c.suppressed?'—':c.count}</text><rect class="graph-bar" x="${x}" y="${floor-h}" width="40" height="${h}" rx="4"/><text x="${x+20}" y="153" text-anchor="middle">${label}</text></g>`;
  }).join('');
  return `<article class="chart-card weekly"><div><p class="eyebrow">PARTICIPATION</p><h2>More voices, more context.</h2><p>Responses submitted each week, over the last eight weeks. The current week is incomplete.</p><p>Submission volume is not a job-market trend.</p></div><div class="weekly-chart"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Weekly response counts; exact values are in the table below."><line x1="0" y1="128" x2="640" y2="128" stroke="#e0e6f0"/>${svg}</svg><details><summary>View weekly counts</summary><table><thead><tr><th scope="col">Week beginning</th><th scope="col">Responses</th></tr></thead><tbody>${cells.map(c=>`<tr><th scope="row">${c.label}</th><td>${c.suppressed?'Withheld':number(c.count)}</td></tr>`).join('')}</tbody></table></details></div></article>`;
}
function renderOverview() {
  if(!current?.data.available) return;
  renderMetrics();
  const controls=`<div class="chart-switch" aria-label="Response chart"><button data-reply="response_share" class="${replyView==='response_share'?'active':''}" aria-pressed="${replyView==='response_share'}">Any decision / next step</button><button data-reply="positive_share" class="${replyView==='positive_share'?'active':''}" aria-pressed="${replyView==='positive_share'}">Next-step invitations</button></div>`;
  $('#overview-charts').innerHTML = '<div class="chart-grid">'+
    card(replyView,replyView==='response_share'?'Are employers getting back?':'Are applications moving forward?','Applicants’ estimates for applications submitted 14–30 days before answering.',{controls,note:'These are reported frequency bands, not exact application-level response rates.'})+
    card('ghosting_share','When the conversation goes quiet','After an invitation or conversation, across processes with enough time to judge.',{color:'teal',note:'Excludes explicit rejections, explained delays and replies that are not overdue.'})+
    card('channels','Where people enter the hiring process','Channels used in the past 30 days. More than one answer is possible.',{sort:true,note:'Usage does not show which platform produced an interview or offer.'})+
    card('furthest_stage','How far did the process go?','Furthest stage reached or completed in the past 30 days.',{color:'teal',note:'Each person appears once. This is a distribution of stages, not a hiring funnel.'})+
    card('daily_applications','The pace of applying','Approximate applications on days when the respondent applied.',{color:'slate',note:'Excludes non-application days; this is not a calendar-day average.'})+
    card('search_duration','How long have people been looking?','Length of the current or most recent job search.',{color:'slate'})+
    '</div>'+renderWeekly();
  document.querySelectorAll('[data-reply]').forEach(button=>button.addEventListener('click',()=>{
    replyView=button.dataset.reply;renderOverview();document.querySelector(`[data-reply="${replyView}"]`).focus();
  }));
}
function renderPeople() {
  if(!current?.data.available) return;
  $('#people-charts').innerHTML =
    card('search_status','Where people are in their search','Current job-search status.',{color:'teal'})+
    card('employment_status','Current work situation','Employment, notice-period and return-to-work situations.')+
    card('experience','Years of professional experience','Total professional experience, including paid internships.',{color:'slate'})+
    card('age_group','Age groups','Optional response; undisclosed and missing answers are excluded.',{color:'teal'})+
    card('industry','Industries people are targeting','Industry of the employer, rather than the applicant’s job function.',{sort:true})+
    card('target_level','The level of the next role','The main position level respondents are targeting.',{color:'slate'})+
    card('country','Countries of residence','Where respondents currently live; not necessarily where they are applying.',{sort:true})+
    card('target_market','Looking locally or internationally?','The location of target roles relative to the respondent’s home country.',{color:'teal'})+
    card('work_arrangement','Work arrangements people would consider','Multiple selections allowed.',{color:'slate'})+
    card('difficulty','How easy is it to find a suitable role?','Openings matching skills, position level and location.',{color:'teal'});
  // Countries with zero responses add no useful information to this long chart.
  const country=current.data.charts.country;
  if(country?.available) {
    const meaningful={...country,rows:country.rows.filter(r=>r.count!==0)};
    const el=document.querySelector('[data-chart="country"]');
    const top=el.querySelector('.chart-top').outerHTML;
    el.innerHTML=top+bars(meaningful,'',true)+table(meaningful);
  }
}
function chooseTab(tab, focus=false) {
  activeTab=tab;
  document.querySelectorAll('[data-tab]').forEach(b=>{const selected=b.dataset.tab===tab;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1;if(selected&&focus)b.focus();});
  for(const name of ['overview','people','method']) $('#panel-'+name).hidden=name!==tab || (name!=='method'&&current&&!current.data.available);
  $('#empty').hidden=tab==='method'||!current||current.data.available;
}
function fillFilters() {
  const by=$('#dimension').value, values=current?.filters[by]||[];
  const chosen=current?.selection.by===by?current.selection.value:'';
  $('#value-field').hidden=by==='all';$('#reset').hidden=by==='all';
  $('#cohort').innerHTML=values.length?values.map(v=>`<option value="${esc(v)}" ${v===chosen?'selected':''}>${esc(v)}</option>`).join(''):'<option value="">No publishable groups yet</option>';
  $('#cohort').disabled=!values.length;
}
function render() {
  const {mode,selection,data,generatedAt,minimum,roundStart}=current;
  $('#dimension').disabled=false;
  $('#demo-banner').hidden=mode!=='demo';
  $('#mode').className='mode '+mode;$('#mode').textContent=mode==='demo'?'Demo data':'Live responses';
  const timestamp=new Date(generatedAt).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  $('#updated').textContent='Snapshot updated '+timestamp;
  $('#updated').title=new Date(generatedAt).toLocaleString();
  $('#scope').textContent=selection.by==='all'?'All respondents':`${$('#dimension').selectedOptions[0].textContent}: ${selection.value}`;
  $('#footer-mode').textContent=mode==='demo'?'Synthetic demonstration · Not real survey results':'Live survey summaries · Small groups withheld';
  $('#privacy-method').textContent=`Cohorts and nonzero response categories smaller than ${minimum} are withheld. Sometimes a second category is also withheld so a small count cannot be calculated from the total. Filters cannot be combined.`;
  $('#round-label').textContent=roundStart?'This survey round includes submissions from '+roundStart+'.':'This view includes all eligible submissions in the connected survey round.';
  $('#form-link').hidden=!current.formUrl;
  if(current.formUrl) $('#form-link').href=current.formUrl;
  $('#download').disabled=!data.available;
  $('#empty-text').textContent=`This view needs at least ${minimum} consenting respondents before results are published. Some small groups are also withheld to protect their privacy.`;
  if(data.available){renderOverview();renderPeople();}
  fillFilters();chooseTab(activeTab);
}
async function load({by='all',value=''}={}) {
  const serial=++requestNumber;
  if(controller)controller.abort();controller=new AbortController();
  clearTimeout(timer);$('#refresh').disabled=true;$('#loading').textContent='Updating summary…';
  const query=by==='all'?'':`?by=${encodeURIComponent(by)}&value=${encodeURIComponent(value)}`;
  try {
    const response=await fetch('/api/dashboard'+query,{signal:controller.signal});
    if(!response.ok)throw new Error('Source unavailable');
    const payload=await response.json();
    if(serial!==requestNumber)return;
    if(payload.version!==1||!payload.data)throw new Error('Unexpected response');
    current=payload;$('#dimension').value=by;$('#error').hidden=true;render();
    $('#loading').textContent=`Auto-refresh every ${Math.round(current.refreshSeconds/60)} min`;
  } catch(error) {
    if(error.name==='AbortError'||serial!==requestNumber)return;
    $('#error').hidden=false;
    $('#error').textContent=current?'Could not update the summary. You’re seeing the last successful snapshot; retry shortly.':'The survey summary is temporarily unavailable. Please try Refresh shortly.';
    $('#mode').className='mode offline';$('#mode').textContent='Update unavailable';
    $('#loading').textContent=current?'Last successful snapshot retained':'Unable to load';
    if(current){$('#dimension').value=current.selection.by;fillFilters();}
    else {$('#metrics').classList.remove('skeleton');$('#metrics').innerHTML='';}
  } finally {
    if(serial===requestNumber){$('#refresh').disabled=false;timer=setTimeout(()=>{if(!document.hidden)load(current?.selection);},(current?.refreshSeconds||120)*1000);}
  }
}

function exportCsv() {
  if(!current?.data.available)return;
  const rows=[['Job Search Pulse',current.mode==='demo'?'SYNTHETIC DEMO DATA':'Live survey summary'],['Snapshot',current.generatedAt],['Group',current.selection.value||'All respondents'],['Respondents',current.data.total],['Note','Self-selected respondent estimates; not application-level conversion rates.'],[],['Metric','Percent','Eligible respondents']];
  for(const [id,m] of Object.entries(current.data.metrics))rows.push([id,m.available?m.percent:'Withheld',m.available?m.n:'Withheld']);
  rows.push([],['Question','Response','People','Share percent','Eligible respondents']);
  for(const [field,c] of Object.entries(current.data.charts)){
    if(!c.available){rows.push([field,'Breakdown unavailable']);continue;}
    for(const r of c.rows)rows.push([field,r.label,r.suppressed?'Withheld':r.count,r.suppressed?'Withheld':r.percent,c.n]);
  }
  rows.push([],['Week beginning','Submissions']);for(const w of current.data.weekly)rows.push([w.label,w.suppressed?'Withheld':w.count]);
  const cell=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
  const blob=new Blob(['\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`job-search-pulse-${current.mode}-${current.generatedAt.slice(0,10)}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

$('#dimension').addEventListener('change',()=>{
  const by=$('#dimension').value;
  if(by==='all'){load();return;}
  fillFilters();
  if($('#cohort').value)load({by,value:$('#cohort').value});
  else {$('#dimension').value=current?.selection.by||'all';fillFilters();$('#loading').textContent='No groups large enough in that dimension yet.';}
});
$('#cohort').addEventListener('change',()=>load({by:$('#dimension').value,value:$('#cohort').value}));
$('#reset').addEventListener('click',()=>load());
$('#refresh').addEventListener('click',()=>load(current?.selection));
$('#download').addEventListener('click',exportCsv);
document.querySelectorAll('[data-tab]').forEach((button,index)=>{
  button.addEventListener('click',()=>chooseTab(button.dataset.tab));
  button.addEventListener('keydown',event=>{
    const names=['overview','people','method'];let target;
    if(event.key==='ArrowRight')target=(index+1)%3;
    if(event.key==='ArrowLeft')target=(index+2)%3;
    if(event.key==='Home')target=0;if(event.key==='End')target=2;
    if(target!==undefined){event.preventDefault();chooseTab(names[target],true);}
  });
});
$('#method-link').addEventListener('click',e=>{e.preventDefault();chooseTab('method',true);$('#panel-method').scrollIntoView({behavior:'smooth'});});
document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(!document.hidden)load(current?.selection);});
$('#dimension').disabled=true;
load();
