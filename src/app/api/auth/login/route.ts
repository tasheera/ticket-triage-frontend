import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const backendResponse = await fetch(
            `${process.env.BACKEND_URL}/api/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );

        if (!backendResponse.ok) {
            const problem = await backendResponse.json();
            return NextResponse.json(
                { message: problem.detail ?? "Invalid credentials" },
                { status: backendResponse.status }
            );
        }

        const data = await backendResponse.json();


        const cookieStore = await cookies();
        cookieStore.set("auth-token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
            path: "/"
        });

        return NextResponse.json({
            name: data.name,
            email: data.email,
            role: data.role,
        });

    } catch {
        return NextResponse.json(
            { message: "Could not reach the server" },
            { status: 500 }
        );
    }
}
