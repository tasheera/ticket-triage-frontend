"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function LoginForm() {
    const [loginEmail, setLoginEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string | null>(null)

    const router = useRouter();

    function validate() {
        const newErrors: Record<string, string> = {};
        const loginEmailInput = document.getElementById('loginEmail') as HTMLInputElement;
        if (!loginEmail.trim() || !loginEmailInput.checkValidity()) {
            newErrors.loginEmail = "Email is required";
        }

        if (password.length === 0) {
            newErrors.password = "Password is required";
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;

    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate()) { return }
        setSubmitError(null);
        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loginEmail,
                    password: password
                })
            });

            if (!response.ok) {
                const data = await response.json();
                setSubmitError(data.message ?? "Invalid credentials")
                return;
            }

            router.push("/dashboard");
            router.refresh();

        } catch {
            setSubmitError("Could not reach the server. Try again.")
        } finally {
            setIsSubmitting(false);
        }
    }



    return (
        <main className='flex items-center justify-center min-h-screen py-8 sm:py-12 m-3 sm:m-0'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle className='text-lg sm:text-2xl'>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='loginEmail'>Email Address</Label>
                            <div>
                                <Input
                                    id="loginEmail"
                                    name="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    type="email"
                                    autoComplete="username"
                                    required
                                    aria-invalid={!!error.loginEmail}
                                    aria-describedby={error.loginEmail ? "login-email-error" : undefined}
                                />
                                <div className='min-h-5'>
                                    {error.loginEmail && (
                                        <p id="login-email-error" className='text-sm text-red-600'>
                                            {error.loginEmail}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                autoComplete="current-password"
                                required
                                aria-invalid={!!error.password}
                                aria-describedby={error.password ? "password-error" : undefined}
                            />
                            <div className='min-h-5'>
                                {error.password && (
                                    <p id="password-error" className='text-sm text-red-600'>
                                        {error.password}
                                    </p>
                                )}
                            </div>

                        </div>

                        <Button type='submit' disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>

                        {submitError && (
                            <p
                                role="alert"
                                aria-live="polite"
                                className="text-sm text-red-600"
                            >
                                {submitError}
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}
