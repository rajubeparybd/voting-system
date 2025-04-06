import { SignupForm } from '@/components/signup-form';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Role } from '@prisma/client';

const SignUp = async () => {
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
                            <h1 className="text-2xl font-bold">Sign Up</h1>
                            <p className="text-muted-foreground text-balance">
                                Create an account to get started
                            </p>
                        </div>

                        <SignupForm />

                        <div className="text-center text-sm">
                            Already have an account?{' '}
                            <Link
                                href="/auth/signin"
                                className="underline underline-offset-4"
                            >
                                Sign In
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
};

export default SignUp;
