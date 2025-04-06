'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FiLoader } from 'react-icons/fi';

export function SigninForm({ className }: React.ComponentProps<'div'>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError(null);

            const form = e.currentTarget;
            const formData = new FormData(form);
            const studentId = formData.get('studentId') as string;
            const password = formData.get('password') as string;

            if (!studentId || !password) {
                setError('Please fill in all fields');
                return;
            }

            const callbackUrl =
                searchParams.get('callbackUrl') || '/user/dashboard';

            const result = await signIn('credentials', {
                studentId,
                password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                setError(
                    result.error === 'CredentialsSignin'
                        ? 'Invalid student ID or password'
                        : 'Failed to sign in. Please try again.'
                );
                return;
            }

            // Successful sign-in - redirect to callback URL or default route
            router.push(callbackUrl);
            router.refresh();
        } catch (error) {
            console.error('Sign in error:', error);
            setError('An unexpected error occurred. Please try again later.');
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

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                        id="studentId"
                        name="studentId"
                        type="text"
                        placeholder="Enter your student ID"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </Button>
        </form>
    );
}
