'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiMenu, FiUser, FiBell } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';
import { MdOutlineHowToVote } from 'react-icons/md';
import { BsCalendarEvent } from 'react-icons/bs';
import { RiTeamLine } from 'react-icons/ri';
import { BiSupport } from 'react-icons/bi';

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#292D3E] text-white">
            {/* Mobile Header */}
            <div className="flex items-center justify-between bg-[#1A1C23] p-4 lg:hidden">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-2xl"
                >
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
                            className="rounded-full"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#1A1C23] p-6 transition-transform duration-200 ease-in-out lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
                >
                    <div className="mb-10 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5C888]">
                            <Image
                                src="/graduation-cap.svg"
                                alt="Logo"
                                width={24}
                                height={24}
                                className="text-white"
                            />
                        </div>
                    </div>

                    <nav className="space-y-4">
                        <Link
                            href="/user/dashboard"
                            className="flex items-center gap-3 rounded-xl bg-white px-6 py-3 text-[#1A1C23]"
                        >
                            <FiMenu className="text-xl" />
                            <span className="font-semibold">Dashboard</span>
                        </Link>

                        <Link
                            href="/user/profile"
                            className="flex items-center gap-3 rounded-xl px-6 py-3 text-gray-400 hover:bg-gray-800"
                        >
                            <FiUser className="text-xl" />
                            <span>Profile</span>
                        </Link>

                        <Link
                            href="/user/elections"
                            className="flex items-center gap-3 rounded-xl px-6 py-3 text-gray-400 hover:bg-gray-800"
                        >
                            <MdOutlineHowToVote className="text-xl" />
                            <span>Elections</span>
                        </Link>

                        <Link
                            href="/user/events"
                            className="flex items-center gap-3 rounded-xl px-6 py-3 text-gray-400 hover:bg-gray-800"
                        >
                            <BsCalendarEvent className="text-xl" />
                            <span>Events</span>
                        </Link>

                        <Link
                            href="/user/clubs"
                            className="flex items-center gap-3 rounded-xl px-6 py-3 text-gray-400 hover:bg-gray-800"
                        >
                            <RiTeamLine className="text-xl" />
                            <span>My Clubs</span>
                        </Link>

                        <div className="pt-8">
                            <Link
                                href="/support"
                                className="flex items-center gap-3 rounded-xl px-6 py-3 text-gray-400 hover:bg-gray-800"
                            >
                                <BiSupport className="text-xl" />
                                <span>Support</span>
                            </Link>

                            <button
                                onClick={() => router.push('/api/auth/signout')}
                                className="mt-4 flex w-full items-center gap-3 rounded-xl px-6 py-3 text-red-500 hover:bg-gray-800"
                            >
                                <HiOutlineLogout className="text-xl" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8">
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
                                        src={
                                            session?.user?.image ||
                                            '/images/user.png'
                                        }
                                        alt="Profile"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold">
                                        {session?.user?.name}
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#3A4053] to-[#F4E5FF] p-4 lg:p-8">
                        <p className="mb-4 text-gray-300">March 7, 2025</p>
                        <h1 className="mb-4 text-2xl font-semibold lg:text-3xl">
                            {session?.user?.name}
                        </h1>
                        <div className="mb-4 flex flex-col lg:flex-row lg:gap-16">
                            <p>ID: {session?.user?.id}</p>
                            <p>Dept: CSE</p>
                        </div>
                        <p>Email: {session?.user?.email}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">
                        {/* Club Membership Section */}
                        <div className="rounded-2xl bg-[#191B22] p-4 lg:col-span-8 lg:p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Club Membership
                                </h2>
                                <Link href="/user/clubs" className="text-lg">
                                    See all
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                                <div className="rounded-2xl bg-[#252834] p-4 lg:p-6">
                                    <Image
                                        src="/debating-club.jpg"
                                        alt="Debating Club"
                                        width={200}
                                        height={120}
                                        className="mb-4 w-full rounded-lg object-cover"
                                    />
                                    <h3 className="mb-2 text-lg font-semibold">
                                        Debating Club
                                    </h3>
                                    <p className="mb-2 text-gray-400">
                                        Executive Member
                                    </p>
                                    <p className="text-gray-400">
                                        Joined: Jan 2024
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-[#252834] p-4 lg:p-6">
                                    <Image
                                        src="/sports-club.jpg"
                                        alt="Sports Club"
                                        width={200}
                                        height={120}
                                        className="mb-4 w-full rounded-lg object-cover"
                                    />
                                    <h3 className="mb-2 text-lg font-semibold">
                                        Sports Club
                                    </h3>
                                    <p className="mb-2 text-gray-400">Member</p>
                                    <p className="text-gray-400">
                                        Joined: Feb 2024
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Events Section */}
                        <div className="space-y-4 lg:col-span-4 lg:space-y-6">
                            <div className="rounded-2xl bg-[#191B22] p-4 lg:p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">
                                        Upcoming Elections
                                    </h2>
                                    <Link
                                        href="/user/elections"
                                        className="text-lg"
                                    >
                                        See all
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    <div className="rounded-xl bg-[#252834] p-4">
                                        <div className="mb-3 flex items-center gap-3">
                                            <Image
                                                src="/ieee-logo.png"
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

                            <div className="rounded-2xl bg-[#191B22] p-4 lg:p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">
                                        Upcoming Events
                                    </h2>
                                    <Link
                                        href="/user/events"
                                        className="text-lg"
                                    >
                                        See all
                                    </Link>
                                </div>
                                <div className="max-h-[400px] space-y-4 overflow-y-auto">
                                    <div className="overflow-hidden rounded-2xl bg-[#252834]">
                                        <Image
                                            src="/hackathon.jpg"
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
                                                    <p className="text-sm">
                                                        Organized By: IT Club
                                                    </p>
                                                    <p className="text-sm text-[#FAE6C8]">
                                                        Auditorium Hall
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
