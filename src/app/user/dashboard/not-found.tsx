import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#292D3E] px-4">
            <div className="text-center">
                <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
                <h2 className="mb-8 text-2xl font-semibold text-white">
                    Page Not Found
                </h2>
                <p className="mb-8 text-gray-400">
                    The page you are looking for does not exist or has been
                    moved.
                </p>
                <Link
                    href="/user/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#1A1C23] transition-colors hover:bg-gray-100"
                >
                    <FiArrowLeft />
                    <span>Back to Dashboard</span>
                </Link>
            </div>
        </div>
    );
}
