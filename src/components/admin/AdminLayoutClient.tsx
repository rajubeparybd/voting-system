'use client';

import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminBody } from '@/components/admin/body';
import { Session } from 'next-auth';

interface AdminLayoutClientProps {
    session: Session;
    children: React.ReactNode;
}

export function AdminLayoutClient({
    session,
    children,
}: AdminLayoutClientProps) {
    return (
        <div className="from-background via-background/95 to-background/90 flex min-h-screen flex-col bg-gradient-to-br">
            <div className="flex flex-1 shadow-md">
                <AdminSidebar />
                <div className="flex flex-1 flex-col">
                    <AdminBody session={session}>{children}</AdminBody>
                </div>
            </div>
        </div>
    );
}
