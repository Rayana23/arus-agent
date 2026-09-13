export type NavView = "overview" | "statements" | "review" | "activity" | "settings";

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
