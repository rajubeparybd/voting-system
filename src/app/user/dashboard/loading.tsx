export default function DashboardLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#292D3E]">
            <div className="w-full max-w-7xl space-y-8 px-4">
                {/* Sidebar Skeleton */}
                <div className="fixed top-0 left-0 hidden h-screen w-64 bg-[#1A1C23] p-6 lg:block">
                    <div className="animate-pulse">
                        <div className="mb-10 h-12 w-12 rounded-full bg-gray-700"></div>
                        <div className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-12 rounded-xl bg-gray-700"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="lg:ml-64">
                    <div className="animate-pulse">
                        {/* Header */}
                        <div className="mb-8 flex items-center justify-between">
                            <div className="h-10 w-96 rounded-xl bg-gray-700"></div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-32 rounded bg-gray-700"></div>
                                    <div className="h-3 w-24 rounded bg-gray-700"></div>
                                </div>
                            </div>
                        </div>

                        {/* User Info Card */}
                        <div className="mb-8 h-48 rounded-2xl bg-gray-700"></div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                            {/* Club Membership */}
                            <div className="lg:col-span-8">
                                <div className="h-96 rounded-2xl bg-gray-700"></div>
                            </div>

                            {/* Events */}
                            <div className="space-y-6 lg:col-span-4">
                                <div className="h-64 rounded-2xl bg-gray-700"></div>
                                <div className="h-96 rounded-2xl bg-gray-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
