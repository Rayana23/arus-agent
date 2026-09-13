# Arus — Financial health from Google Sheets

A private dashboard consolidating statement balances and ledger rows from Google Sheets. Its three headline metrics are Net Worth, Debt-to-Income and Savings Rate. Exa retrieves public guidance using only a generalized topic derived from the selected metric and a geography.

## Run and verify

Node 22+, `npm install`, `npm run dev`. Domain tests: `npx esbuild tests/domain.test.ts --bundle --platform=node --format=esm --outfile=/tmp/arus-tests.mjs`, then `node --test /tmp/arus-tests.mjs` (bundling avoids an upstream fast-json-patch/tsx resolution issue). Type checking: `npx tsc --noEmit`. The Sites helper builds and packages the Cloudflare-compatible deployment.

## Current connection status

The private native Google Sheet is https://docs.google.com/spreadsheets/d/1zJPT1VTAHXu4pIcG6KLM_NGtn6h4O1bqph01Quh_Kno/edit. The app starts from a verified snapshot of its extracted sample card and synthetic supplemental inputs, clearly labelled demo data. Native Google Sheets recalculation and the application both produce net worth RM49,698.13, DTI13.151%, savings20%.

CopilotKit v2 registers four frontend tools: connect_google_drive, refresh_google_sheet, show_financial_metrics and research_articles. An AG-UI self-managed deterministic controller dispatches guided actions locally. No open-ended LLM or Copilot cloud runtime is configured. Tokens are kept outside agent messages and tool arguments.

For live read access, configure GOOGLE_OAUTH_CLIENT_ID or paste the public web client ID in Connection setup. Google Identity Services uses a user-initiated popup and spreadsheets.readonly scope. Add the deployed site's JavaScript origin, enable Sheets API, and allow the Google account on the testing consent screen. The website cannot reuse Codex's Drive connection. Tokens stay in memory and expire; failed refresh preserves the snapshot. Setup: public/google-connection.txt. The Google OAuth client ID has not been supplied; live app authorization has not been verified.

Alternatively set GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY as server environment values and grant that service account Viewer access. Never commit credentials. The server accepts only its configured spreadsheet. Read ranges: Statements A:O, Transactions A:L, Profile A:I. The first blank row terminates a raw table, excluding notes beneath it. Native serial dates are converted; posted dates determine monthly transaction totals while complete statement cycles determine reconciliation.

## Three metric definitions

### Net Worth

Latest bank assets plus confirmed other assets minus latest bank liabilities and confirmed other liabilities. Negative deposit balances are liabilities; positive card credit balances are assets. Other assets and liabilities must exclude balances already counted from statements. Unreconciled full statements block a complete net-worth result. Balance-only rows can support the balance snapshot when upstream reviewed, but not flow metrics. Dates remain visible, including mixed valuation dates. One snapshot cannot establish an upward trend.

### Debt-to-Income

Required monthly debt payments divided by gross monthly income, multiplied by 100. Outstanding debt balances, salary deposits after deductions and arbitrary discretionary repayments are not substitutes. The user must confirm the missing profile inputs for the selected month. Zero gross income yields unavailable, never zero percent or infinity. User-defined planning bands: below 20% flexible; 20% to below 36% within target; 36% and above review.

### Savings Rate

New monthly savings and investment contributions divided by gross monthly income, multiplied by 100. Count a contribution once. Exclude transfers of existing savings, borrowed funds and market appreciation. The user-defined target is at least 20% of gross income. This is deliberately not relabelled as the common 50/30/20 take-home-income rule.

The supplemented scenario includes bank deposits RM20,000, investments RM50,000, card debt RM2,301.87 and loan principal RM18,000. Gross income RM10,000, required instalments RM1,315.10, and new contributions RM2,000. Supplemental September month-end figures are fabricated test data. The supplied card remains dated 8 September; August posted transactions stay in August. Its September coverage is partial. One wallet top-up remains unclassified.

The Profile tab supplies reviewed supplemental inputs and a confirmation boolean. Refresh reads the profile alongside balances; editing inputs locally lasts only until refresh/reload. No actual holdings or personal financial account completeness is inferred from this demonstration.

## Exa article ingestion

Queries contain only a fixed metric-topic phrase, geography and site:mrmoneytv.com/articles/. Private amounts, ratios, PII, raw queries and tokens are rejected by a strict request schema. The selected editorial publisher is Mr Money TV, not a regulator. Non-Malaysia requests return an explicit corpus mismatch.

With EXA_API_KEY, Search API retrieves bounded article text. Without a key, Exa MCP web_search_exa discovers URLs, strict host/path validation rejects other sites and indexes, and web_fetch_exa retrieves actual article text. Only retrieved, topic-matching evidence produces a card. Cards include a <=23-word excerpt, source URL, publication and retrieval dates, and a deterministic review prompt. Prompts are Arus interpretation, not publisher quotations or individualized advice. Product rates, tax eligibility and regulatory details are not asserted as current truth. Article content never becomes agent instructions. The MCP search-and-fetch path has been exercised live; the authenticated direct path awaits a key.

## Limitations

MYR and monthly statement periods only. Upstream Sheets classifications and transfer ownership must already be reviewed. Unknown financial accounts cannot be discovered from absent rows. No reliable gross-income or savings-contribution inference from raw salary/transfer descriptions. One locally confirmed monthly profile at a time, no persistent trend history, automatic scheduled refresh or saved-user database. App Google OAuth authorization still requires a configured client ID and consent. The sample ledger is ready in Drive.

## Sources

- Google Sheets API: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/get
- Service-account authentication: https://developers.google.com/identity/protocols/oauth2/service-account
- DTI definition: https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/
- Exa MCP: https://exa.ai/docs/reference/exa-mcp
- Exa Search configuration follows the API guide supplied by the user. Its canonical docs.exa.ai URL could not be opened by the browsing tool; the supplied content is used for the direct API adapter.
