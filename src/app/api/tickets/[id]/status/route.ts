import { NextResponse } from "next/server";
import { getAuthHeader } from "../../../../../../lib/server-auth";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const response = await fetch(
            `${process.env.BACKEND_URL}/api/tickets/${id}/status`,
            {
                method: "PATCH",
                headers: await getAuthHeader(),
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json(
            { message: "Could not reach the server." },
            { status: 500 }
        );
    }
}