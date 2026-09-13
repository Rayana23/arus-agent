# Arus — Google Sheets dashboard and Exa research

Arus reads a consolidated ledger from Google Sheets and presents historical cash, card debt, external deposit cash flow, recognized purchases and a user-reviewed planning remainder. Sample data is explicitly illustrative. It never claims to be a live bank balance.

## Run

Use Node 22 or later, `npm install`, and `npm run dev`. Run domain checks with `npx tsx --test tests/domain.test.ts`; type-check with `npx tsc --noEmit`.

## Google Sheets connection

The server reads a fixed private spreadsheet through the Google Sheets API. Enable the Sheets API, create a service account, and share only the intended sheet with that account as Viewer. Configure these server-side secrets through the hosting provider, never in client code or Git:

- GOOGLE_SHEET_ID
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (PKCS8 service-account private key)

A read-only OAuth scope is used. No domain-wide delegation is needed. The server rejects a supplied sheet link unless its ID matches the configured ID. The app never writes to Sheets and does not send ledger rows to Exa.

`public/sheet-schema.txt` defines the provisional Statements (A:J) and Transactions (A:G) tables. The actual user's spreadsheet and columns have not been supplied yet: that schema must be inspected and mapping adjusted before claiming a connected integration. Dates can be ISO strings or Google Sheets date serials; amounts are numeric MYR, converted to integer sen. Statement IDs join both tables. Unknown references, duplicate IDs, conflicting account/month records, invalid dates and unsupported types are rejected. Read limits are 1,999 statement rows and 10,000 transaction rows. Reconciliation failures remain visible and their transaction totals are excluded.

Google Sheets is the source of truth. Refresh replaces the last snapshot only after the entire response validates. A failed refresh retains the prior data. Data, planning settings, holding confirmation and saved research cards live only in the current browser tab and clear on reload.

## Financial definitions

- Latest cash: latest eligible reported deposit closing balance per account; unreconciled full statements are excluded. Reviewed balance-only rows can contribute cash but not transaction totals.
- Card debt: separate latest reported card closing balances.
- Net cash flow: incoming minus outgoing deposit-account movements, excluding confirmed own transfers. Card repayments are outgoing cash but not additional purchases.
- Purchase spending: recognized purchase entries across deposits and cards. Refunds shown separately.
- Planning remainder: cash less the selected unpaid commitment and reserve, after user review. It is not a live safe-to-spend amount.

The prototype assumes monthly statements and MYR only. Transfers/classifications must already be confirmed upstream in the sheet. It does not infer beneficial ownership, reconcile partial transfer pairs or automatically categorize transactions. Completeness is relative to known imported accounts; accounts not present anywhere cannot be detected. Balances at different dates are labelled accordingly. No cash-flow percentage comparisons are invented for absent periods.

## Exa MCP

`POST /api/research` invokes `web_search_exa` on `https://mcp.exa.ai/mcp` using HTTP JSON-RPC and supports SSE responses. This prototype uses Exa's public MCP access, which may rate-limit. No model or Exa key is embedded.

Requests accept only a confirmed asset ID, geography ID and topic ID from strict allowlists. Extra fields, including private amounts, are rejected. Free-text financial details are never included in outbound search queries. Results must have HTTPS primary-source hosts from a curated allowlist; unsupported/empty results generate a visible no-evidence state. Cards show a short excerpt, source link, publisher, actual retrieval date, publication date when supplied, explicit uncertainty, and a topic-based review prompt. Review prompts are deterministic educational templates, not an LLM's personalized recommendation or an assertion that the source establishes eligibility. One confirmed holding at a time is supported.

No auto trades, buy/sell recommendations, real-time prices, tax eligibility determinations, PDF ingestion or Gmail connection are implemented in this dashboard. The user clarified that Google Sheets is the data source.

## Verification

Domain tests cover sample financial totals, transfer/repayment exclusion, stale/missing periods, reconciliation failures, duplicate revisions, strict research privacy, source host filtering, exact Sheets monetary conversion and missing-account coverage. A live local API request to Exa returned primary PIDM source cards. Google Sheets live access awaits the actual sheet and credentials.

API documentation: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/get
Service account authentication: https://developers.google.com/identity/protocols/oauth2/service-account
Exa MCP: https://exa.ai/docs/reference/exa-mcp
