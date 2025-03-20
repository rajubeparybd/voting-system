import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminBody } from '@/components/admin/body';
import Footer from '@/components/ui/Footer';

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
        <div className="from-background via-background/95 to-background/90 flex min-h-screen flex-col bg-gradient-to-br">
            <div className="flex flex-1 shadow-md">
                <AdminSidebar />
                <div className="flex flex-1 flex-col">
                    <AdminBody session={session}>{children}</AdminBody>
                    <Footer />
                </div>
            </div>
        </div>
    );
}
