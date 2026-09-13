import {z} from 'zod';
import {Statement,reconciled} from './finance';
export const profileSchema=z.object({period:z.string().regex(/^\d{4}-\d{2}$/),asOf:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),otherAssets:z.number().int().nonnegative().safe(),otherLiabilities:z.number().int().nonnegative().safe(),grossIncome:z.number().int().nonnegative().safe(),debtPayments:z.number().int().nonnegative().safe(),savingsContributions:z.number().int().nonnegative().safe(),confirmed:z.boolean()});
export type Profile=z.infer<typeof profileSchema>;
export const SAMPLE_PROFILE:Profile={period:'2026-08',asOf:'2026-08-31',otherAssets:5000000,otherLiabilities:1800000,grossIncome:1000000,debtPayments:132400,savingsContributions:200000,confirmed:true};
export const blankProfile:Profile={period:'',asOf:'',otherAssets:0,otherLiabilities:0,grossIncome:0,debtPayments:0,savingsContributions:0,confirmed:false};
export function healthMetrics(statements:Statement[],period:string,p:Profile){
 const cutoff=period+'-31';const latest=Object.values(statements.filter(s=>s.asOf<=cutoff).reduce<Record<string,Statement>>((a,s)=>{const k=s.bank+'|'+s.account+'|'+s.type;if(!a[k]||a[k].asOf<s.asOf)a[k]=s;return a;},{}));
 const valid=latest.filter(s=>s.balancesKnown!==false&&(reconciled(s)||!s.transactionCoverage));const bankAssets=valid.reduce((n,s)=>n+(s.type==='deposit'?Math.max(0,s.closing):Math.max(0,-s.closing)),0),bankLiabilities=valid.reduce((n,s)=>n+(s.type==='card'?Math.max(0,s.closing):Math.max(0,-s.closing)),0);
 const confirmed=p.confirmed&&p.period===period,complete=confirmed&&latest.length>0&&valid.length===latest.length;
 const totalAssets=bankAssets+p.otherAssets,totalLiabilities=bankLiabilities+p.otherLiabilities;
 const netWorth=complete?totalAssets-totalLiabilities:null;
 const dti=confirmed&&p.grossIncome>0?p.debtPayments/p.grossIncome*100:null;
 const savings=confirmed&&p.grossIncome>0?p.savingsContributions/p.grossIncome*100:null;
 return {netWorth,dti,savings,bankAssets,bankLiabilities,totalAssets,totalLiabilities,dates:[...new Set([...valid.map(s=>s.asOf),...(confirmed?[p.asOf]:[])])].sort(),netBand:netWorth===null?'unknown':netWorth>0?'positive':'nonpositive',dtiBand:dti===null?'unknown':dti<20?'flexible':dti<36?'within_target':'high',savingsBand:savings===null?'unknown':savings>=20?'on_target':'below_target'};
}
