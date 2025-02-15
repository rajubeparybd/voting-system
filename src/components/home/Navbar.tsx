'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

const Navbar = () => {
    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Clubs', href: '#clubs' },
        { name: 'Events', href: '#events' },
        { name: 'Community', href: '#community' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <div className="flex w-full items-center justify-between px-6 py-4 md:px-12">
            <Link href="/" className="flex items-center">
                <Image
                    src="/images/ulogo.svg"
                    alt="BUBT Logo"
                    width={48}
                    height={48}
                    className="h-12 w-auto object-contain"
                />
            </Link>

            <div className="hidden items-center gap-8 md:flex">
                {navLinks.map(link => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-base font-medium text-white transition-colors hover:text-amber-400"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-white hover:text-amber-400">
                    <Search size={20} />
                </button>
                <Link
                    href="/auth/signin"
                    className="rounded-full bg-amber-500 px-6 py-2 font-semibold text-black transition-colors hover:bg-amber-600"
                >
                    Sign In
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
