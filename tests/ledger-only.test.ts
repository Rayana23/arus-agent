import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fromSheetValues} from '../lib/sheets';
import {summarize} from '../lib/finance';
import {healthMetrics,blankProfile} from '../lib/health';
test('Transaction-only ledger imports, displays entries, and never invents balances',()=>{const statements=fromSheetValues([['statement_id','bank','account','type','currency','period','as_of','opening_balance','closing_balance','transaction_coverage','balances_known'],['a','Not supplied','Savings 0000','deposit','MYR','2026-08','2026-08-31','','',false,false]],[['statement_id','transaction_id','date','description','amount','kind','category'],['a','1','2026-08-25','Salary',8500,'income','uncategorised']]);const s=summarize(statements,'2026-08');assert.equal(s.tx.length,1);assert.equal(s.cash,null);assert.equal(s.debt,null);assert.equal(s.complete,false);assert.equal(healthMetrics(statements,'2026-08',blankProfile).netWorth,null);});
