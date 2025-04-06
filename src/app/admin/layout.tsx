import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/auth/signin');
    }

    if (!session.user.role.includes(Role.ADMIN)) {
        if (session.user.role.includes(Role.USER)) {
            redirect('/user/dashboard');
        }
        redirect('/unauthorized');
    }

    return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}
