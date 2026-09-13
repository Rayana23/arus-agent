export function googleReadError(status:number,payload:unknown){
 const error=(payload as {error?:{message?:string;details?:{reason?:string}[];errors?:{reason?:string}[]}}|null)?.error;
 const reasons=[...(error?.details||[]),...(error?.errors||[])].map(d=>d.reason||'');
 const message=error?.message||'';
 if(reasons.some(r=>['SERVICE_DISABLED','accessNotConfigured'].includes(r))||/API has not been used|API.*disabled/i.test(message))return {code:'SHEETS_API_DISABLED',error:'Google sign-in succeeded, but Google Sheets API is disabled for your OAuth project. In Google Cloud Console, select the project that owns this client ID and enable Google Sheets API. Wait a few minutes, then click Read Google Sheets again.'};
 if(status===401)return {code:'GOOGLE_AUTH_EXPIRED',error:'Google authorization expired or was rejected. Disconnect Google, then authorize again.'};
 if(reasons.includes('ACCESS_TOKEN_SCOPE_INSUFFICIENT')||/insufficient authentication scopes/i.test(message))return {code:'GOOGLE_SCOPE_MISSING',error:'Google did not grant Sheets read access. Disconnect Google, authorize again, and allow access to your spreadsheets.'};
 if(status===403)return {code:'SHEET_ACCESS_DENIED',error:'Google denied access to this spreadsheet. Open the prepared Google Sheet using the same Google account chosen in the authorization popup. Grant that account Viewer access using Share. If access already exists, check your Google Workspace administrator’s app restrictions.'};
 if(status===404)return {code:'SHEET_NOT_FOUND',error:'Google could not find this sheet for the authorized account. Check the link and grant that Google account Viewer access to the prepared sheet.'};
 if(status===400)return {code:'SHEET_RANGE_INVALID',error:'Google rejected the spreadsheet ranges. Check that the tabs are named exactly Statements, Transactions and Profile, with no extra spaces.'};
 if(status===429)return {code:'GOOGLE_RATE_LIMIT',error:'Google Sheets temporarily limited requests. Wait a moment, then try Read Google Sheets again.'};
 return {code:'GOOGLE_READ_FAILED',error:`Google Sheets returned HTTP ${status}. The previous snapshot is unchanged. Retry shortly.`};
}
