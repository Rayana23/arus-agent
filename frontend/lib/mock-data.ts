import type { AgentStage, Statement } from "@/types/finance";

export const statements: Statement[] = [
  { id: "stmt_0931", institution: "Meridian Bank", account: "•••• 4821", accountType: "Current account", period: "1–31 Aug 2026", source: "Gmail · statements@meridian.example", state: "imported", reconciliation: "Matched", transactions: 38, pages: "Statement p. 1–4" },
  { id: "stmt_0932", institution: "Northstar Card", account: "•••• 7314", accountType: "Credit card", period: "6 Aug–5 Sep 2026", source: "Gmail · estatement@northstar.example", state: "imported", reconciliation: "Matched", transactions: 21, pages: "Statement p. 1–3" },
  { id: "stmt_0933", institution: "Harbour Savings", account: "•••• 1098", accountType: "Savings account", period: "1–31 Aug 2026", source: "Gmail · alerts@harbour.example", state: "needs_password", reconciliation: "Review needed", transactions: 0, pages: "Encrypted attachment" },
];

export const stages: AgentStage[] = [
  { id: "run-1", stage: "Gmail", detail: "3 supported attachments discovered", provider: "Synthetic Gmail adapter", status: "Completed", duration: "0.8s", records: 3, retries: 0, timestamp: "13 Sep · 10:42:08" },
  { id: "run-2", stage: "Local PDF Processor", detail: "Decrypted and extracted text locally", provider: "pikepdf + pdfplumber", status: "Completed", duration: "1.3s", records: 2, retries: 0, timestamp: "13 Sep · 10:42:10" },
  { id: "run-3", stage: "OpenRouter", detail: "Structured extraction completed", provider: "OpenRouter", model: "Configured at runtime", status: "Completed", duration: "4.7s", records: 59, retries: 0, timestamp: "13 Sep · 10:42:15" },
  { id: "run-4", stage: "Ledger Guard", detail: "Balances reconciled with exact decimals", provider: "Deterministic code", status: "Completed", duration: "0.02s", records: 2, retries: 0, timestamp: "13 Sep · 10:42:15" },
  { id: "run-5", stage: "Local PDF Processor", detail: "Password required; document not retained", provider: "pikepdf", status: "Needs review", duration: "0.1s", records: 1, retries: 0, timestamp: "13 Sep · 10:42:16" },
];
