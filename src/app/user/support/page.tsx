import { auth } from '@/lib/auth';
import { getUserTickets } from '@/actions/support';
import { TicketList } from '@/components/support/TicketList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function UserSupportPage() {
    const session = await auth();
    if (!session?.user) {
        return null;
    }

    const tickets = await getUserTickets();

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-200">Support</h1>
                <Button asChild>
                    <Link href="/user/support/new">Create New Ticket</Link>
                </Button>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="mb-4 text-xl font-semibold text-gray-200">
                        Your Tickets
                    </h2>
                    <TicketList tickets={tickets} />
                </div>
            </div>
        </div>
    );
}
