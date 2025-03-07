import { SignOut } from '@/components/sign-out';
import { Session } from 'next-auth';

interface AdminBodyProps {
    session: Session;
    children: React.ReactNode;
}

export function AdminBody({ session, children }: AdminBodyProps) {
    return (
        <div className="ml-64 flex-1">
            {/* Header */}
            <header className="bg-gray-800 shadow-sm">
                <div className="flex items-center justify-between px-8 py-3">
                    <h1 className="text-2xl font-semibold text-gray-100">
                        Dashboard
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-100">
                                {session.user?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                                {session.user?.email}
                            </p>
                        </div>
                        <SignOut />
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="p-8">{children}</main>
        </div>
    );
}
