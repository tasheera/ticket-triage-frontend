"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { error } from 'console'
import React, { useState } from 'react'

type Props = {}

function SubmitPage({ }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");


  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    //api
  }
  return (
    <div className='flex min-h-screen justify-center px-4 py-12'>
      <Card className='w-full max-w-md'>
        <CardHeader >
          <CardTitle className='bold font-bold'>Submit a Ticket</CardTitle>
        </CardHeader>
        <CardContent >
          <form className='space-y-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor="customerName">Name</Label>
              <Input id='customerName' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='customerEmail'>Email</Label>
              <Input id='customerEmail' value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} type='email' />

            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='subject' >Subject</Label>
              <Input id='subject' value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='description' >Description</Label>
              <Textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SubmitPage 