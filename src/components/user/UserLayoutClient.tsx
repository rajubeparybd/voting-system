'use client';

import MainHeader from '@/components/user/MainHeader';
import MobileHeader from '@/components/user/MobileHeader';
import Sidebar from '@/components/user/Sidebar';
import Footer from '@/components/ui/Footer';
import { useState } from 'react';
import { Session } from 'next-auth';

interface UserLayoutClientProps {
    session: Session;
    children: React.ReactNode;
}

export function UserLayoutClient({ session, children }: UserLayoutClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-[#292D3E] text-white">
            <MobileHeader
                session={session}
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex flex-1 flex-col lg:flex-row">
                <Sidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex flex-1 flex-col p-4 !pb-0 lg:p-8">
                    <MainHeader session={session} />
                    {children}
                    <Footer />
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
