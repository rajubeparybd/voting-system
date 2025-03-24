'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiRefreshCw } from 'react-icons/fi';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#292D3E] px-4">
            <div className="text-center">
                <h1 className="mb-4 text-6xl font-bold text-white">Oops!</h1>
                <h2 className="mb-8 text-2xl font-semibold text-white">
                    Something went wrong
                </h2>
                <p className="mb-8 text-gray-400">
                    {error.message ||
                        'An unexpected error occurred. Please try again later.'}
                </p>
                <div className="space-x-4">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#1A1C23] transition-colors hover:bg-gray-100"
                    >
                        <FiRefreshCw />
                        <span>Try Again</span>
                    </button>
                    <Link
                        href="/user/dashboard"
                        className="inline-flex items-center gap-2 rounded-xl border border-white bg-transparent px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
