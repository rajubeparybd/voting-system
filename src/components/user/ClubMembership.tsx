'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getActiveClubs, joinClub } from '@/actions/club';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface Club {
    id: string;
    name: string;
    description: string;
    image: string;
    members: string[];
    open_date: Date | null;
}

function CardClubMembership({
    club,
    userId,
    onJoinSuccess,
}: {
    club: Club;
    userId?: string;
    onJoinSuccess: () => void;
}) {
    const [isJoining, setIsJoining] = useState(false);
    const isMember = userId ? club.members.includes(userId) : false;

    const handleJoin = async () => {
        if (!userId) {
            toast.error('Please sign in to join clubs');
            return;
        }

        try {
            setIsJoining(true);
            await joinClub(club.id, userId);
            toast.success(`Successfully joined ${club.name}`);
            onJoinSuccess(); // Call the callback to refresh data
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Failed to join club'
            );
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="rounded-2xl bg-[#252834] p-4 transition-transform duration-300 hover:scale-[1.02] lg:p-6">
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                <Image
                    src={club.image}
                    alt={club.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <h3 className="font-poppins mb-2 text-lg font-semibold text-white">
                {club.name}
            </h3>
            <p className="font-poppins mb-4 line-clamp-2 text-base text-gray-400">
                {club.description}
            </p>
            <div className="flex items-center justify-between">
                <p className="font-poppins text-sm text-gray-400">
                    {club.members.length} members
                </p>
                {isMember ? (
                    <span className="font-poppins rounded-lg bg-green-600/10 px-4 py-2 text-sm font-medium text-green-500">
                        Joined
                    </span>
                ) : (
                    <button
                        onClick={handleJoin}
                        disabled={isJoining}
                        className="font-poppins rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isJoining ? 'Joining...' : 'Join Club'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function ClubMembership() {
    const { data: session } = useSession();
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);

    const loadClubs = async () => {
        try {
            const activeClubs = await getActiveClubs(2);
            setClubs(activeClubs);
        } catch (error) {
            console.error('Failed to load clubs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClubs();
    }, []);

    if (loading) {
        return (
            <div className="rounded-2xl bg-[#191B22] p-4 lg:col-span-8 lg:p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-poppins text-xl font-semibold text-white">
                        Club Membership
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                    {[1, 2].map(i => (
                        <div
                            key={i}
                            className="h-[300px] animate-pulse rounded-2xl bg-[#252834]"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4 rounded-2xl bg-[#191B22] p-4 lg:col-span-8 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="font-poppins text-xl font-semibold text-white">
                    Club Membership
                </h2>
                <Link
                    href="/user/clubs"
                    className="font-poppins text-lg text-white transition-colors hover:text-gray-300"
                >
                    See all
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                {clubs.slice(0, 2).map(club => (
                    <CardClubMembership
                        key={club.id}
                        club={club}
                        userId={session?.user?.id}
                        onJoinSuccess={loadClubs}
                    />
                ))}
            </div>
        </div>
    );
}
