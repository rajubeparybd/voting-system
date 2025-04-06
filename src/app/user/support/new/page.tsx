import { auth } from '@/lib/auth';
import { TicketForm } from '@/components/support/TicketForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function NewTicketPage() {
    const session = await auth();
    if (!session?.user) {
        return null;
    }

    return (
        <div className="container mx-auto max-w-2xl py-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-200">
                    Create Support Ticket
                </h1>
                <Button variant="outline" asChild>
                    <Link href="/user/support">Back to Tickets</Link>
                </Button>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
                <TicketForm />
            </div>
        </div>
    );
}
