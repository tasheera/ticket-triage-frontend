import { NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/server/server-auth";

const TICKETS_CACHE_SECONDS = 60 * 60;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const authHeader = await getAuthHeader();

        if (!authHeader) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = await fetch(
            `${process.env.BACKEND_URL}/api/tickets/${id}`,
            {
                headers: authHeader,
                next: {
                    revalidate: TICKETS_CACHE_SECONDS,
                    tags: ["tickets", `ticket-${id}`],
                },
            }
        );

        const data = await response.json();
        return NextResponse.json(
            data,
            { status: response.status }
        );


    } catch {
        return NextResponse.json(
            { message: "Could not reach the server" },
            { status: 500 }
        );
    }

}