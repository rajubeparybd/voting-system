'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CardClubMembershipProps {
    clubName: string;
    membershipType: string;
    joinedDate: string;
    imageUrl: string;
    imageAlt: string;
}

function CardClubMembership({
    clubName,
    membershipType,
    joinedDate,
    imageUrl,
    imageAlt,
}: CardClubMembershipProps) {
    return (
        <div className="rounded-2xl bg-[#252834] p-4 transition-transform duration-300 hover:scale-[1.02] lg:p-6">
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <h3 className="font-poppins mb-2 text-lg font-semibold text-white">
                {clubName}
            </h3>
            <p className="font-poppins mb-2 text-base font-medium text-gray-400">
                {membershipType}
            </p>
            <p className="font-poppins text-base text-gray-400">
                Joined: {joinedDate}
            </p>
        </div>
    );
}

export default function ClubMembership() {
    const clubData = [
        {
            clubName: 'Debating Club',
            membershipType: 'Executive Member',
            joinedDate: 'Jan 2024',
            imageUrl: '/images/debating.png',
            imageAlt: 'Debating Club',
        },
        {
            clubName: 'Sports Club',
            membershipType: 'Member',
            joinedDate: 'Feb 2024',
            imageUrl: '/images/sports.jpg',
            imageAlt: 'Sports Club',
        },
    ];

    return (
        <div className="rounded-2xl bg-[#191B22] p-4 lg:col-span-8 lg:p-6">
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
                {clubData.map(club => (
                    <CardClubMembership key={club.clubName} {...club} />
                ))}
            </div>
        </div>
    );
}
