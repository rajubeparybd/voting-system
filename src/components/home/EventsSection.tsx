'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEvents } from '@/actions/event';

interface Event {
    id: string;
    title: string;
    description: string;
    eventDate: Date;
    status: string;
    clubId: string;
    club: {
        name: string;
        image: string;
    };
}

const EventFilterChip = ({
    club,
    activeClub,
    onClick,
}: {
    club: { id: string; name: string; active?: boolean };
    activeClub: string;
    onClick: (id: string) => void;
}) => {
    const isActive = club.id === activeClub;

    return (
        <button
            onClick={() => onClick(club.id)}
            className={`rounded-full border border-gray-600 px-4 py-2 transition-colors ${
                isActive
                    ? 'bg-amber-500 font-medium text-black'
                    : 'bg-transparent text-gray-400 hover:text-white'
            }`}
        >
            {club.name}
        </button>
    );
};

const EventCard = ({ event }: { event: Event }) => {
    // Format date
    const date = new Date(event.eventDate);
    const month = date
        .toLocaleString('en-US', { month: 'short' })
        .toUpperCase();
    const day = date.getDate();
    const time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });

    return (
        <div className="overflow-hidden rounded-xl bg-gray-800 shadow-lg">
            {/* Event image */}
            <div className="relative h-48 w-full">
                <div className="bg-opacity-80 absolute top-3 right-3 z-10 rounded-full bg-gray-900 p-1">
                    <Star className="h-5 w-5 text-amber-500" />
                </div>
                <div className="absolute top-3 left-3 z-10 rounded-r-md bg-amber-500 px-3 py-1 text-sm font-medium text-black">
                    {event.club.name}
                </div>
                <Image
                    src={event.club.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Event details */}
            <div className="p-5">
                <div className="flex gap-4">
                    {/* Date */}
                    <div className="text-center">
                        <div className="font-medium text-amber-500">
                            {month}
                        </div>
                        <div className="text-xl font-semibold text-white">
                            {day}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white">
                            {event.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {event.description}
                        </p>
                        <p className="text-sm text-gray-400">{time}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventsSection = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [clubs, setClubs] = useState<{ id: string; name: string }[]>([
        { id: 'all', name: 'All' },
    ]);
    const [activeClub, setActiveClub] = useState('all');

    useEffect(() => {
        async function loadEvents() {
            try {
                // Get only upcoming events
                const eventsData = await getEvents(undefined, 'UPCOMING');
                setEvents(eventsData);

                // Extract unique clubs from events
                const uniqueClubs = new Map<
                    string,
                    { id: string; name: string }
                >();

                // Add 'All' option
                uniqueClubs.set('all', { id: 'all', name: 'All' });

                // Add clubs from events
                eventsData.forEach(event => {
                    if (event.club && !uniqueClubs.has(event.clubId)) {
                        uniqueClubs.set(event.clubId, {
                            id: event.clubId,
                            name: event.club.name,
                        });
                    }
                });

                setClubs(Array.from(uniqueClubs.values()));

                // Debug log
                console.log('Events data:', eventsData);
                console.log('Club filters:', Array.from(uniqueClubs.values()));
            } catch (error) {
                console.error('Error loading events:', error);
            } finally {
                setLoading(false);
            }
        }

        loadEvents();
    }, []);

    // Filter events based on selected club
    const filteredEvents =
        activeClub === 'all'
            ? events
            : events.filter(event => event.clubId === activeClub);

    // Handle club filter click
    const handleClubFilter = (clubId: string) => {
        setActiveClub(clubId);
    };

    return (
        <section id="events" className="bg-gray-900 py-20">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section Title */}
                <div className="mb-12 flex flex-col items-end">
                    <h2 className="text-3xl font-medium text-amber-500 md:text-4xl">
                        UPCOMING EVENTS
                    </h2>
                    <div className="mt-2 h-1 w-32 bg-gray-700"></div>
                </div>

                {/* Filter Chips */}
                <div className="mb-12 flex flex-wrap gap-4">
                    {clubs.map(club => (
                        <EventFilterChip
                            key={club.id}
                            club={club}
                            activeClub={activeClub}
                            onClick={handleClubFilter}
                        />
                    ))}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {loading ? (
                        <div className="col-span-full py-12 text-center">
                            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-300">
                                Loading events...
                            </p>
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center">
                            <p className="text-gray-300">
                                No upcoming events found.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default EventsSection;
