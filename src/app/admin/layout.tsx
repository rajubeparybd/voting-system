import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminBody } from '@/components/admin/body';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session || !session?.user?.role.includes('ADMIN')) {
        redirect('/auth/signin');
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                <AdminSidebar />
                <AdminBody session={session}>{children}</AdminBody>
            </div>
        </div>
    );
}
