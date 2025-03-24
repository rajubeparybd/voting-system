'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function UpcomingElections() {
    return (
        <div className="rounded-2xl bg-[#191B22] p-4 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upcoming Elections</h2>
                <Link href="/user/elections" className="text-lg">
                    See all
                </Link>
            </div>
            <div className="space-y-4">
                <div className="rounded-xl bg-[#252834] p-4">
                    <div className="mb-3 flex items-center gap-3">
                        <Image
                            src="/images/ieee.jpg"
                            alt="IEEE"
                            width={40}
                            height={40}
                            className="rounded-lg"
                        />
                        <span>IEEE BUBT</span>
                    </div>
                    <h3 className="mb-2 font-semibold">
                        IT Club Presidential Election 2025
                    </h3>
                    <p className="mb-4 text-sm text-[#F8D9AE]">
                        March 15, 2025 | 3:00 PM
                    </p>
                    <button className="w-full rounded-lg bg-[#F8D9AE] py-2 font-semibold text-[#262626]">
                        Vote Now
                    </button>
                </div>
            </div>
        </div>
    );
}
