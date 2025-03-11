import Link from 'next/link';
import { MdDashboardCustomize } from 'react-icons/md';
import {
    FaUsers,
    FaUserTie,
    FaClipboardList,
    FaCalendarAlt,
} from 'react-icons/fa';

export function AdminSidebar() {
    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-800 shadow-lg">
            <div className="border-b border-gray-700 p-4">
                <h2 className="text-xl font-bold text-gray-100">
                    Admin Dashboard
                </h2>
            </div>
            <nav className="space-y-2 p-4">
                <Link
                    href="/admin/dashboard"
                    className="flex items-center space-x-2 rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                    <MdDashboardCustomize className="h-5 w-5" />
                    <span>Dashboard</span>
                </Link>
                <Link
                    href="/admin/clubs"
                    className="flex items-center space-x-2 rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                    <FaUsers className="h-5 w-5" />
                    <span>Clubs</span>
                </Link>
                <Link
                    href="/admin/nominations"
                    className="flex items-center space-x-2 rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                    <FaClipboardList className="h-5 w-5" />
                    <span>Nominations</span>
                </Link>
                <Link
                    href="/admin/candidates"
                    className="flex items-center space-x-2 rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                    <FaUserTie className="h-5 w-5" />
                    <span>Candidates</span>
                </Link>
                <Link
                    href="/admin/applications"
                    className="flex items-center space-x-2 rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                    <FaClipboardList className="h-5 w-5" />
                    <span>Applications</span>
                </Link>
                <Link
                    href="/admin/events"
                    className="flex items-center space-x-2 rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                    <FaCalendarAlt className="h-5 w-5" />
                    <span>Events</span>
                </Link>
            </nav>
        </aside>
    );
}
