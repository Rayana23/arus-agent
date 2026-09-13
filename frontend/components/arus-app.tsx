"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BadgeCheck, Building2, ChevronRight, CircleAlert, FileLock2, FileText, LayoutDashboard, LockKeyhole, RefreshCw, Settings, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { stages, statements } from "@/lib/mock-data";
import type { NavView, StatementState } from "@/types/finance";

const nav = [
  { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
  { id: "statements" as const, label: "Statements", icon: FileText },
  { id: "review" as const, label: "Review", icon: CircleAlert, count: 2 },
  { id: "activity" as const, label: "Agent Activity", icon: Activity },
  { id: "settings" as const, label: "Settings", icon: Settings },
];

function Status({ state }: { state: StatementState }) {
  const labels: Record<StatementState, string> = { discovered: "Discovered", processing: "Processing", needs_password: "Password needed", needs_review: "Needs review", imported: "Imported", unsupported: "Unsupported", failed: "Failed" };
  const good = state === "imported";
  return <Badge variant="outline" className={good ? "border-teal-200 bg-teal-50 text-teal-800" : "border-amber-200 bg-amber-50 text-amber-900"}>{good ? <BadgeCheck /> : <CircleAlert />}{labels[state]}</Badge>;
}

function Metric({ label, value, note, tone = "ink" }: { label: string; value: string; note: string; tone?: "ink" | "teal" }) {
  return <article className="metric-card"><p className="eyebrow">{label}</p><p className={tone === "teal" ? "metric-value text-teal-800" : "metric-value"}>{value}</p><p className="mt-2 text-sm text-slate-500">{note}</p></article>;
}

function Overview() {
  return <div className="space-y-6">
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Latest reported cash" value="RM 12,480.60" note="As of 31 Aug 2026" tone="teal" />
      <Metric label="Reported card debt" value="RM 2,184.25" note="As of 5 Sep 2026" />
      <Metric label="Statement spending" value="RM 4,326.80" note="Across 2 verified statements" />
      <Metric label="Statement coverage" value="2 of 3" note="1 statement needs attention" />
    </section>
    <div className="notice" role="status"><CircleAlert className="mt-0.5 size-5 shrink-0 text-amber-700" /><div><p className="font-semibold text-slate-900">Balances have different reporting dates</p><p className="mt-1 text-sm text-slate-600">Cash is reported as of 31 Aug; card debt is reported as of 5 Sep. These are statement balances, not live available balances.</p></div></div>
    <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
      <article className="surface p-5 sm:p-6"><div className="section-heading"><div><p className="eyebrow">Verified overview</p><h2>What the statements show</h2></div><ShieldCheck className="size-6 text-teal-700" /></div><p className="mt-5 max-w-2xl text-[1rem] leading-7 text-slate-700">The two reconciled statements report RM 12,480.60 in cash and RM 2,184.25 in card debt. Verified spending across their statement periods totals RM 4,326.80. The Harbour Savings statement is excluded until its password is provided.</p><div className="mt-6 border-t border-slate-200 pt-5"><div className="flex items-center justify-between text-sm"><span className="font-medium text-slate-700">Statements reconciled</span><span className="tabular font-semibold">2 / 2 processed</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-full rounded-full bg-teal-600" /></div></div></article>
      <article className="surface overflow-hidden"><div className="section-heading border-b border-slate-200 p-5"><div><p className="eyebrow">Latest sync</p><h2>Gmail import</h2></div><Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-800"><BadgeCheck />Completed</Badge></div><div className="space-y-0 px-5">{[["Attachments found","3"],["Imported","2"],["Needs attention","1"],["Finished","10:42 MYT"]].map(([label,value]) => <div key={label} className="flex items-center justify-between border-b border-slate-100 py-3.5 last:border-0"><span className="text-sm text-slate-500">{label}</span><span className="tabular text-sm font-semibold text-slate-900">{value}</span></div>)}</div></article>
    </section>
    <article className="surface overflow-hidden"><div className="section-heading p-5 sm:px-6"><div><p className="eyebrow">Coverage</p><h2>Imported statements</h2></div><span className="text-sm text-slate-500">Synthetic demo inbox</span></div><div className="divide-y divide-slate-100 border-t border-slate-200">{statements.map((statement) => <div key={statement.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"><div className="flex min-w-0 items-start gap-3"><div className="icon-tile"><Building2 /></div><div className="min-w-0"><p className="font-semibold text-slate-900">{statement.institution} <span className="ml-1 font-normal text-slate-500">{statement.account}</span></p><p className="mt-1 truncate text-sm text-slate-500">{statement.period} · {statement.transactions} transactions</p></div></div><Status state={statement.state} /></div>)}</div></article>
  </div>;
}

function Statements() {
  return <div className="space-y-4">{statements.map((s) => <article key={s.id} className="surface p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3"><div className="icon-tile"><FileText /></div><div><h2>{s.institution} <span className="font-normal text-slate-500">{s.account}</span></h2><p className="mt-1 text-sm text-slate-500">{s.accountType} · {s.period}</p></div></div><Status state={s.state} /></div><div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2 lg:grid-cols-4">{[["Gmail source",s.source],["Reconciliation",s.reconciliation],["Transactions",String(s.transactions)],["Provenance",s.pages]].map(([k,v])=><div key={k}><p className="eyebrow">{k}</p><p className="mt-1.5 text-sm font-medium text-slate-800">{v}</p></div>)}</div></article>)}</div>;
}

function Review() {
  return <div className="grid gap-5 lg:grid-cols-2"><ReviewCard icon={LockKeyhole} label="Password needed" title="Harbour Savings · •••• 1098" copy="The attachment stayed encrypted. Enter the statement password to retry local processing; it will not be stored or sent to a model." action="Enter password" /><ReviewCard icon={SlidersHorizontal} label="Low-confidence category" title="MERCHANT* KLG 8371" copy="OpenRouter suggested “Dining” with 62% confidence. The amount and balance are already verified; only the category needs confirmation." action="Review category" /></div>;
}

function ReviewCard({icon: Icon,label,title,copy,action}:{icon: typeof CircleAlert;label:string;title:string;copy:string;action:string}) {
  return <article className="surface p-6"><div className="icon-tile warning"><Icon /></div><p className="eyebrow mt-5 text-amber-800">{label}</p><h2 className="mt-1">{title}</h2><p className="mt-3 text-[1rem] leading-6 text-slate-600">{copy}</p><Button className="mt-6 bg-slate-950 text-white hover:bg-slate-800">{action}<ChevronRight /></Button></article>;
}

function AgentActivity() {
  return <article className="surface overflow-hidden"><div className="border-b border-slate-200 p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">Run AR-2026-0913-1042</p><h2 className="mt-1">How this sync was completed</h2></div><p className="text-sm text-slate-500">No prompts or financial text retained</p></div></div><ol className="divide-y divide-slate-100">{stages.map((item,index)=><li key={item.id} className="grid gap-4 p-5 sm:grid-cols-[36px_1fr_auto] sm:p-6"><div className={item.status === "Completed" ? "step done" : "step warning"}>{item.status === "Completed" ? <BadgeCheck /> : <CircleAlert />}</div><div><div className="flex flex-wrap items-center gap-2"><h3>{item.stage}</h3><span className="text-sm text-slate-400">{index+1} of {stages.length}</span></div><p className="mt-1 text-sm text-slate-600">{item.detail}</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500"><span>Provider: {item.provider}</span>{item.model && <span>Model: {item.model}</span>}<span>{item.records} records</span><span>{item.retries} retries</span></div></div><div className="sm:text-right"><Badge variant="outline" className={item.status === "Completed" ? "border-teal-200 bg-teal-50 text-teal-800" : "border-amber-200 bg-amber-50 text-amber-900"}>{item.status}</Badge><p className="mt-2 text-xs text-slate-500">{item.duration} · {item.timestamp}</p></div></li>)}</ol></article>;
}

function SettingsView() {
  return <div className="grid gap-5 lg:grid-cols-2"><article className="surface p-6"><div className="section-heading"><div><p className="eyebrow">Connection</p><h2>Gmail</h2></div><Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-800">Synthetic demo</Badge></div><p className="mt-4 text-sm leading-6 text-slate-600">The demo adapter mirrors Gmail attachment metadata. Live Gmail requires read-only OAuth and is not represented as connected here.</p><div className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm"><div className="flex justify-between gap-4"><span className="text-slate-500">Allowed senders</span><span className="text-right font-medium">3 configured</span></div><div className="flex justify-between gap-4"><span className="text-slate-500">Statement password</span><span className="font-medium">Configured locally</span></div></div><Button variant="outline" className="mt-6">Disconnect Gmail</Button></article><article className="surface p-6"><p className="eyebrow">Data controls</p><h2 className="mt-1">Local financial data</h2><p className="mt-4 text-sm leading-6 text-slate-600">Passwords, decrypted PDFs, raw statement text, prompts, tokens, and full account identifiers are never retained.</p><div className="mt-6 flex flex-wrap gap-3"><Button variant="outline">Remove password</Button><Button variant="destructive">Delete imported data</Button></div></article></div>;
}

export function ArusApp() {
  const [view, setView] = useState<NavView>("overview");
  const [syncing, setSyncing] = useState(false);
  const current = useMemo(() => nav.find((item) => item.id === view)!, [view]);
  const runSync = () => { setSyncing(true); window.setTimeout(() => setSyncing(false), 1200); };
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: object, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const report = () => undefined;
    void Promise.resolve(context.registerTool({
      name: "start_gmail_sync",
      title: "Sync Gmail statements",
      description: "Start the same synthetic Gmail statement sync shown by the visible Sync Gmail button.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async () => { runSync(); return { status: "started", adapter: "synthetic" }; },
    }, { signal: lifecycle.signal })).catch(report);
    void Promise.resolve(context.registerTool({
      name: "navigate_arus_view",
      title: "Open an Arus view",
      description: "Open Overview, Statements, Review, Agent Activity, or Settings in the visible Arus workspace.",
      inputSchema: { type: "object", properties: { view: { type: "string", enum: ["overview", "statements", "review", "activity", "settings"] } }, required: ["view"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (input: unknown) => { const next = (input as { view?: string })?.view; if (!nav.some((item) => item.id === next)) throw new Error("Unknown Arus view"); setView(next as NavView); return { view: next }; },
    }, { signal: lifecycle.signal })).catch(report);
    return () => lifecycle.abort();
  }, []);
  return <SidebarProvider><Sidebar collapsible="offcanvas" className="border-r border-slate-200"><SidebarHeader className="p-5"><div className="flex items-center gap-3"><div className="brand-mark"><span /></div><div><p className="text-[1.08rem] font-bold tracking-[-0.03em]">Arus</p><p className="text-xs text-slate-500">Financial agent</p></div></div></SidebarHeader><SidebarContent><SidebarGroup><SidebarGroupLabel className="mb-2 px-3 text-xs font-semibold uppercase tracking-[.12em] text-slate-400">Workspace</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{nav.map((item)=><SidebarMenuItem key={item.id}><SidebarMenuButton isActive={view===item.id} onClick={()=>setView(item.id)} tooltip={item.label} className="h-10 cursor-pointer rounded-lg px-3 data-[active=true]:bg-teal-50 data-[active=true]:text-teal-900"><item.icon /><span>{item.label}</span>{item.count && <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">{item.count}</span>}</SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent><SidebarFooter className="p-4"><div className="rounded-xl border border-slate-200 bg-white p-3"><div className="flex items-center gap-2 text-sm font-semibold"><FileLock2 className="size-4 text-teal-700" />Local-first</div><p className="mt-1.5 text-xs leading-5 text-slate-500">PDFs decrypt and reconcile on your machine.</p></div></SidebarFooter></Sidebar><SidebarInset className="min-w-0 bg-[#f7f9f9]"><header className="sticky top-0 z-20 flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 sm:px-7 lg:px-10"><div className="flex min-w-0 items-center gap-3"><SidebarTrigger className="md:hidden" /><div><p className="eyebrow hidden sm:block">Financial workspace</p><h1>{current.label}</h1></div></div><Button onClick={runSync} disabled={syncing} className="bg-teal-700 text-white shadow-sm hover:bg-teal-800"><RefreshCw className={syncing ? "animate-spin" : ""}/>{syncing ? "Checking Gmail…" : "Sync Gmail"}</Button></header><main className="mx-auto w-full max-w-[1440px] p-4 sm:p-7 lg:p-10"><div className="mb-7 flex flex-wrap items-end justify-between gap-3"><p className="text-sm text-slate-500">{view === "overview" ? "Balances and spending from reconciled statements only." : view === "activity" ? "Safe operational metadata for the latest agent run." : view === "review" ? "Resolve items that cannot be verified automatically." : view === "statements" ? "Source, status, and provenance for every discovered statement." : "Connections and data controls."}</p><div className="flex items-center gap-2 text-xs font-medium text-slate-500"><span className="size-2 rounded-full bg-teal-600" />Latest sync completed · 10:42 MYT</div></div>{view === "overview" && <Overview />}{view === "statements" && <Statements />}{view === "review" && <Review />}{view === "activity" && <AgentActivity />}{view === "settings" && <SettingsView />}</main></SidebarInset></SidebarProvider>;
}
