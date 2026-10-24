"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Circle,
  CircleAlert,
  Clock3,
  Flag,
  LoaderCircle,
  Mail,
  MessageSquare,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { priorityColors, sentimentColors, statusColors } from "@/lib/ticketStyles";
import type { Ticket } from "@/types/ticket";
import TicketDetailShell from "./TicketDetailShell";
import TicketDetailSkeleton from "./TicketDetailSkeleton";

const PANEL_CLASS = "min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40";

function Priority({ value }: { value: string | null }) {
  const priority = value ?? "Unclassified";
  const Icon = priority === "Urgent" ? CircleAlert : Flag;
  return (
    <span className={cn("inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium wrap-anywhere", priorityColors[priority] ?? priorityColors.Unclassified)}>
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {priority}
    </span>
  );
}

function Status({ value }: { value: string }) {
  const Icon = value === "Resolved" ? Check : value === "InProgress" ? Clock3 : Circle;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium", statusColors[value] ?? statusColors.Open)}>
      <Icon aria-hidden="true" className="size-3 shrink-0" />
      {value === "InProgress" ? "In progress" : value}
    </span>
  );
}

export default function TicketDetailClient({ id, initialTicket }: { id: string; initialTicket: Ticket | null }) {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(initialTicket);
  const [isLoading, setIsLoading] = useState(!initialTicket);
  const [error, setError] = useState<string | null>(null);

  const isFirstRender = useRef(true);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialTicket) return;
    }
    fetchTicket();
  }, [id]);

  async function fetchTicket() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tickets/${id}`);

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 404) {
        setError("Ticket not found.");
        return;
      }

      if (!response.ok) {
        setError("Failed to load ticket.");
        return;
      }

      const data: Ticket = await response.json();
      setTicket(data);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusUpdate(status: string) {
    if (!ticket) return;
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const response = await fetch(`/api/tickets/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        setUpdateError("Failed to update ticket status. Try again.");
        return;
      }

      setTicket((prev) => prev ? { ...prev, status } : prev);
    } catch {
      setUpdateError("Could not reach the server.");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) return <TicketDetailSkeleton />;

  if (error) {
    const isNotFound = error === "Ticket not found.";
    return (
      <TicketDetailShell>
        <section role="alert" className={cn(PANEL_CLASS, "mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center sm:mt-10")}>
          <span className="mb-5 rounded-2xl bg-slate-100 p-4 text-slate-400"><CircleAlert aria-hidden="true" className="size-7" /></span>
          <h1 className="text-xl font-semibold tracking-tight">{isNotFound ? "Ticket not found." : "Unable to load this ticket"}</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">{isNotFound ? "This ticket may have been removed, or the link may be incorrect." : error ?? "Please try again in a moment."}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="h-9 gap-2 border-slate-200 text-slate-700"><ArrowLeft aria-hidden="true" className="size-4" />Back to inbox</Button>
          </div>
        </section>
      </TicketDetailShell>
    );
  }

  if (!ticket) return null;

  const needsReview = !ticket.category || ticket.category === "Unclassified"
    || !ticket.priority || ticket.priority === "Unclassified"
    || !ticket.sentiment || ticket.sentiment === "Unclassified";
  const canUpdate = ticket.status === "Open" || ticket.status === "InProgress";
  const submittedAt = new Date(ticket.createdAt).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <TicketDetailShell>
      <div className="mb-7 flex min-w-0 flex-col gap-5 sm:mb-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm text-slate-500">Ticket #{ticket.id}</span>
            <Status value={ticket.status} />
            <Priority value={ticket.priority} />
          </div>
          <h1 className="mt-3 text-2xl leading-tight font-semibold tracking-tight wrap-anywhere sm:text-3xl">{ticket.subject}</h1>
          <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
            <CalendarDays aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span>Submitted <time dateTime={ticket.createdAt}>{submittedAt}</time></span>
          </p>
        </div>

        <div className="min-w-0 lg:max-w-sm lg:shrink-0">
          {canUpdate && (
            <div className="flex flex-col gap-2 min-[480px]:flex-row lg:justify-end">
              {ticket.status === "Open" && (
                <Button variant="outline" onClick={() => handleStatusUpdate("InProgress")} disabled={isUpdating} className="h-10 gap-2 border-slate-200 bg-white px-4 text-slate-700">
                  {isUpdating ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Clock3 aria-hidden="true" className="size-4" />}
                  {isUpdating ? "Updating…" : "Mark in progress"}
                </Button>
              )}
              <Button onClick={() => handleStatusUpdate("Resolved")} disabled={isUpdating} className="h-10 gap-2 bg-indigo-600 px-4 text-white hover:bg-indigo-700">
                {isUpdating ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Check aria-hidden="true" className="size-4" />}
                {isUpdating ? "Updating…" : "Resolve ticket"}
              </Button>
            </div>
          )}
          {updateError && <p role="alert" className="mt-3 text-sm leading-5 text-red-700">{updateError}</p>}
          <p role="status" className="sr-only">{isUpdating ? "Updating ticket status…" : `Ticket status: ${ticket.status === "InProgress" ? "In progress" : ticket.status}`}</p>
          {ticket.status === "Resolved" && (
            <p className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700"><Check aria-hidden="true" className="size-4 shrink-0" />This ticket has been resolved.</p>
          )}
        </div>
      </div>

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-labelledby="message-heading" className={cn(PANEL_CLASS, "lg:min-h-72")}>
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4 sm:px-6">
            <MessageSquare aria-hidden="true" className="size-4 text-slate-400" />
            <h2 id="message-heading" className="text-sm font-semibold">Customer message</h2>
          </div>
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <p className="text-sm leading-7 whitespace-pre-wrap text-slate-700 wrap-anywhere">{ticket.description}</p>
          </div>
        </section>

        <aside aria-label="Ticket information" className="min-w-0 space-y-5">
          <section aria-labelledby="customer-heading" className={PANEL_CLASS}>
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
              <UserRound aria-hidden="true" className="size-4 text-slate-400" />
              <h2 id="customer-heading" className="text-sm font-semibold">Customer</h2>
            </div>
            <div className="min-w-0 px-5 py-5">
              <p className="text-sm font-medium text-slate-800 wrap-anywhere">{ticket.customerName}</p>
              <div className="mt-2 flex min-w-0 items-start gap-2 text-sm leading-6 text-slate-500">
                <Mail aria-hidden="true" className="mt-1 size-3.5 shrink-0" />
                <span className="min-w-0 break-all">{ticket.customerEmail}</span>
              </div>
            </div>
          </section>

          <section aria-labelledby="classification-heading" className={PANEL_CLASS}>
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
              <Sparkles aria-hidden="true" className="size-4 text-indigo-500" />
              <h2 id="classification-heading" className="text-sm font-semibold">AI classification</h2>
            </div>
            <div className="px-5 py-5">
              {needsReview && (
                <div className="mb-5 rounded-lg border border-amber-100 bg-amber-50 px-3 py-3">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-amber-800"><CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />Needs review</p>
                  <p className="mt-1.5 text-xs leading-5 text-amber-800">Some triage details are unavailable. Review this request manually.</p>
                </div>
              )}
              <dl className="space-y-4 text-sm">
                <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-3">
                  <dt className="py-1 text-slate-500">Category</dt>
                  <dd className="py-1 text-right font-medium text-slate-700 wrap-anywhere">{ticket.category ?? "Unclassified"}</dd>
                </div>
                <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-3">
                  <dt className="py-1 text-slate-500">Priority</dt>
                  <dd className="flex justify-end"><Priority value={ticket.priority} /></dd>
                </div>
                <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-3">
                  <dt className="py-1 text-slate-500">Sentiment</dt>
                  <dd className={cn("py-1 text-right font-medium wrap-anywhere", sentimentColors[ticket.sentiment ?? "Unclassified"] ?? sentimentColors.Unclassified)}>{ticket.sentiment ?? "Unclassified"}</dd>
                </div>
              </dl>
            </div>
            {ticket.aiReasoning && (
              <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
                <h3 className="mb-2 text-xs font-medium text-slate-700">Why this classification</h3>
                <p className="text-sm leading-6 text-slate-600 wrap-anywhere">{ticket.aiReasoning}</p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </TicketDetailShell>
  );
}
