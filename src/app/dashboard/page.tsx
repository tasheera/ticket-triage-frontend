import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardClient from './DashboardClient';

async function Dashboard() {

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if(!token){
    redirect("/login")
  }
  return (
    <DashboardClient />
  )
}

export default Dashboard