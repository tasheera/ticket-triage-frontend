import { cookies } from "next/headers";

export async function getAuthHeader() {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
        return null;
    }

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    }
}