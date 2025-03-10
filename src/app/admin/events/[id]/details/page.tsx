import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getEvent } from '@/actions/event';
import EventDetailsCard from '@/components/events/EventDetailsCard';
import EventCandidatesList from '@/components/events/EventCandidatesList';
import { use } from 'react';

interface EventDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
    const resolvedParams = use(params);
    const event = use(getEvent(resolvedParams.id));

    if (!event) {
        notFound();
    }

    const isCompleted = event.status === 'COMPLETED';

    console.log('Event data in details page:', event);

    return (
        <div className="container mx-auto space-y-8 p-6">
            <h1 className="mb-6 text-2xl font-bold text-white">
                Event Details
            </h1>

            <Suspense
                fallback={
                    <div className="flex h-64 items-center justify-center">
                        <div className="flex items-center space-x-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                            <p className="text-gray-400">
                                Loading event details...
                            </p>
                        </div>
                    </div>
                }
            >
                <div className="space-y-8">
                    <EventDetailsCard event={event} />
                    <EventCandidatesList
                        candidates={event.candidateDetails ?? []}
                        winnerId={event.winnerId}
                        isCompleted={isCompleted}
                    />
                </div>
            </Suspense>
        </div>
    );
}
