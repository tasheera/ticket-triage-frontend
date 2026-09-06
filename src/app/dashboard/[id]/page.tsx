import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TicketDetailClient from './TicketDetailClient';

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

    return <TicketDetailClient id={id} />;
}

export default TicketDetailPage