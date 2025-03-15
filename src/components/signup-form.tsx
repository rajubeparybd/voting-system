'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signUp } from '@/actions/signup';
import { FiLoader } from 'react-icons/fi';
import { PasswordRequirements } from '@/components/ui/password-requirements';

interface SignupError extends Error {
    message: string;
}

interface ValidationError {
    validation?: string;
    code: string;
    message: string;
    path: string[];
}

export function SignupForm({ className }: React.ComponentProps<'div'>) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRequirements, setShowRequirements] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);
            setFieldErrors({});

            const form = e.currentTarget;
            const formData = new FormData(form);

            const res = await signUp(formData);

            if (!res.success) {
                try {
                    // Try to parse the error message as JSON
                    const errors = JSON.parse(res.message) as ValidationError[];
                    const newFieldErrors: Record<string, string> = {};

                    errors.forEach(error => {
                        const field = error.path[0];
                        newFieldErrors[field] = error.message;
                    });

                    setFieldErrors(newFieldErrors);
                    // Set the first error as the main error message
                    setError(errors[0].message);
                } catch {
                    // If parsing fails, use the message as is
                    setError(
                        res.message || 'Failed to sign up. Please try again.'
                    );
                }
                return;
            }

            setSuccess('Account created successfully! Redirecting to login...');
            form.reset();
            setError(null);
            setPassword('');
            setShowRequirements(false);
            setFieldErrors({});

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
                    className={cn(
                        'transition-opacity duration-200',
                        fieldErrors.name &&
                            'border-red-500 focus-visible:ring-red-500'
                    )}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                />
                {fieldErrors.name && (
                    <p className="text-sm text-red-500">{fieldErrors.name}</p>
                )}
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
                    className={cn(
                        'transition-opacity duration-200',
                        fieldErrors.studentId &&
                            'border-red-500 focus-visible:ring-red-500'
                    )}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                />
                {fieldErrors.studentId && (
                    <p className="text-sm text-red-500">
                        {fieldErrors.studentId}
                    </p>
                )}
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
                    className={cn(
                        'transition-opacity duration-200',
                        fieldErrors.email &&
                            'border-red-500 focus-visible:ring-red-500'
                    )}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                />
                {fieldErrors.email && (
                    <p className="text-sm text-red-500">{fieldErrors.email}</p>
                )}
            </div>

            <div className="grid gap-3">
                <Label htmlFor="department">Department</Label>
                <Input
                    id="department"
                    name="department"
                    type="text"
                    placeholder="Computer Science"
                    required
                    disabled={isLoading}
                    className={cn(
                        'transition-opacity duration-200',
                        fieldErrors.department &&
                            'border-red-500 focus-visible:ring-red-500'
                    )}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                />
                {fieldErrors.department && (
                    <p className="text-sm text-red-500">
                        {fieldErrors.department}
                    </p>
                )}
            </div>

            <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="*** ***"
                        required
                        disabled={isLoading}
                        className={cn(
                            'pr-10 transition-opacity duration-200',
                            fieldErrors.password &&
                                'border-red-500 focus-visible:ring-red-500'
                        )}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onBlur={() => {
                            setShowRequirements(
                                password.length > 0 &&
                                    (!/[A-Z]/.test(password) ||
                                        !/[a-z]/.test(password) ||
                                        !/[0-9]/.test(password) ||
                                        !/[^A-Za-z0-9]/.test(password) ||
                                        password.length < 8)
                            );
                        }}
                        style={{ opacity: isLoading ? 0.7 : 1 }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {fieldErrors.password && (
                    <p className="text-sm text-red-500">
                        {fieldErrors.password}
                    </p>
                )}
                <PasswordRequirements
                    password={password}
                    showRequirements={
                        showRequirements || Boolean(fieldErrors.password)
                    }
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
                        <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                        Signing Up...
                    </>
                ) : (
                    'Sign Up'
                )}
            </Button>
        </form>
    );
}
