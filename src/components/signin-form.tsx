import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { signIn } from '@/actions/signin';

export async function SigninForm({ className }: React.ComponentProps<'div'>) {
    return (
        <form
            className={cn('flex flex-col gap-6', className)}
            action={async formData => {
                'use server';
                const res = await signIn(formData);
                if (res.success) {
                    redirect('/');
                }
            }}
        >
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
                />
            </div>
            <Button type="submit" className="w-full">
                Sign In
            </Button>
        </form>
    );
}
