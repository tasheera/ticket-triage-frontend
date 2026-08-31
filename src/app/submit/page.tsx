"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'

type Props = {}

function SubmitPage({}: Props) {
  const [customerName, setCustomerName] = useState("");

  return (
    <div className='flex min-h-screen justify-center px-4 py-12'>
      <Card className='w-full max-w-md'>
        <CardHeader >
          <CardTitle>Submit a Ticket</CardTitle>
        </CardHeader>
        <CardContent >
          <form  className='space-y-24'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor="customerName">Name</Label>
              <Input id='customerName' value={customerName} onChange={(e) => setCustomerName(e.target.value)}></Input>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SubmitPage 