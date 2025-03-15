'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getEvent } from '@/actions/event';

export default function EditEventPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventData = await getEvent(params.id);
                if (!eventData) {
                    toast.error('Event not found');
                    router.push('/admin/events');
                    return;
                }

                // We'll implement the full edit form later
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch event:', error);
                toast.error('Failed to load event data');
                router.push('/admin/events');
            }
        };

        fetchEvent();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="flex h-64 items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                        <p className="text-gray-400">Loading event...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <Button
                variant="ghost"
                className="mb-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                onClick={() => router.push('/admin/events')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>

            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-white">
                    Edit Event
                </h1>
                <p className="text-gray-400">
                    This feature is coming soon. Please use the event list page
                    to manage events.
                </p>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={() => router.push('/admin/events')}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    Return to Events
                </Button>
            </div>
        </div>
    );
}
