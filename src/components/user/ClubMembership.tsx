'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ClubMembership() {
    return (
        <div className="rounded-2xl bg-[#191B22] p-4 lg:col-span-8 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Club Membership</h2>
                <Link href="/user/clubs" className="text-lg">
                    See all
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                <div className="rounded-2xl bg-[#252834] p-4 lg:p-6">
                    <Image
                        src="/images/debating.png"
                        alt="Debating Club"
                        width={200}
                        height={120}
                        className="mb-4 w-full rounded-lg object-cover"
                    />
                    <h3 className="mb-2 text-lg font-semibold">
                        Debating Club
                    </h3>
                    <p className="mb-2 text-gray-400">Executive Member</p>
                    <p className="text-gray-400">Joined: Jan 2024</p>
                </div>
                <div className="rounded-2xl bg-[#252834] p-4 lg:p-6">
                    <Image
                        src="/images/sports.jpg"
                        alt="Sports Club"
                        width={200}
                        height={120}
                        className="mb-4 w-full rounded-lg object-cover"
                    />
                    <h3 className="mb-2 text-lg font-semibold">Sports Club</h3>
                    <p className="mb-2 text-gray-400">Member</p>
                    <p className="text-gray-400">Joined: Feb 2024</p>
                </div>
            </div>
        </div>
    );
}
