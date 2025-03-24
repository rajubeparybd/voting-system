'use client';

import { Session } from 'next-auth';
import Image from 'next/image';

interface UserInfoCardProps {
    session: Session | null;
}

export default function UserInfoCard({ session }: UserInfoCardProps) {
    // Extract session data into variables
    const name = session?.user?.name || 'Guest';
    const id = session?.user?.id || 'N/A';
    const email = session?.user?.email || 'N/A';
    const department = 'CSE';
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="mb-8 rounded-2xl bg-[#3A4053] p-4 lg:bg-gradient-to-br lg:from-[#3A4053] lg:to-[#F4E5FF] lg:p-8">
            {/* Mobile design - left aligned, date at bottom-right */}
            <div className="relative flex flex-col lg:hidden">
                <h1 className="mb-2 text-2xl font-semibold">{name}</h1>
                <p className="mb-2">ID: {id}</p>
                <p className="mb-2">Dept: {department}</p>
                <p className="mb-2">Email: {email}</p>
                <p className="mt-2 self-end text-sm text-gray-300">{date}</p>
            </div>

            {/* Desktop design - side by side with image */}
            <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="mb-2 text-gray-300">{date}</p>
                    <h1 className="mb-2 text-3xl font-semibold">{name}</h1>
                    <p className="mb-2">ID: {id}</p>
                    <p className="mb-2">Dept: {department}</p>
                    <p className="mb-2">Email: {email}</p>
                </div>
                <div>
                    <Image
                        src="/images/dashboard.svg"
                        alt="Dashboard"
                        width={450}
                        height={450}
                        className="ml-8"
                    />
                </div>
            </div>
        </div>
    );
}
