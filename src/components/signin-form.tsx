'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SigninForm({ className }: React.ComponentProps<'div'>) {
    const router = useRouter();
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

            const result = await signIn('credentials', {
                studentId,
                password,
                redirect: false,
            });

            if (result?.error) {
                console.error('Sign in failed:', result.error);
                setError(
                    result?.code === 'credentials'
                        ? 'Invalid student ID or password'
                        : 'Failed to sign in. Please try again.'
                );
                return;
            }

            // Check user role and redirect accordingly
            const response = await fetch('/api/auth/session');
            const session = await response.json();

            if (session?.user?.role?.includes('ADMIN')) {
                router.push('/admin/dashboard');
            } else {
                router.push('/user/dashboard');
            }
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
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="#"
                        className="text-muted-foreground hover:text-primary ml-auto text-sm underline-offset-4 hover:underline"
                        tabIndex={isLoading ? -1 : 0}
                    >
                        Forgot your password?
                    </Link>
                </div>
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
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </Button>
        </form>
    );
}
