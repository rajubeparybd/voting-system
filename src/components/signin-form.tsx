'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function SigninForm({ className }: React.ComponentProps<'div'>) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(formData: FormData) {
        try {
            setIsLoading(true);
            setError(null);

            const studentId = formData.get('studentId') as string;
            const password = formData.get('password') as string;

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

            router.refresh();
            router.push('/auth/signin');
        } catch (error) {
            console.error('Sign in error:', error);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            action={onSubmit}
            className={cn('flex flex-col gap-6', className)}
        >
            {error && <div className="text-sm text-red-500">{error}</div>}
            <div className="grid gap-3">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                    id="studentId"
                    name="studentId"
                    type="number"
                    placeholder="22234103301"
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="grid gap-3">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
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
                />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
        </form>
    );
}
