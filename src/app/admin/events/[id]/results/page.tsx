import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getEvent } from '@/actions/event';
import EventDetailsCard from '@/components/events/EventDetailsCard';
import EventVotingResults from '@/components/events/EventVotingResults';
import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface EventResultsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EventResultsPage({ params }: EventResultsPageProps) {
    const resolvedParams = use(params);
    const event = use(getEvent(resolvedParams.id));

    if (!event) {
        notFound();
    }

    const isCompleted = event.status === 'COMPLETED';

    return (
        <div className="container mx-auto space-y-8 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">
                    Event Voting Results
                </h1>
            </div>

            <Suspense
                fallback={
                    <div className="flex h-64 items-center justify-center">
                        <div className="flex items-center space-x-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                            <p className="text-gray-400">
                                Loading event results...
                            </p>
                        </div>
                    </div>
                }
            >
                <div className="space-y-8">
                    <EventDetailsCard event={event} />
                    <EventVotingResults
                        eventId={event.id}
                        isCompleted={isCompleted}
                        winnerId={event.winnerId}
                    />
                </div>
            </Suspense>
        </div>
    );
}
