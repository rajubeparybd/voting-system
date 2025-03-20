import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto w-full rounded bg-gray-900 py-6">
            <div className="container mx-auto flex items-center justify-between px-4">
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
