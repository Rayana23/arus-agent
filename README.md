# Arus

Arus is a Gmail-native financial statement agent. It discovers supported statement PDFs, decrypts and extracts them locally, asks OpenRouter for strict structured data, and accepts figures only after deterministic ledger reconciliation.

## What is implemented

- Responsive Next.js dashboard with Overview, Statements, Review, Agent Activity, and Settings views.
- FastAPI health, import, sync, statement, overview, job, provider-health, and activity endpoints.
- Local encrypted-PDF detection, SHA-256 deduplication key, isolated decryption, page-aware text extraction, and automatic temporary-file cleanup.
- Provider-neutral model interface, genuine OpenRouter client, safe health check, strict Pydantic output, timeout, and bounded retries.
- Exact `Decimal` reconciliation: opening balance + credits - debits = closing balance.
- SQLite SQLAlchemy records separating model extraction, accepted records, and user corrections.
- Synthetic, mock, and real Gmail adapter boundaries; safe activity metadata.

## Fixture-driven, mocked, and planned

- **Fixture-driven:** the dashboard and default sync response use clearly labelled synthetic Gmail metadata and synthetic financial records.
- **Mocked in tests:** OpenRouter responses and Gmail attachments. The opt-in integration test makes a real safe OpenRouter connectivity call when a key is configured.
- **Planned wiring:** Gmail OAuth discovery in `RealGmailAdapter` needs an authenticated read-only Gmail service. Password retry needs attachment re-fetching. The hosted dashboard remains a safe demo surface; local FastAPI runs the processing pipeline.
- **Not implemented:** Exa, OpenAI briefings, Gemma, online banking access, or a chat interface.

## Setup

Requirements: Node.js 22+, Python 3.12+, and system libraries supported by `pikepdf`.

```bash
cp .env.example .env
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -e '.[test]'
cd ../frontend
npm ci
```

Set environment values locally. Never commit `.env`.

## Run

```bash
# terminal 1
cd backend && source .venv/bin/activate && uvicorn app.main:app --reload

# terminal 2
cd frontend && npm run dev
```

Open `http://localhost:3000`. The API health check is `http://localhost:8000/health`.

## Test

```bash
cd backend
source .venv/bin/activate
pytest -m 'not integration'
```

The real OpenRouter check is opt-in:

```bash
pytest -m integration backend/tests/test_provider.py
```

No test prints credentials. See `docs/security.md` before using real statements.
