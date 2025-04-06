import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { UserLayoutClient } from '@/components/user/UserLayoutClient';

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/auth/signin');
    }

    if (!session.user.role.includes(Role.USER)) {
        if (session.user.role.includes(Role.ADMIN)) {
            redirect('/admin/dashboard');
        }
        redirect('/unauthorized');
    }

    return <UserLayoutClient session={session}>{children}</UserLayoutClient>;
}
