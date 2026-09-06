"use client"

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { json } from 'stream/consumers';

const sleep = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));


type Ticket = {
    id: number;
    customerName: string;
    customerEmail: string;
    subject: string;
    category: string | null;
    priority: string | null;
    sentiment: string | null;
    status: string;
    createdAt: string;
};

const PRIORITY_ORDER: Record<string, number> = {
    Urgent: 0,
    High: 1,
    Medium: 2,
    Low: 3,
    Unclassified: 4,
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

function DashboardClient() {

    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const [tickets, setTickets] = useState<Ticket[]>([]);


    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        fetchTickets();
    }, [statusFilter, priorityFilter, categoryFilter]);

    async function fetchTickets() {
        setIsLoading(true);
        setError(null);


        // await sleep(3000);

        try {

            const params = new URLSearchParams();

            if (statusFilter) params.set("status", statusFilter);
            if (priorityFilter) params.set("priority", priorityFilter);
            if (categoryFilter) params.set("category", categoryFilter);

            const response = await fetch(
                `/api/tickets${params.toString() ? `?${params}` : ""}`
            );

            if (response.status === 401) {
                router.push("/login");
                return;
            }

            if (!response.ok) {
                setError("Failed to load tickets.");
                return;
            }

            const data: Ticket[] = await response.json();
            const sorted = [...data].sort(
                (a, b) =>
                    (PRIORITY_ORDER[a.priority ?? "Unclassified"] ?? 99) -
                    (PRIORITY_ORDER[b.priority ?? "Unclassified"] ?? 99)
            );
            setTickets(sorted);
        } catch {
            setError("Could not reach the server.");
        } finally {
            setIsLoading(false);
        }

    }

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    }

    const hasFilters = statusFilter || priorityFilter || categoryFilter;


    return (
        <main className="min-h-screen px-4 py-8">
            <div className="mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Support Dashboard
                    </h1>

                    <Button variant="outline" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>

                {/* Your main content goes here */}
                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-md border px-3 py-2 text-sm bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="rounded-md border px-3 py-2 text-sm bg-white"
                    >
                        <option value="">All Priorities</option>
                        <option value="Urgent">Urgent</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="rounded-md border px-3 py-2 text-sm bg-white"
                    >
                        <option value="">All Categories</option>
                        <option value="Technical">Technical</option>
                        <option value="Billing">Billing</option>
                        <option value="Account">Account</option>
                        <option value="General">General</option>
                    </select>

                    {hasFilters && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setStatusFilter("");
                                setPriorityFilter("");
                                setCategoryFilter("");
                            }}
                            className="text-red-600 hover:bg-red-50 hover:text-red-600"
                        >
                            Clear filters
                        </Button>
                    )}
                </div>

                {/* Ticket count */}
                {!isLoading && !error && (
                    <p className="text-sm text-muted-foreground mb-4">
                        {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} found
                    </p>
                )}

                {/* Loading state */}
                {isLoading && (
                    <p className="text-sm text-muted-foreground">Loading tickets...</p>
                )}

                {/* Error state */}
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}


                {/* Table */}
                {!isLoading && !error && tickets.length > 0 && (
                    <div className="max-h-[70vh] overflow-y-auto rounded-lg border">{/* chaange */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Sentiment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow
                                        key={ticket.id}
                                        onClick={() => router.push(`/dashboard/${ticket.id}`)}
                                        className="cursor-pointer"
                                    >
                                        <TableCell className="text-muted-foreground">
                                            {ticket.id}
                                        </TableCell>
                                        <TableCell className="font-medium max-w-50 truncate">
                                            {ticket.subject}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground max-w-37.5 truncate">
                                            {ticket.customerName}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {ticket.category ?? "—"}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority ?? "Unclassified"]
                                                    }`}
                                            >
                                                {ticket.priority ?? "Unclassified"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${sentimentColors[ticket.sentiment ?? "Unclassified"]
                                                    }`}
                                            >
                                                {ticket.sentiment ?? "—"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {ticket.status}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground whitespace-nowrap">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}


            </div>


        </main>
    )



}

export default DashboardClient