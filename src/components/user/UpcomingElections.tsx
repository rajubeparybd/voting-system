'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ElectionCardProps {
    organization: string;
    logo: string;
    title: string;
    datetime: string;
}

function ElectionCard({
    organization,
    logo,
    title,
    datetime,
}: ElectionCardProps) {
    return (
        <div className="rounded-xl bg-[#252834] p-4">
            <div className="mb-3 flex items-center gap-3">
                <Image
                    src={logo}
                    alt={organization}
                    width={40}
                    height={40}
                    className="rounded-lg"
                />
                <span>{organization}</span>
            </div>
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="mb-4 text-sm text-[#F8D9AE]">{datetime}</p>
            <button className="w-full rounded-lg bg-[#F8D9AE] py-2 font-semibold text-[#262626]">
                Vote Now
            </button>
        </div>
    );
}

export default function UpcomingElections() {
    const elections = [
        {
            organization: 'IEEE BUBT',
            logo: '/images/ieee.jpg',
            title: 'IT Club Presidential Election 2025',
            datetime: 'March 15, 2025 | 3:00 PM',
        },
        {
            organization: 'Sports Club',
            logo: '/images/sports.jpg',
            title: 'Sports Club Secretary Election 2025',
            datetime: 'March 20, 2025 | 2:00 PM',
        },
    ];

    return (
        <div className="rounded-2xl bg-[#191B22] p-4 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upcoming Elections</h2>
                <Link href="/user/elections" className="text-lg">
                    See all
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {elections.map((election, index) => (
                    <ElectionCard key={index} {...election} />
                ))}
            </div>
        </div>
    );
}
