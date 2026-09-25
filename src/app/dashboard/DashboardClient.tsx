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
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { priorityColors, sentimentColors, statusColors } from "@/lib/ticketStyles";
import { Ticket, PagedResponse } from "@/types/ticket";

type DashboardClientProps = {
    initialData: PagedResponse<Ticket> | null;
};


// const sleep = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));


// const PRIORITY_ORDER: Record<string, number> = {
//     Urgent: 0,
//     High: 1,
//     Medium: 2,
//     Low: 3,
//     Unclassified: 4,
// };

const PAGE_SIZE = 20;

function DashboardClient({ initialData }: DashboardClientProps) {

    const [query, setQuery] = useState({
        statusFilter: "",
        priorityFilter: "",
        categoryFilter: "",
        page: 1,
    });

    const [tickets, setTickets] = useState<Ticket[]>(initialData?.items ?? []);
    const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 1);
    const [totalCount, setTotalCount] = useState(initialData?.totalCount ?? 0);

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (initialData) return;
        }
        fetchTickets();
    }, [query]);

    async function fetchTickets() {
        setIsLoading(true);
        setError(null);


        // await sleep(3000);

        try {

            const params = new URLSearchParams();

            if (query.statusFilter) params.set("status", query.statusFilter);
            if (query.priorityFilter) params.set("priority", query.priorityFilter);
            if (query.categoryFilter) params.set("category", query.categoryFilter);
            params.set("page", String(query.page));
            params.set("pageSize", String(PAGE_SIZE));

            const response = await fetch(`/api/tickets?${params}`);

            if (response.status === 401) {
                router.push("/login");
                return;
            }

            if (!response.ok) {
                setError("Failed to load tickets.");
                return;
            }

            const data: PagedResponse<Ticket> = await response.json();
            setTickets(data.items);
            setTotalPages(data.totalPages);
            setTotalCount(data.totalCount);
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

    const hasFilters = query.statusFilter || query.priorityFilter || query.categoryFilter;

    function getPageNumbers(): (number | "…")[] {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | "…")[] = [1];
        if (query.page > 3) pages.push("…");
        const start = Math.max(2, query.page - 1);
        const end = Math.min(totalPages - 1, query.page + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (query.page < totalPages - 2) pages.push("…");
        pages.push(totalPages);
        return pages;
    }

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

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <select
                        value={query.statusFilter}
                        onChange={(e) => setQuery(prev => ({ ...prev, statusFilter: e.target.value, page: 1 }))}
                        className="rounded-md border px-3 py-2 text-sm bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>

                    <select
                        value={query.priorityFilter}
                        onChange={(e) => setQuery(prev => ({ ...prev, priorityFilter: e.target.value, page: 1 }))}
                        className="rounded-md border px-3 py-2 text-sm bg-white"
                    >
                        <option value="">All Priorities</option>
                        <option value="Urgent">Urgent</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <select
                        value={query.categoryFilter}
                        onChange={(e) => setQuery(prev => ({ ...prev, categoryFilter: e.target.value, page: 1 }))}
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
                            onClick={() => setQuery({ statusFilter: "", priorityFilter: "", categoryFilter: "", page: 1 })}
                            className="text-red-600 hover:bg-red-50 hover:text-red-600"
                        >
                            Clear filters
                        </Button>
                    )}
                </div>

                {/* Ticket count */}
                {!isLoading && !error && (
                    <p className="text-sm text-muted-foreground mb-4">
                        {totalCount} {totalCount === 1 ? "ticket" : "tickets"} found
                        {totalPages > 1 && ` — page ${query.page} of ${totalPages}`}
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
                    <div className="rounded-lg border [&>div]:max-h-[70vh]">
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="hidden sm:table-cell">Customer</TableHead>
                                    <TableHead className="hidden md:table-cell">Category</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead className="hidden md:table-cell">Sentiment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow
                                        key={ticket.id}
                                        onClick={() => router.push(`/dashboard/${ticket.id}`)}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors even:bg-muted/20"
                                    >
                                        <TableCell className="text-muted-foreground">
                                            {ticket.id}
                                        </TableCell>
                                        <TableCell className="font-medium max-w-50 truncate">
                                            {ticket.subject}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground max-w-37.5 truncate">
                                            {ticket.customerName}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
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
                                        <TableCell className="hidden md:table-cell">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${sentimentColors[ticket.sentiment ?? "Unclassified"]
                                                    }`}
                                            >
                                                {ticket.sentiment ?? "—"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status] ?? "bg-gray-100 text-gray-600"}`}
                                            >
                                                {ticket.status === "InProgress" ? "In Progress" : ticket.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-muted-foreground whitespace-nowrap">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {!isLoading && !error && tickets.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-4">No tickets found.</p>
                )}

                {/*pagination */}
                {!isLoading && !error && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuery(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={query.page === 1}
                        >
                            ←
                            <span className="hidden sm:block"> Previous</span>

                        </Button>

                        {getPageNumbers().map((p, i) =>
                            p === "…" ? (
                                <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground select-none">
                                    …
                                </span>
                            ) : (
                                <Button
                                    key={p}
                                    variant={p === query.page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setQuery(prev => ({ ...prev, page: p }))}
                                    className="min-w-9"
                                >
                                    {p}
                                </Button>
                            )
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuery(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={query.page === totalPages}
                        >
                            →
                            <span className="hidden sm:block"> Next</span>

                        </Button>
                    </div>
                )}

            </div>


        </main>
    )



}

export default DashboardClient