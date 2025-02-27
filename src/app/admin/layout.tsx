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
        <div className="from-background via-background/95 to-background/90 min-h-screen bg-gradient-to-br">
            <div className="flex shadow-md">
                <AdminSidebar />
                <AdminBody session={session}>{children}</AdminBody>
            </div>
        </div>
    );
}
