'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        } else if (
            status === 'authenticated' &&
            !session?.user?.role?.includes('USER')
        ) {
            router.push('/unauthorized');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#292D3E]">
                <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return <>{children}</>;
}
