import type { IntegrationStatus, Transaction } from "@/types/finance";

export const API_URL = process.env.NEXT_PUBLIC_ARUS_API_URL || "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  integrations: () => request<IntegrationStatus>("/api/integrations/status"),
  overview: () => request<Record<string, unknown>>("/api/overview"),
  statements: () => request<Array<Record<string, unknown>>>("/api/statements"),
  transactions: () => request<Transaction[]>("/api/transactions"),
  activity: (jobId: string) => request<Array<Record<string, unknown>>>(`/api/agent-runs/${jobId}`),
  sync: () => request<Record<string, unknown>>("/api/sync", { method: "POST" }),
  verifyOpenRouter: () => request<Record<string, unknown>>("/api/integrations/openrouter/verify", { method: "POST" }),
  disconnectGmail: () => request<{ connected: boolean }>("/api/auth/google/disconnect", { method: "POST" }),
  importStatement: (form: FormData) => request<Record<string, unknown>>("/api/statements/import", { method: "POST", body: form }),
};
