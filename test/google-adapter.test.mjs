import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, verify } from 'node:crypto';
import { FIELDS } from '../server/schema.js';
import { readGoogleRows, columnName } from '../server/google.js';

test('Sheets adapter signs a valid JWT and reads only allowlisted columns',async()=>{
  const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});
  const oldFetch=globalThis.fetch;
  const titles=['Timestamp','Private feedback',...Object.values(FIELDS).map(q=>q.title),'Email Address'];
  const calls=[];
  globalThis.fetch=async(url,options)=>{
    const href=String(url);calls.push(href);
    if(href==='https://oauth2.googleapis.com/token'){
      const jwt=options.body.get('assertion'),[header,payload,sig]=jwt.split('.');
      assert(verify('RSA-SHA256',Buffer.from(header+'.'+payload),publicKey,Buffer.from(sig,'base64url')));
      const claims=JSON.parse(Buffer.from(payload,'base64url'));
      assert.equal(claims.scope,'https://www.googleapis.com/auth/spreadsheets.readonly');
      return Response.json({access_token:'test-access-token',expires_in:3600});
    }
    const parsed=new URL(href),ranges=parsed.searchParams.getAll('ranges');
    assert.equal(options.headers.Authorization,'Bearer test-access-token');
    if(ranges.length===1&&ranges[0].endsWith('A1:ZZ1'))return Response.json({valueRanges:[{values:[titles]}]});
    assert.equal(parsed.searchParams.get('valueRenderOption'),'UNFORMATTED_VALUE');
    assert.equal(parsed.searchParams.get('dateTimeRenderOption'),'SERIAL_NUMBER');
    assert(!ranges.some(r=>r.endsWith('B2:B')),'private feedback column must never be fetched');
    const emailCol=columnName(titles.length-1);
    assert(!ranges.some(r=>r.endsWith(emailCol+'2:'+emailCol)),'email column must never be fetched');
    assert.equal(ranges.length,Object.keys(FIELDS).length+1);
    return Response.json({valueRanges:ranges.map((_,i)=>({values:[[i===0?46290:'test-choice']]}))});
  };
  try{
    const rows=await readGoogleRows({GOOGLE_SHEET_ID:'test-sheet-id',GOOGLE_RESPONSE_TAB:'Form Responses 1',GOOGLE_SERVICE_ACCOUNT_EMAIL:'test@example.iam.gserviceaccount.com',GOOGLE_PRIVATE_KEY:privateKey.export({type:'pkcs8',format:'pem'})});
    assert.equal(rows.length,1);assert.equal(rows[0].submitted_at,46290);assert.equal(calls.length,3);
  }finally{globalThis.fetch=oldFetch;}
});
