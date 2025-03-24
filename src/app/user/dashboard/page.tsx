'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/user/Sidebar';
import MobileHeader from '@/components/user/MobileHeader';
import MainHeader from '@/components/user/MainHeader';
import UserInfoCard from '@/components/user/UserInfoCard';
import ClubMembership from '@/components/user/ClubMembership';
import UpcomingElections from '@/components/user/UpcomingElections';
import UpcomingEvents from '@/components/user/UpcomingEvents';

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#292D3E] text-white">
            <MobileHeader
                session={session}
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex flex-col lg:flex-row">
                <Sidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-1 p-4 lg:p-8">
                    <MainHeader session={session} />
                    <UserInfoCard session={session} />

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">
                        <ClubMembership />
                        <div className="space-y-4 lg:col-span-4 lg:space-y-6">
                            <UpcomingElections />
                            <UpcomingEvents />
                        </div>
                    </div>
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
