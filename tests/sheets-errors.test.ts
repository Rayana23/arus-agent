import {test} from 'node:test';
import assert from 'node:assert/strict';
import {POST} from '../app/api/sheets/route';
import {DEMO_SHEET_URL} from '../lib/sheet-config';
test('Sheets API disabled error survives the route and identifies the required fix',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({error:{code:403,status:'PERMISSION_DENIED',message:'Google Sheets API has not been used in project before or it is disabled.',details:[{reason:'SERVICE_DISABLED',metadata:{service:'sheets.googleapis.com'}}]}},{status:403});
 try{const response=await POST(new Request('https://arus.example/api/sheets',{method:'POST',headers:{Authorization:'Bearer test-token','Content-Type':'application/json'},body:JSON.stringify({url:DEMO_SHEET_URL})}));const body=await response.json() as {code?:string,error:string};assert.equal(body.code,'SHEETS_API_DISABLED');assert.match(body.error,/enable Google Sheets API/i);}finally{globalThis.fetch=original;}
});

import {googleReadError} from '../lib/google-errors';
test('Google permission, scope and range errors have different recovery instructions',()=>{assert.equal(googleReadError(403,{}).code,'SHEET_ACCESS_DENIED');assert.equal(googleReadError(404,{}).code,'SHEET_NOT_FOUND');assert.equal(googleReadError(400,{}).code,'SHEET_RANGE_INVALID');assert.equal(googleReadError(403,{error:{details:[{reason:'ACCESS_TOKEN_SCOPE_INSUFFICIENT'}]}}).code,'GOOGLE_SCOPE_MISSING');assert.equal(googleReadError(401,{}).code,'GOOGLE_AUTH_EXPIRED');});
