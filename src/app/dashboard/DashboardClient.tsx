"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowDownWideNarrow,
    ArrowUpRight,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Circle,
    CircleAlert,
    Clock3,
    Flag,
    Inbox,
    LogOut,
    SlidersHorizontal,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { priorityColors, statusColors } from "@/lib/ticketStyles";
import { Ticket, PagedResponse } from "@/types/ticket";

type DashboardClientProps = {
    initialData: PagedResponse<Ticket> | null;
};

const PAGE_SIZE = 20;

const QUEUES = [
    { value: "", label: "All tickets", icon: Inbox },
    { value: "Open", label: "Open", icon: Circle },
    { value: "InProgress", label: "In progress", icon: Clock3 },
    { value: "Resolved", label: "Resolved", icon: Check },
];

function Priority({ value }: { value: string | null }) {
    const priority = value ?? "Unclassified";
    const Icon = priority === "Urgent" ? CircleAlert : Flag;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
            priorityColors[priority] ?? priorityColors.Unclassified,
        )}>
            <Icon aria-hidden="true" className="size-3.5 shrink-0" />
            {priority}
        </span>
    );
}

function Status({ value }: { value: string }) {
    const Icon = value === "Resolved" ? Check : value === "InProgress" ? Clock3 : Circle;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
            statusColors[value] ?? statusColors.Open,
        )}>
            <Icon aria-hidden="true" className="hidden size-3 shrink-0 sm:block" />
            {value === "InProgress" ? "In progress" : value}
        </span>
    );
}

export default function DashboardClient({ initialData }: DashboardClientProps) {

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

    const firstItem = totalCount === 0 ? 0 : (query.page - 1) * PAGE_SIZE + 1;
    const lastItem = Math.min(query.page * PAGE_SIZE, totalCount);
    const selectClassName = "h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm text-slate-700 transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";

    return (
        <main className="min-h-screen bg-slate-50/70 text-slate-900">
            <header className="border-b border-slate-200/80 bg-white">
                <div className="mx-auto flex h-17 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8 lg:px-10">
                    <Link href="/" className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <Inbox aria-hidden="true" className="size-4.5" />
                        </span>
                        <span className="text-sm font-semibold tracking-tight">AI Ticket Triage</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="hidden border-r border-slate-200 pr-4 text-xs text-slate-500 sm:block">Agent workspace</span>
                        <Button variant="ghost" onClick={handleLogout} className="text-slate-600">
                            <LogOut aria-hidden="true" />
                            Sign out
                        </Button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-10 lg:px-10">
                <div className="mb-7 sm:mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Support inbox</h1>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Review, prioritize, and resolve customer requests.</p>
                </div>

                <section aria-label="Support tickets" aria-busy={isLoading} className="scroll-mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
                    <nav aria-label="Ticket status" className="flex overflow-x-auto border-b border-slate-200 px-2 sm:px-5">
                        {QUEUES.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={query.statusFilter === value}
                                onClick={() => setQuery(prev => ({ ...prev, statusFilter: value, page: 1 }))}
                                className={cn(
                                    "relative flex shrink-0 items-center gap-2 px-3 py-4 text-[13px] font-medium transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 max-[360px]:flex-1 max-[360px]:justify-center max-[360px]:px-1 max-[360px]:text-[11px] max-[360px]:whitespace-nowrap sm:px-4 sm:text-sm",
                                    query.statusFilter === value
                                        ? "text-indigo-700 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-t-full after:bg-indigo-600"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                                )}
                            >
                                <Icon aria-hidden="true" className="hidden size-4 sm:block" />
                                {label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-slate-100 px-4 py-4 sm:px-6">
                        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
                            <SlidersHorizontal aria-hidden="true" className="hidden size-4 text-slate-400 sm:block" />
                            <div className="relative min-w-0 flex-1 max-[360px]:basis-full sm:w-40 sm:flex-none">
                                <select aria-label="Filter by priority" value={query.priorityFilter} onChange={event => setQuery(prev => ({ ...prev, priorityFilter: event.target.value, page: 1 }))} className={selectClassName}>
                                    <option value="">All priorities</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-3 size-3.5 text-slate-400" />
                            </div>
                            <div className="relative min-w-0 flex-1 max-[360px]:basis-full sm:w-44 sm:flex-none">
                                <select aria-label="Filter by category" value={query.categoryFilter} onChange={event => setQuery(prev => ({ ...prev, categoryFilter: event.target.value, page: 1 }))} className={selectClassName}>
                                    <option value="">All categories</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Billing">Billing</option>
                                    <option value="Account">Account</option>
                                    <option value="General">General</option>
                                </select>
                                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-3 size-3.5 text-slate-400" />
                            </div>
                            {hasFilters && (
                                <Button variant="ghost" onClick={() => setQuery({ statusFilter: "", priorityFilter: "", categoryFilter: "", page: 1 })} className="h-9 text-xs text-slate-500 max-sm:basis-full max-sm:justify-start">
                                    <X aria-hidden="true" className="size-3.5" />
                                    Clear filters
                                </Button>
                            )}
                        </div>
                        <span className="hidden items-center gap-1.5 text-xs text-slate-500 lg:inline-flex">
                            <ArrowDownWideNarrow aria-hidden="true" className="size-3.5" />
                            Newest first
                        </span>
                    </div>

                    {error ? (
                        <div role="alert" className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center">
                            <CircleAlert aria-hidden="true" className="size-7 text-red-500" />
                            <p className="text-sm text-slate-600">{error}</p>
                        </div>
                    ) : !isLoading && tickets.length === 0 ? (
                        <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                            <span className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400"><Inbox aria-hidden="true" className="size-7" /></span>
                            <h2 className="text-base font-semibold">{hasFilters ? "No matching tickets" : "Your inbox is clear"}</h2>
                            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">{hasFilters ? "Try a different priority or category, or clear your filters to see all tickets." : "New customer requests will appear here, ready for your team to review."}</p>
                            {hasFilters && <Button variant="outline" className="mt-5" onClick={() => setQuery({ statusFilter: "", priorityFilter: "", categoryFilter: "", page: 1 })}>Clear filters</Button>}
                        </div>
                    ) : (
                        <Table className="table-fixed">
                            <TableHeader className="bg-slate-50/80">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="h-11 pl-4 text-xs font-medium text-slate-500 sm:pl-6">Ticket</TableHead>
                                    <TableHead className="h-11 w-22 text-xs font-medium text-slate-500 max-[360px]:hidden sm:w-30">Priority</TableHead>
                                    <TableHead className="h-11 w-27 pr-4 text-xs font-medium text-slate-500 sm:w-36 sm:pr-2">Status</TableHead>
                                    <TableHead className="hidden h-11 w-32 text-xs font-medium text-slate-500 md:table-cell">Category</TableHead>
                                    <TableHead className="hidden h-11 w-38 pr-6 text-xs font-medium text-slate-500 lg:table-cell">Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? Array.from({ length: tickets.length || 6 }, (_, index) => (
                                    <TableRow key={index} aria-hidden="true" className="border-slate-100">
                                        <TableCell className="py-5 pl-4 sm:pl-6"><div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-100" /><div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-slate-100" /></TableCell>
                                        <TableCell className="max-[360px]:hidden"><div className="h-5 w-14 animate-pulse rounded bg-slate-100" /></TableCell>
                                        <TableCell><div className="h-5 w-18 animate-pulse rounded bg-slate-100" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><div className="h-3 w-18 animate-pulse rounded bg-slate-100" /></TableCell>
                                        <TableCell className="hidden lg:table-cell"><div className="h-3 w-24 animate-pulse rounded bg-slate-100" /></TableCell>
                                    </TableRow>
                                )) : tickets.map(ticket => (
                                    <TableRow key={ticket.id} className="group relative border-slate-100 transition-colors hover:bg-slate-50/80">
                                        <TableCell className="whitespace-normal py-4 pl-4 sm:pl-6">
                                            <Link href={`/dashboard/${ticket.id}`} className="text-sm font-medium leading-5 text-slate-800 outline-none after:absolute after:inset-0 after:z-10 focus-visible:after:rounded focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-indigo-500 group-hover:text-indigo-700">
                                                <span className="line-clamp-2 wrap-anywhere sm:line-clamp-1">{ticket.subject}</span>
                                            </Link>
                                            <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                                                <span className="shrink-0 text-slate-500">#{ticket.id}</span>
                                                <span aria-hidden="true" className="text-slate-300">·</span>
                                                <span className="truncate">{ticket.customerName}</span>
                                            </div>
                                            <div className="mt-2 hidden max-[360px]:block"><Priority value={ticket.priority} /></div>
                                        </TableCell>
                                        <TableCell className="px-0 max-[360px]:hidden sm:px-2"><Priority value={ticket.priority} /></TableCell>
                                        <TableCell className="pr-4 sm:pr-2"><Status value={ticket.status} /></TableCell>
                                        <TableCell className="hidden text-xs text-slate-500 md:table-cell"><span className="block truncate">{ticket.category ?? "Unclassified"}</span></TableCell>
                                        <TableCell className="hidden pr-6 text-xs text-slate-500 lg:table-cell">
                                            <div className="flex items-center justify-between gap-2">
                                                <time dateTime={ticket.createdAt}>{new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time>
                                                <ArrowUpRight aria-hidden="true" className="size-3.5 text-slate-300 transition-colors group-hover:text-indigo-600" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    <footer className="flex min-h-19 flex-col items-center justify-between gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:px-6">
                        <p role="status" className="text-xs text-slate-500">
                            {isLoading ? "Loading tickets…" : error ? "Tickets unavailable" : totalCount === 0 ? "No tickets to show" : <>Showing <span className="font-medium text-slate-700">{firstItem}–{lastItem}</span> of <span className="font-medium text-slate-700">{totalCount}</span> tickets</>}
                        </p>
                        {!isLoading && !error && totalPages > 1 && (
                            <nav aria-label="Ticket pages" className="flex items-center gap-1">
                                <Button variant="ghost" size="icon-sm" aria-label="Previous page" onClick={() => setQuery(prev => ({ ...prev, page: prev.page - 1 }))} disabled={query.page === 1} className="text-slate-500"><ChevronLeft aria-hidden="true" /></Button>
                                <span className="px-2 text-xs text-slate-500 sm:hidden">Page {query.page} of {totalPages}</span>
                                <div className="hidden items-center gap-1 sm:flex">
                                    {getPageNumbers().map((page, index) => page === "…" ? (
                                        <span key={`gap-${index}`} className="px-1 text-xs text-slate-500">…</span>
                                    ) : (
                                        <Button key={page} variant="ghost" size="icon-sm" aria-label={`Page ${page}`} aria-current={page === query.page ? "page" : undefined} onClick={() => setQuery(prev => ({ ...prev, page }))} className={cn("text-xs text-slate-500", page === query.page && "bg-indigo-50 font-semibold text-indigo-700 hover:bg-indigo-100")}>{page}</Button>
                                    ))}
                                </div>
                                <Button variant="ghost" size="icon-sm" aria-label="Next page" onClick={() => setQuery(prev => ({ ...prev, page: prev.page + 1 }))} disabled={query.page === totalPages} className="text-slate-500"><ChevronRight aria-hidden="true" /></Button>
                            </nav>
                        )}
                    </footer>
                </section>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs leading-5 text-slate-500">
                    <Inbox aria-hidden="true" className="size-3.5 shrink-0" />
                    Open a ticket to view its details and AI classification.
                </p>
            </div>
        </main>
    );
}
