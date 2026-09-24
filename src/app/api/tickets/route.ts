import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAuthHeader } from "../../../../lib/server-auth";

const TICKETS_CACHE_SECONDS = 60 * 60;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const params = new URLSearchParams();

        const status = searchParams.get("status");
        const priority = searchParams.get("priority");
        const category = searchParams.get("category");
        const page = searchParams.get("page");
        const pageSize = searchParams.get("pageSize");

        if (status) params.set("status", status);
        if (priority) params.set("priority", priority);
        if (category) params.set("category", category);
        if (page) params.set("page", page);
        if (pageSize) params.set("pageSize", pageSize);

        const queryString = params.toString();
        const url = `${process.env.BACKEND_URL}/api/tickets${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
            headers: await getAuthHeader(),
            next: {
                revalidate: TICKETS_CACHE_SECONDS,
                tags: ["tickets"],
            },
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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await fetch(`${process.env.BACKEND_URL}/api/tickets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
            revalidateTag("tickets", { expire: 0 });
        }

        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json(
            { message: "Could not reach the server." },
            { status: 500 }
        );
    }
}