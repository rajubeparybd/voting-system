'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signUp } from '@/actions/signup';

interface SignupError extends Error {
    message: string;
}

export function SignupForm({ className }: React.ComponentProps<'div'>) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);

            const form = e.currentTarget;
            const formData = new FormData(form);

            const res = await signUp(formData);

            if (!res.success) {
                setError(res.message || 'Failed to sign up. Please try again.');
                return;
            }

            setSuccess('Account created successfully! Redirecting to login...');
            form.reset();
            setError(null);

            setTimeout(() => {
                router.push('/auth/signin');
            }, 2000);
        } catch (error) {
            console.error('Sign up error:', error);
            const signupError = error as SignupError;
            setError(
                signupError.message ||
                    'An unexpected error occurred. Please try again later.'
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={cn('flex flex-col gap-6', className)}
        >
            {error && (
                <Alert
                    variant="destructive"
                    className="animate-in fade-in slide-in-from-top-1"
                >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert
                    variant="default"
                    className="animate-in fade-in slide-in-from-top-1 border-green-500/50 text-green-500"
                >
                    <CheckCircle2 className="h-4 w-4 !text-green-500" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    disabled={isLoading}
                    className="transition-opacity duration-200"
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                />
            </div>

            <div className="grid gap-3">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                    id="studentId"
                    name="studentId"
                    type="number"
                    placeholder="22234103301"
                    required
                    disabled={isLoading}
                    className="transition-opacity duration-200"
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                />
            </div>

            <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    disabled={isLoading}
                    className="transition-opacity duration-200"
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                />
            </div>

            <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="*** ***"
                    required
                    disabled={isLoading}
                    className="transition-opacity duration-200"
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                variant="default"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing Up...
                    </>
                ) : (
                    'Sign Up'
                )}
            </Button>
        </form>
    );
}
