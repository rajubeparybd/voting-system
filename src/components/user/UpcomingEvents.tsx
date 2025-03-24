'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function UpcomingEvents() {
    return (
        <div className="rounded-2xl bg-[#191B22] p-4 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                <Link href="/user/events" className="text-lg">
                    See all
                </Link>
            </div>
            <div className="max-h-[400px] space-y-4 overflow-y-auto">
                <div className="overflow-hidden rounded-2xl bg-[#252834]">
                    <Image
                        src="/images/activity1.jpg"
                        alt="Hackathon"
                        width={400}
                        height={200}
                        className="w-full object-cover"
                    />
                    <div className="p-4">
                        <div className="flex items-start gap-4">
                            <div className="rounded bg-blue-100/40 px-4 py-2">
                                <p className="text-sm font-semibold text-[#F0AD4E]">
                                    APR
                                </p>
                                <p className="text-2xl font-semibold text-[#F0AD4E]">
                                    20
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#F0AD4E]">
                                    Hackathon 2025
                                </h3>
                                <p className="text-sm">Organized By: IT Club</p>
                                <p className="text-sm text-[#FAE6C8]">
                                    Auditorium Hall
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
