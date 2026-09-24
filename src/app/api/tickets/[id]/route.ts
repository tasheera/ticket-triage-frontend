import { NextResponse } from "next/server";
import { getAuthHeader } from "../../../../../lib/server-auth";

const TICKETS_CACHE_SECONDS = 60 * 60;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const response = await fetch(
            `${process.env.BACKEND_URL}/api/tickets/${id}`,
            {
                headers: await getAuthHeader(),
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