'use client';

import Image from 'next/image';
import { FiBell } from 'react-icons/fi';
import { Session } from 'next-auth';

interface MainHeaderProps {
    session: Session | null;
}

export default function MainHeader({ session }: MainHeaderProps) {
    return (
        <div className="mb-8 hidden items-center justify-between lg:flex">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full rounded-xl border border-gray-700 bg-[#191B22] px-4 py-2 text-gray-400 md:w-96"
                />
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
                <button className="relative">
                    <FiBell className="text-2xl" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500">
                        <Image
                            src="/images/user.jpg"
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    </div>
                    <div>
                        <h4 className="font-semibold">{session?.user?.name}</h4>
                        <p className="text-sm text-gray-400">
                            {session?.user?.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
