"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Ticket = {
  id: number;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: string | null;
  priority: string | null;
  sentiment: string | null;
  aiReasoning: string | null;
  status: string;
  createdAt: string;
};

const priorityColors: Record<string, string> = {
  Urgent: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
  Unclassified: "bg-gray-100 text-gray-600",
};

const sentimentColors: Record<string, string> = {
  Frustrated: "bg-red-50 text-red-600",
  Neutral: "bg-gray-100 text-gray-600",
  Positive: "bg-green-50 text-green-700",
  Unclassified: "bg-gray-100 text-gray-500",
};

export default function TicketDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  useEffect(() => {
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


  async function handleResolve() {
    if (!ticket) return;
    setIsResolving(true);
    setResolveError(null);
    try {
      const response = await fetch(`/api/tickets/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" }),
      });

      if (!response.ok) {
        setResolveError("Failed to resolve ticket. Try again.");
        return;
      }

      setTicket((prev) => prev ? { ...prev, status: "Resolved" } : prev);
    } catch {
      setResolveError("Could not reach the server.");
    } finally {
      setIsResolving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground">Loading ticket...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to dashboard
        </Button>
      </main>
    );
  }

  if (!ticket) return null;

  return (
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">

      {/*header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          ← Back
        </Button>
        <span className="text-sm text-muted-foreground">
          Ticket #{ticket.id}
        </span>
      </div>


      {/*subject and status */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
        <span className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${ticket.status === "Resolved"
          ? "bg-green-100 text-green-700"
          : ticket.status === "InProgress"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-600"
          }`}>
          {ticket.status}
        </span>
      </div>


      {/*info */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Customer</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{ticket.customerName}</span>
          <span className="text-muted-foreground">{ticket.customerEmail}</span>
          <span className="text-muted-foreground">
            Submitted {new Date(ticket.createdAt).toLocaleString()}
          </span>
        </CardContent>
      </Card>


      {/*descr*/}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
        </CardContent>
      </Card>


      {/* AI result */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">AI Classification</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Category
              </span>
              <span className="text-sm font-medium">
                {ticket.category ?? "Unclassified"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Priority
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority ?? "Unclassified"]
                }`}>
                {ticket.priority ?? "Unclassified"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Sentiment
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${sentimentColors[ticket.sentiment ?? "Unclassified"]
                }`}>
                {ticket.sentiment ?? "Unclassified"}
              </span>
            </div>
          </div>

          {ticket.aiReasoning && (
            <div className="border-t pt-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">
                Reasoning
              </span>
              <p className="text-sm text-muted-foreground italic">
                "{ticket.aiReasoning}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>



      {ticket.status !== "Resolved" && (
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleResolve}
            disabled={isResolving}
            className="w-full sm:w-auto"
          >
            {isResolving ? "Resolving..." : "Mark as Resolved"}
          </Button>
          <div className="min-h-5">
            {resolveError && (
              <p className="text-sm text-red-600">{resolveError}</p>
            )}
          </div>
        </div>
      )}

      {ticket.status === "Resolved" && (
        <p className="text-sm text-green-600 font-medium">
          ✓ This ticket has been resolved
        </p>
      )}

    </main>
  );
}