import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import { signUp } from '@/actions/signup';
import { cn } from '@/lib/utils';

export async function SignupForm({ className }: React.ComponentProps<'div'>) {
    return (
        <form
            className={cn('flex flex-col gap-6', className)}
            action={async formData => {
                'use server';
                const res = await signUp(formData);
                if (res.success) {
                    redirect('/auth/signin');
                }
            }}
        >
            <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="name"
                    placeholder="Jhon Doe"
                    required
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
                />
            </div>

            <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jhon@example.com"
                    required
                />
            </div>
            <div className="grid gap-3">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                </div>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="*** ***"
                    required
                />
            </div>
            <Button type="submit" className="w-full">
                Sign Up
            </Button>
        </form>
    );
}
