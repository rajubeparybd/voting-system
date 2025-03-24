'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserInfoCard from '@/components/user/UserInfoCard';
import ClubMembership from '@/components/user/ClubMembership';
import UpcomingElections from '@/components/user/UpcomingElections';
import UpcomingEvents from '@/components/user/UpcomingEvents';

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <>
            <UserInfoCard session={session} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-8">
                    <div className="space-y-4 lg:space-y-6">
                        <ClubMembership />
                        <UpcomingElections />
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <UpcomingEvents />
                </div>
            </div>
        </>
    );
}
