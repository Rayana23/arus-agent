import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fromProfileValues} from '../lib/sheets';
import {healthMetrics} from '../lib/health';
const header=['period','as_of','other_assets','other_liabilities','gross_income','debt_payments','savings_contributions','confirmed'];
test('Blank unconfirmed profile imports without inventing financial metrics',()=>{const p=fromProfileValues([header,['2026-09','2026-09-08','','','','','',false]]);const h=healthMetrics([],'2026-09',p);assert.equal(h.netWorth,null);assert.equal(h.dti,null);assert.equal(h.savings,null);});
test('Blank confirmed financial inputs remain invalid',()=>{assert.throws(()=>fromProfileValues([header,['2026-09','2026-09-08','','','','','',true]]));});
