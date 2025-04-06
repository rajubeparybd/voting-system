import { auth } from '@/lib/auth';
import { getAllTickets } from '@/actions/support';
import { TicketList } from '@/components/support/TicketList';
import { redirect } from 'next/navigation';

export default async function AdminSupportPage() {
    const session = await auth();
    if (!session?.user?.role?.includes('ADMIN')) {
        redirect('/');
    }

    const tickets = await getAllTickets();

    return (
        <div className="container mx-auto max-w-5xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-200">
                    Support Tickets
                </h1>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="mb-4 text-xl font-semibold text-gray-200">
                        All Tickets
                    </h2>
                    <TicketList tickets={tickets} isAdmin />
                </div>
            </div>
        </div>
    );
}
