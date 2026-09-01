"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { error } from 'console'
import React, { use, useState } from 'react'

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
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Ticket received</h1>
        <p className="text-muted-foreground">We'll get back to you as soon as possible.</p>
      </main>
    );
  }


  return (
    <div className='flex min-h-screen justify-center px-4 py-8 sm:py-12'>
      <Card className='w-full max-w-md'>
        <CardHeader >
          <CardTitle className='text-lg sm:text-xl font-bold'>Submit a Ticket</CardTitle>
        </CardHeader>
        <CardContent >
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor="customerName">Name</Label>
              <div>
                <Input id='customerName' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <div className='min-h-[20px]'>

                  {error.customerName && <p className='text-sm text-red-600'> {error.customerName}</p>}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='customerEmail'>Email</Label>
              <div>
                <Input id='customerEmail' value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} type='email' />
                <div className='min-h-[20px]'>

                  {error.customerEmail && <p className='text-sm text-red-600'> {error.customerEmail}</p>}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='subject' >Subject</Label>
              <div>
                <Input id='subject' value={subject} onChange={(e) => setSubject(e.target.value)} />
                <div className='min-h-[20px]'>

                  {error.subject && <p className='text-sm text-red-600'> {error.subject}</p>}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='description' >Description</Label>
              <div>
                <Textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
                <div className='min-h-[20px]'>

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