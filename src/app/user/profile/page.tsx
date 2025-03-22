'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateProfile } from '@/actions/update-profile';
import { changePassword } from '@/actions/change-password';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FiLoader } from 'react-icons/fi';
import { useFormStatus } from 'react-dom';

// Submit Buttons as Client Components
function UpdateProfileButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={pending}
        >
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Updating...
                </span>
            ) : (
                'Update Profile'
            )}
        </Button>
    );
}

function ChangePasswordButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={pending}
        >
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Changing Password...
                </span>
            ) : (
                'Change Password'
            )}
        </Button>
    );
}

interface ValidationError {
    code: string;
    minimum?: number;
    type: string;
    inclusive?: boolean;
    exact?: boolean;
    message: string;
    path: string[];
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [feedback, setFeedback] = useState({
        name: '',
        email: '',
        studentId: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    async function clientUpdateProfile(formData: FormData) {
        // Reset feedback
        setFeedback(prev => ({
            ...prev,
            name: '',
            email: '',
            studentId: '',
        }));

        const result = await updateProfile(formData);

        if (!result.success) {
            // Set specific feedback based on error message
            if (result.message.includes('Email')) {
                setFeedback(prev => ({ ...prev, email: result.message }));
            } else if (result.message.includes('Student ID')) {
                setFeedback(prev => ({ ...prev, studentId: result.message }));
            } else if (result.message.includes('Name')) {
                setFeedback(prev => ({ ...prev, name: result.message }));
            }
            toast.error(result.message);
        } else {
            toast.success(
                'Profile updated successfully. You will be signed out to apply the changes.'
            );
            // Refresh the session to update the UI
            router.refresh();
            setTimeout(async () => {
                await signOut({ redirect: false });
            }, 1000);
        }
    }

    async function clientChangePassword(formData: FormData) {
        // Reset feedback
        setFeedback(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        }));

        const result = await changePassword(formData);

        if (!result.success) {
            try {
                // Try to parse the error message as JSON
                const errors = JSON.parse(result.message) as ValidationError[];
                errors.forEach(error => {
                    const field = error.path[0];
                    switch (field) {
                        case 'currentPassword':
                            setFeedback(prev => ({
                                ...prev,
                                currentPassword: error.message,
                            }));
                            break;
                        case 'newPassword':
                            setFeedback(prev => ({
                                ...prev,
                                newPassword: error.message,
                            }));
                            break;
                        case 'confirmPassword':
                            setFeedback(prev => ({
                                ...prev,
                                confirmPassword: error.message,
                            }));
                            break;
                    }
                });
                // Show the first error in the toast
                toast.error(errors[0].message);
            } catch {
                // If not JSON, handle as regular message
                if (result.message.includes('Current password')) {
                    setFeedback(prev => ({
                        ...prev,
                        currentPassword: result.message,
                    }));
                } else if (result.message.includes('match')) {
                    setFeedback(prev => ({
                        ...prev,
                        confirmPassword: result.message,
                    }));
                } else if (result.message.includes('least 8')) {
                    setFeedback(prev => ({
                        ...prev,
                        newPassword: result.message,
                    }));
                }
                toast.error(result.message);
            }
        } else {
            toast.success('Password changed successfully');
            // Clear password fields
            const form = document.getElementById(
                'password-form'
            ) as HTMLFormElement;
            if (form) form.reset();
        }
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={clientUpdateProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={session?.user?.name || ''}
                                placeholder="Enter your name"
                                required
                                className="bg-[#1F2937] text-white"
                            />
                            {feedback.name && (
                                <p className="text-sm text-red-500">
                                    {feedback.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={session?.user?.email || ''}
                                placeholder="Enter your email"
                                className="bg-[#1F2937] text-white"
                            />
                            {feedback.email && (
                                <p className="text-sm text-red-500">
                                    {feedback.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="studentId">Student ID</Label>
                            <Input
                                id="studentId"
                                name="studentId"
                                defaultValue={session?.user?.studentId || ''}
                                placeholder="Enter your student ID"
                                className="bg-[#1F2937] text-white"
                            />
                            {feedback.studentId && (
                                <p className="text-sm text-red-500">
                                    {feedback.studentId}
                                </p>
                            )}
                        </div>

                        <UpdateProfileButton />
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        id="password-form"
                        action={clientChangePassword}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">
                                Current Password
                            </Label>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                placeholder="Enter your current password"
                                required
                                className="bg-[#1F2937] text-white"
                            />
                            {feedback.currentPassword && (
                                <p className="text-sm text-red-500">
                                    {feedback.currentPassword}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder="Enter your new password"
                                required
                                className="bg-[#1F2937] text-white"
                            />
                            {feedback.newPassword && (
                                <p className="text-sm text-red-500">
                                    {feedback.newPassword}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm New Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your new password"
                                required
                                className="bg-[#1F2937] text-white"
                            />
                            {feedback.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {feedback.confirmPassword}
                                </p>
                            )}
                        </div>

                        <ChangePasswordButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
