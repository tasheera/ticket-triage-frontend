"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {}

function SubmitPage({ }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSucess, setIsSucess] = useState(false)

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = "Name is required";
    const emailInput = document.getElementById('customerEmail') as HTMLInputElement;
    if (!emailInput.checkValidity() || !customerEmail.trim()) {
      newErrors.customerEmail = "Enter a valid email";
    }
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;

  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, customerEmail, subject, description })
      });

      if (!response.ok) {
        const problem = await response.json();

        if (response.status === 429) {
          setSubmitError("Too many submissions. Please wait a minute before trying again.");
          return;
        }
        setSubmitError(problem.detail ?? "Something went wrong, please try again")
        return;
      }

      setIsSucess(true);

    } catch {
      setSubmitError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }

  }

  if (isSucess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-3xl">
          ✓
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Ticket Submitted!</h1>
        <p className="text-muted-foreground max-w-sm">
          We've received your request and will get back to you as soon as possible
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Home
        </Link>
      </main>
    );
  }


  return (
    <div className='flex flex-col items-center min-h-screen justify-center px-4 py-8 sm:py-12 gap-6'>

      <div className='flex flex-col items-center text-center gap-2 max-w-md w-full'>
        <Link href='/' className='flex items-center gap-2 mb-1 group'>
          <img
            src="/icon.svg"
            alt="AI ticket"
            className="h-10 w-10"
          />
          <span className='text-lg font-bold tracking-tight group-hover:opacity-80 transition-opacity'>
            AI Ticket Triage
          </span>
        </Link>

        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Submit a Support Ticket</h1>

        <p className='text-sm text-muted-foreground'>
          Fill out the form below and our team will review your request as soon as possible.
        </p>

        <span className='inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground'>
          <span className='h-1.5 w-1.5 rounded-full bg-green-500'></span>
          Typical response time: under 2 hours
        </span>
      </div>

      <Card className='w-full max-w-md'>
        <CardContent >
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor="customerName">Name</Label>
              <div>
                <Input id='customerName' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <div className='min-h-5'>

                  {error.customerName && <p className='text-sm text-red-600'> {error.customerName}</p>}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='customerEmail'>Email</Label>
              <div>
                <Input id='customerEmail' value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} type='email' />
                <div className='min-h-5'>

                  {error.customerEmail && <p className='text-sm text-red-600'> {error.customerEmail}</p>}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='subject' >Subject</Label>
              <div>
                <Input id='subject' value={subject} onChange={(e) => setSubject(e.target.value)} />
                <div className='min-h-5'>

                  {error.subject && <p className='text-sm text-red-600'> {error.subject}</p>}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='description' >Description</Label>
              <div>
                <Textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
                <div className='min-h-5'>

                  {error.description && <p className="text-sm text-red-600 mt-1">{error.description}</p>}
                </div>
              </div>
            </div>

            {submitError && (
              <p className="text-sm text-red-600">{submitError}</p>
            )}


            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SubmitPage 