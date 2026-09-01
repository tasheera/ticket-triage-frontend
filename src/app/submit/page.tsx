"use client"

import { Button } from '@/components/ui/button'
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
  const [error, setError] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = "Name is required";
    const emailInput = document.getElementById('customerEmail') as HTMLInputElement;
    if (!emailInput.checkValidity()) {
      newErrors.customerEmail = "Enter a valid email";
    }
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;

  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    //api
  }
  return (
    <div className='flex min-h-screen justify-center px-4 py-12'>
      <Card className='w-full max-w-md'>
        <CardHeader >
          <CardTitle className='bold font-bold'>Submit a Ticket</CardTitle>
        </CardHeader>
        <CardContent >
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor="customerName">Name</Label>
              <Input id='customerName' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              {error.customerName && <p className='text-sm text-red-600'> {error.customerName}</p>}
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='customerEmail'>Email</Label>
              <Input id='customerEmail' value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} type='email' />
              {error.customerEmail && <p className='text-sm text-red-600'> {error.customerEmail}</p>}
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='subject' >Subject</Label>
              <Input id='subject' value={subject} onChange={(e) => setSubject(e.target.value)} />
              {error.subject && <p className='text-sm text-red-600'> {error.subject}</p>}
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='description' >Description</Label>
              <Textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
              {error.description && <p className="text-sm text-red-600 mt-1">{error.description}</p>}
            </div>
            <Button type='submit' className="w-full"> Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SubmitPage 