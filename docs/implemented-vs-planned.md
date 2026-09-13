# Implemented vs planned

| Capability | Status | Notes |
|---|---|---|
| Dashboard views | Implemented | Typed synthetic data; responsive and keyboard accessible |
| Encrypted PDF processing | Implemented | Local pikepdf + pdfplumber, temp cleanup |
| OpenRouter client | Implemented | Strict schema, timeout, retries, safe health |
| Ledger guard | Implemented | Exact Decimal reconciliation and validation |
| SQLite records | Implemented | Extraction, accepted records, corrections stored separately |
| Synthetic Gmail adapter | Implemented | Clearly labelled development flow |
| Mock Gmail/OpenRouter | Implemented | Automated tests |
| Live Gmail API | Adapter boundary | Needs read-only OAuth service wiring and user authorization |
| Hosted processing API | Local-only | FastAPI is the runnable processing backend; hosted Site is the demo UI |
| Password retry | API shape only | Requires secure attachment re-fetching |
| Exa, OpenAI briefing, Gemma | Not implemented | Intentionally deferred until core integration is complete |
