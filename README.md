# Arus — Financial health from Google Sheets

A private dashboard consolidating statement balances and ledger rows from Google Sheets. Its three headline metrics are Net Worth, Debt-to-Income and Savings Rate. Exa retrieves public guidance using only a generalized topic derived from the selected metric and a geography.

## Run and verify

Node 22+, `npm install`, `npm run dev`. Domain tests: `npx tsx --test tests/domain.test.ts`. Type checking: `npx tsc --noEmit`. The Sites helper builds and packages the Cloudflare-compatible deployment.

## Current connection status

The user's Google Sheet link and credentials have not yet been supplied. The deployed app therefore starts with explicitly illustrative data. The Sheets adapter is implemented against the provisional schema in `public/sheet-schema.txt`; map it to the user's actual columns before claiming a live connection. No PDF upload or Gmail ingestion is part of this dashboard.

Enable Google Sheets API and give a service account Viewer access to the intended private spreadsheet. Configure GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY through server-side hosting secrets. Never commit credentials. The adapter uses a read-only Sheets scope, a fixed sheet ID and no domain-wide delegation. It rejects links to other sheets. Nothing is written back. The app reads Statements A:J and Transactions A:G, validates IDs, dates, joins, MYR amounts and duplicate account/month statements, and checks reconciliation. A failed refresh preserves the last snapshot.

## Three metric definitions

### Net Worth

Latest bank assets plus confirmed other assets minus latest bank liabilities and confirmed other liabilities. Negative deposit balances are liabilities; positive card credit balances are assets. Other assets and liabilities must exclude balances already counted from statements. Unreconciled full statements block a complete net-worth result. Balance-only rows can support the balance snapshot when upstream reviewed, but not flow metrics. Dates remain visible, including mixed valuation dates. One snapshot cannot establish an upward trend.

### Debt-to-Income

Required monthly debt payments divided by gross monthly income, multiplied by 100. Outstanding debt balances, salary deposits after deductions and arbitrary discretionary repayments are not substitutes. The user must confirm the missing profile inputs for the selected month. Zero gross income yields unavailable, never zero percent or infinity. User-defined planning bands: below 20% flexible; 20% to below 36% within target; 36% and above review.

### Savings Rate

New monthly savings and investment contributions divided by gross monthly income, multiplied by 100. Count a contribution once. Exclude transfers of existing savings, borrowed funds and market appreciation. The user-defined target is at least 20% of gross income. This is deliberately not relabelled as the common 50/30/20 take-home-income rule.

The sample uses RM 18,420.65 bank cash, RM 50,000 other assets, RM 2,480 card liability and RM 18,000 other debt: net worth RM 47,940.65. Gross monthly income RM 10,000, required payments RM 1,324 and new contributions RM 2,000 yield DTI 13.24% and savings rate 20%. All are synthetic examples, not observations about the user.

The Review Inputs dialog supplements missing statement fields. Real Sheets refresh invalidates confirmation; the first real sync clears sample profile values. All app data, profile inputs and saved research cards remain in the current tab and clear on reload. The full financial profile is currently entered locally; it can be mapped to additional Sheets columns once the real sheet is inspected.

## Exa integration

With server secret EXA_API_KEY, POST /api/research calls https://api.exa.ai/search using type auto, contents.highlights true, five results and official-source domain preferences. No news-only category is used for evergreen financial guidance. Without a key, the working https://mcp.exa.ai/mcp web_search_exa transport remains available. MCP parsing accepts SSE or JSON. Provider failures are visible; no result is invented. The direct authenticated Search API path awaits an API key for live verification; the MCP path has been exercised live.

The request schema permits only metric, general band, geography and confirmation. It rejects exact ratios, financial amounts and arbitrary free text. Queries are built from fixed phrases for financial education and never contain ledger rows or identity. Source cards show a short evidence excerpt, HTTPS primary-source link, publisher, publication date when supplied, actual retrieval date, effective-date caveat and a deterministic review prompt. Prompts are educational templates selected by the metric band, not an LLM-generated personalized financial recommendation. Research reflects metric status at the time of the search and must be refreshed after input changes. The app never trades, predicts returns or determines eligibility for borrowing or tax treatment.

## Limitations

MYR and monthly statement periods only. Upstream Sheets classifications and transfer ownership must already be reviewed. Unknown financial accounts cannot be discovered from absent rows. No reliable gross-income or savings-contribution inference from raw salary/transfer descriptions. One locally confirmed monthly profile at a time, no persistent trend history, automatic scheduled refresh or saved-user database. The product requires the user's real sheet and access configuration to complete integration.

## Sources

- Google Sheets API: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/get
- Service-account authentication: https://developers.google.com/identity/protocols/oauth2/service-account
- DTI definition: https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/
- Exa MCP: https://exa.ai/docs/reference/exa-mcp
- Exa Search configuration follows the API guide supplied by the user. Its canonical docs.exa.ai URL could not be opened by the browsing tool; the supplied content is used for the direct API adapter.
