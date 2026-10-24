import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Inbox } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TicketDetailShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-slate-50/70 text-slate-900">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-17 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Inbox aria-hidden="true" className="size-4.5" />
            </span>
            <span className="text-sm font-semibold tracking-tight">AI Ticket Triage</span>
          </Link>
          <div className="flex shrink-0 items-center gap-4">
            <span className="hidden border-r border-slate-200 pr-4 text-xs text-slate-500 sm:block">Agent workspace</span>
            <Link href="/dashboard" aria-label="Back to inbox" className={cn(buttonVariants({ variant: "ghost" }), "h-9 gap-2 text-slate-600")}>
              <ArrowLeft aria-hidden="true" className="size-4" />
              <span className="sm:hidden">Inbox</span>
              <span className="hidden sm:inline">Back to inbox</span>
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-10 lg:px-10">
        {children}
      </div>
    </main>
  );
}
