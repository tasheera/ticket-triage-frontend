import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardClient from './DashboardClient';
import { PagedResponse, Ticket } from '@/types/ticket';

const PAGE_SIZE = 20;

async function Dashboard() {

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login")
  }

  let initialData: PagedResponse<Ticket> | null = null;

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/tickets?page=1&pageSize=${PAGE_SIZE}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 3600, tags: ["tickets"] },
      }
    );

    if (res.ok) {
      initialData = await res.json();
    }
  } catch {

  }

  return (
    <DashboardClient initialData={initialData} />
  )
}

export default Dashboard