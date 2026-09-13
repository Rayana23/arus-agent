import {Statement} from './finance';
export function ledgerMetrics(statements:Statement[],period:string){
 const rows=statements.flatMap(s=>s.transactions.filter(t=>t.date.startsWith(period)).map(t=>({...t,accountType:s.type,account:s.account})));
 const salary=rows.filter(t=>t.accountType==='deposit'&&t.amount>0&&t.kind==='income'&&/salary|payroll/i.test(t.description));
 const grossIncome=salary.reduce((n,t)=>n+t.amount,0);
 const depositPayments=rows.filter(t=>t.accountType==='deposit'&&t.amount<0&&t.kind==='repayment');
 // Pair each card-side credit to at most one deposit-side payment; never count both legs.
 const unmatched=[...depositPayments];
 const cardPayments=rows.filter(t=>t.accountType==='card'&&t.amount<0&&t.kind==='repayment').filter(t=>{const i=unmatched.findIndex(d=>d.amount===t.amount&&Math.abs(Date.parse(d.date)-Date.parse(t.date))<=3*86400000);if(i<0)return true;unmatched.splice(i,1);return false;});
 const repayments=[...depositPayments,...cardPayments];
 const contributions=rows.filter(t=>t.accountType==='deposit'&&t.amount<0&&(!!t.newContribution||/\bsavings\b|\binvestment\b|asset managem/i.test(t.description)));
 const debtPayments=repayments.reduce((n,t)=>n+Math.abs(t.amount),0);
 const savingsContributions=contributions.reduce((n,t)=>n+(t.newContribution||Math.abs(t.amount)),0);
 return {grossIncome,debtPayments,savingsContributions,repayments,contributions,salary,repaymentRatio:grossIncome>0&&repayments.length?debtPayments/grossIncome*100:null,savingsRate:grossIncome>0&&contributions.length?savingsContributions/grossIncome*100:null};
}
export function depositPeriod(statements:Statement[],fallback:string){const months=statements.filter(s=>s.type==='deposit').flatMap(s=>s.transactions.map(t=>t.date.slice(0,7)));return months.sort().at(-1)||fallback;}
