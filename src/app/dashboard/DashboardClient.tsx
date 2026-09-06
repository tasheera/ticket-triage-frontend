"use client"

import { Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { json } from 'stream/consumers';


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
    }, []);

    async function fetchTickets() {


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
        }

    }

    return (
        <div>
            {tickets.map((ticket) => {
                return <p key={ticket.id}>{ticket.customerName}</p>
            })}
        </div>
    )



}

export default DashboardClient