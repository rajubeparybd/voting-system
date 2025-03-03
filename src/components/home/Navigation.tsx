import Image from 'next/image';
import Link from 'next/link';

import uniLogo from '@/assets/images/uni-logo.png';

interface NavLink {
    label: string;
    href: string;
}

interface NavigationProps {
    navLinks: NavLink[];
}

export function Navigation({ navLinks }: NavigationProps) {
    return (
        <header className="fixed z-50 flex w-full items-center justify-between bg-white px-6 py-3 shadow">
            <div className="flex items-center">
                <Link href="/">
                    <Image
                        src={uniLogo}
                        alt="University Logo"
                        className="mr-2 h-10 w-auto"
                    />
                </Link>
            </div>
            <div className="hidden items-center space-x-6 md:flex">
                {navLinks.map(link => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="transition hover:text-indigo-600"
                    >
                        {link.label}
                    </Link>
                ))}
                <Link
                    href="/auth/signin"
                    className="rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                >
                    Get Started
                </Link>
            </div>
        </header>
    );
}
