'use client';

import Image from 'next/image';
import { FiMenu, FiBell } from 'react-icons/fi';
import { Session } from 'next-auth';

interface MobileHeaderProps {
    session: Session | null;
    onMenuClick: () => void;
}

export default function MobileHeader({
    session,
    onMenuClick,
}: MobileHeaderProps) {
    return (
        <div className="flex items-center justify-between bg-[#1A1C23] p-4 lg:hidden">
            <button onClick={onMenuClick} className="text-2xl">
                <FiMenu />
            </button>
            <div className="flex items-center gap-4">
                <button className="relative">
                    <FiBell className="text-2xl" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <div className="h-8 w-8 rounded-full bg-blue-500">
                    <Image
                        src={session?.user?.image || '/images/user.jpg'}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
