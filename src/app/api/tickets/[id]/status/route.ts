import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAuthHeader } from "@/lib/server/server-auth";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const authHeader = await getAuthHeader();

        if (!authHeader) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const response = await fetch(
            `${process.env.BACKEND_URL}/api/tickets/${id}/status`,
            {
                method: "PATCH",
                headers: authHeader,
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();

        if (response.ok) {
            revalidateTag("tickets", { expire: 0 });
            revalidateTag(`ticket-${id}`, { expire: 0 });
        }

        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json(
            { message: "Could not reach the server." },
            { status: 500 }
        );
    }
}