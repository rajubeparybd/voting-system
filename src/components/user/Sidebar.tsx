'use client';

import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiUser } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';
import { MdDashboard, MdOutlineHowToVote } from 'react-icons/md';
import { BsCalendarEvent } from 'react-icons/bs';
import { RiTeamLine } from 'react-icons/ri';
import { BiSupport } from 'react-icons/bi';
import { GiVote } from 'react-icons/gi';

interface SidebarProps {
    isSidebarOpen: boolean;
}

export default function Sidebar({ isSidebarOpen }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 min-h-screen w-64 transform bg-[#1A1C23] p-6 transition-transform duration-200 ease-in-out lg:static ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}
        >
            <div className="mb-10 flex items-center justify-center gap-4">
                <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    width={100}
                    height={100}
                />
            </div>

            <nav className="space-y-4">
                <Link
                    href="/user/dashboard"
                    className={`flex items-center gap-3 rounded-xl px-6 py-3 transition-colors ${
                        isActive('/user/dashboard')
                            ? 'bg-white text-[#1A1C23]'
                            : 'text-gray-400 hover:bg-gray-800'
                    }`}
                >
                    <MdDashboard />
                    <span
                        className={
                            isActive('/user/dashboard') ? 'font-semibold' : ''
                        }
                    >
                        Dashboard
                    </span>
                </Link>

                <Link
                    href="/user/profile"
                    className={`flex items-center gap-3 rounded-xl px-6 py-3 transition-colors ${
                        isActive('/user/profile')
                            ? 'bg-white text-[#1A1C23]'
                            : 'text-gray-400 hover:bg-gray-800'
                    }`}
                >
                    <FiUser className="text-xl" />
                    <span
                        className={
                            isActive('/user/profile') ? 'font-semibold' : ''
                        }
                    >
                        Profile
                    </span>
                </Link>

                <Link
                    href="/user/candidate"
                    className={`flex items-center gap-3 rounded-xl px-6 py-3 transition-colors ${
                        isActive('/user/candidate')
                            ? 'bg-white text-[#1A1C23]'
                            : 'text-gray-400 hover:bg-gray-800'
                    }`}
                >
                    <GiVote className="text-xl" />
                    <span
                        className={
                            isActive('/user/candidate') ? 'font-semibold' : ''
                        }
                    >
                        Candidate
                    </span>
                </Link>

                <Link
                    href="/user/elections"
                    className={`flex items-center gap-3 rounded-xl px-6 py-3 transition-colors ${
                        isActive('/user/elections')
                            ? 'bg-white text-[#1A1C23]'
                            : 'text-gray-400 hover:bg-gray-800'
                    }`}
                >
                    <MdOutlineHowToVote className="text-xl" />
                    <span
                        className={
                            isActive('/user/elections') ? 'font-semibold' : ''
                        }
                    >
                        Elections
                    </span>
                </Link>

                <Link
                    href="/user/events"
                    className={`flex items-center gap-3 rounded-xl px-6 py-3 transition-colors ${
                        isActive('/user/events')
                            ? 'bg-white text-[#1A1C23]'
                            : 'text-gray-400 hover:bg-gray-800'
                    }`}
                >
                    <BsCalendarEvent className="text-xl" />
                    <span
                        className={
                            isActive('/user/events') ? 'font-semibold' : ''
                        }
                    >
                        Events
                    </span>
                </Link>

                <Link
                    href="/user/clubs"
                    className={`flex items-center gap-3 rounded-xl px-6 py-3 transition-colors ${
                        isActive('/user/clubs')
                            ? 'bg-white text-[#1A1C23]'
                            : 'text-gray-400 hover:bg-gray-800'
                    }`}
                >
                    <RiTeamLine className="text-xl" />
                    <span
                        className={
                            isActive('/user/clubs') ? 'font-semibold' : ''
                        }
                    >
                        My Clubs
                    </span>
                </Link>

                <div className="pt-8">
                    <hr className="mb-4 border-gray-700" />
                    <Link
                        href="/support"
                        className={`flex items-center gap-3 rounded-xl px-6 py-3 transition-colors ${
                            isActive('/support')
                                ? 'bg-white text-[#1A1C23]'
                                : 'text-gray-400 hover:bg-gray-800'
                        }`}
                    >
                        <BiSupport className="text-xl" />
                        <span
                            className={
                                isActive('/support') ? 'font-semibold' : ''
                            }
                        >
                            Support
                        </span>
                    </Link>

                    <button
                        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                        className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-xl px-6 py-3 text-red-500 hover:bg-gray-800"
                    >
                        <HiOutlineLogout className="text-xl" />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
}
