"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { priorityColors, sentimentColors, statusColors } from "@/lib/ticketStyles";
import { Ticket } from "@/types/ticket";

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
        <span className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${statusColors[ticket.status]}`}>
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



      {(ticket.status === "Open" || ticket.status === "InProgress") && (
        <div className="flex flex-col gap-2">

          <div className="flex gap-2">
            {ticket.status !== "InProgress" && (

              <Button
                variant="outline"
                onClick={() => handleStatusUpdate("InProgress")}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Mark as In Progress"}
              </Button>
            )}

            <Button
              onClick={() => handleStatusUpdate("Resolved")}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Mark as Resolved"}
            </Button>
          </div>
          <div className="min-h-5">
            {updateError && (
              <p className="text-sm text-red-600">{updateError}</p>
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