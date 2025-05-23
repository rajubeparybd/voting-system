import { auth } from '@/lib/auth';
import { getTicket } from '@/actions/support';
import { TicketDetails } from '@/components/support/TicketDetails';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound, redirect } from 'next/navigation';
import { use } from 'react';

export default function AdminTicketPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const session = use(auth());

    if (!session?.user?.role?.includes('ADMIN')) {
        redirect('/');
    }

    try {
        const ticket = use(getTicket(resolvedParams.id));

        return (
            <div className="container mx-auto max-w-4xl py-8">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-200">
                        Support Ticket
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/support">Back to Tickets</Link>
                    </Button>
                </div>

                <TicketDetails ticket={ticket} currentUser={session.user} />
            </div>
        );
    } catch {
        notFound();
    }
}
