import { NextResponse } from "next/server";
import { getAuthHeader } from "../../../../lib/server-auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const params = new URLSearchParams();

        const status = searchParams.get("status");
        const priority = searchParams.get("priority");
        const category = searchParams.get("category");

        if (status) params.set("status", status);
        if (priority) params.set("priority", priority);
        if (category) params.set("category", category);

        const queryString = params.toString();
        const url = `${process.env.BACKEND_URL}/api/tickets${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            headers: await getAuthHeader(),
            cache: "no-store",
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch(error) {
        console.error("GET /api/tickets failed:", error);
        return NextResponse.json(
            { message: "Could not reach the server." },
            { status: 500 }
        );
    }
}