import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto w-full rounded-lg bg-gray-900 py-6">
            <div className="md: container mx-auto flex flex-col items-center justify-between px-4 md:flex-row">
                <div className="text-sm text-gray-400">
                    © {currentYear} Voting System. All rights reserved.
                </div>

                <div className="flex items-center text-sm text-gray-400">
                    Made with ❤️ by &nbsp;
                    <Link
                        className="text-blue-400 hover:underline"
                        target="_blank"
                        href="https://github.com/rajubeparybd"
                    >
                        Raju Bepary
                    </Link>
                </div>
            </div>
        </footer>
    );
}
