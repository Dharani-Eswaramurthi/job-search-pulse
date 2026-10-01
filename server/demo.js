import { FIELDS } from './schema.js';

export function demoRows(now = new Date()) {
  let seed = 90451;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const pick = (id, weights = null) => {
    const options = FIELDS[id].options;
    if (!weights) return options[Math.floor(random() * options.length)];
    let x = random() * weights.reduce((a,b)=>a+b,0);
    for (let i=0; i<weights.length; i++) { x-=weights[i]; if (x<=0) return options[i]; }
    return options[0];
  };
  const countries = ['India','United States','United Kingdom','Canada','Germany','Australia','Philippines','Brazil'];
  return Array.from({ length: 1840 }, (_, i) => {
    const date = new Date(now); date.setUTCDate(date.getUTCDate() - Math.floor(random() * 55));
    const r = { submitted_at: date.toISOString(), consent: 'Yes, I agree' };
    for (const [id,q] of Object.entries(FIELDS)) if (id!=='consent') r[id]=q.type==='checkbox' ? [q.options[0],q.options[2]] : pick(id);
    r.country = countries[Math.floor(random()*countries.length)];
    r.search_status=pick('search_status',[60,12,12,12,4]);
    r.employment_status=pick('employment_status',[27,35,8,5,12,5,4,3,1,0]);
    r.recent_activity=random()>.12?'Yes':'No';
    r.response_share=pick('response_share',[14,33,21,12,6,4,4,6]);
    r.positive_share=pick('positive_share',[32,32,15,7,3,2,3,6]);
    r.ghosting_share=pick('ghosting_share',[19,22,15,12,8,5,6,13]);
    r.difficulty=pick('difficulty',[4,8,15,39,30,4]);
    r.experience=pick('experience',[6,10,22,19,17,12,6,6,2]);
    r.furthest_stage=pick('furthest_stage',[29,22,16,15,6,3,4,4,1]);
    r.daily_applications=pick('daily_applications',[5,25,32,21,9,4,4]);
    r.search_duration=pick('search_duration',[5,12,29,25,16,9,4]);
    r.industry=FIELDS.industry.options[Math.floor(random()*14)];
    r.channels=FIELDS.channels.options.filter((_,j)=>random() < [0.73,0.38,0.25,0.10,0.16,0.12,0.24,0.64,0.33,0.27,0.18,0.09,0.08,0.04][j]);
    if(!r.channels.length) r.channels=[FIELDS.channels.options[7]];
    r.work_arrangement=FIELDS.work_arrangement.options.filter(()=>random()<.7);
    return r;
  });
}
