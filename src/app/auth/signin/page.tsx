import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SigninForm } from '@/components/signin-form';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export default async function SignIn() {
    const session = await auth();

    if (session) {
        if (session.user.role.includes(Role.ADMIN)) {
            redirect('/admin/dashboard');
        } else if (session.user.role.includes(Role.USER)) {
            redirect('/user/dashboard');
        }
    }

    return (
        <div className="grid min-h-screen place-items-center">
            <Card className="w-full max-w-lg overflow-hidden p-0">
                <CardContent className="p-0">
                    <div className="flex flex-col gap-6 p-6 md:p-8">
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-2xl font-bold">Welcome Back</h1>
                            <p className="text-muted-foreground text-balance">
                                Sign in to your account to continue.
                            </p>
                        </div>

                        <Suspense
                            fallback={
                                <div className="animate-pulse">Loading...</div>
                            }
                        >
                            <SigninForm />
                        </Suspense>

                        <div className="text-center text-sm">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/auth/signup"
                                className="underline underline-offset-4"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary mt-2 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{' '}
                <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
