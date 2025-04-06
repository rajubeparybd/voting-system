import { auth } from '@/lib/auth';
import { getTicket } from '@/actions/support';
import { TicketDetails } from '@/components/support/TicketDetails';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

interface TicketPageProps {
    params: {
        id: string;
    };
}

export default async function TicketPage({ params }: TicketPageProps) {
    const session = await auth();
    if (!session?.user) {
        return null;
    }

    try {
        const ticket = await getTicket(params.id);

        return (
            <div className="container mx-auto max-w-4xl py-8">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-200">
                        Support Ticket
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href="/user/support">Back to Tickets</Link>
                    </Button>
                </div>

                <TicketDetails ticket={ticket} currentUser={session.user} />
            </div>
        );
    } catch {
        notFound();
    }
}
