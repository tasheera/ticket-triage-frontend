import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TicketDetailClient from './TicketDetailClient';
import { Ticket } from "@/types/ticket";

async function TicketDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
        redirect("/login");
    }

    let initialTicket: Ticket | null = null;

    try {
        const res = await fetch(
            `${process.env.BACKEND_URL}/api/tickets/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                next: { revalidate: 3600, tags: ["tickets", `ticket-${id}`] },
            }
        );

        if (res.ok) {
            initialTicket = await res.json();
        }
    } catch(err) {
        console.error(`[TicketDetailPage] Failed to fetch ticket ${id}:`, err);


    }

    return <TicketDetailClient id={id} initialTicket={initialTicket} />;
}

export default TicketDetailPage