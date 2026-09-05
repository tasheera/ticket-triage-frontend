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
            setTickets(data)
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