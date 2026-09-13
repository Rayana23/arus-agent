export type NavView = "overview" | "transactions" | "statements" | "review" | "activity" | "settings";

export type StatementState = "discovered" | "processing" | "needs_password" | "needs_review" | "imported" | "unsupported" | "failed";

export type Statement = {
  id: string; institution: string; account: string; accountType: string; period: string;
  source: string; state: StatementState; reconciliation: "Matched" | "Review needed";
  transactions: number; pages: string;
};

export type AgentStage = {
  id: string; stage: string; detail: string; provider: string; model?: string;
  status: "Completed" | "Needs review"; duration: string; records: number;
  retries: number; timestamp: string;
};

export type IntegrationStatus = {
  gmail: { implemented: boolean; connected: boolean; mode: "real" | "synthetic" | "mocked"; account: string | null; status: string };
  openrouter: { implemented: boolean; configured: boolean; verified: boolean; mode: "real" | "mocked"; model: string; status: string };
  pdf: { implemented: boolean; encrypted_pdf_supported: boolean; status: string };
  exa: { implemented: boolean; configured: boolean; status: string };
  google_sheets: { implemented: boolean; connected: boolean; status: string };
};

export type Transaction = {
  source_identifier: string; date: string; description: string; direction: "debit" | "credit";
  amount: string; currency: string; page_reference: number; suggested_merchant: string | null;
  suggested_category: string | null; category_confidence: string | null; statement_id: string | number;
  institution: string; masked_account_identifier: string;
};
