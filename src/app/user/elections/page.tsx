'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getEvents } from '@/actions/event';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface EventWithClub {
    id: string;
    title: string;
    description: string;
    position: string;
    eventDate: Date;
    status: 'ONGOING' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
    club: {
        name: string;
        image: string;
    };
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference =
                Number(new Date(targetDate)) - Number(new Date());

            if (difference <= 0) {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="mt-2 grid grid-cols-4 gap-1 text-center">
            <div className="rounded bg-gray-800 px-1 py-1">
                <div className="text-lg font-bold text-[#F8D9AE]">
                    {timeLeft.days}
                </div>
                <div className="text-xs text-gray-400">Days</div>
            </div>
            <div className="rounded bg-gray-800 px-1 py-1">
                <div className="text-lg font-bold text-[#F8D9AE]">
                    {timeLeft.hours}
                </div>
                <div className="text-xs text-gray-400">Hours</div>
            </div>
            <div className="rounded bg-gray-800 px-1 py-1">
                <div className="text-lg font-bold text-[#F8D9AE]">
                    {timeLeft.minutes}
                </div>
                <div className="text-xs text-gray-400">Mins</div>
            </div>
            <div className="rounded bg-gray-800 px-1 py-1">
                <div className="text-lg font-bold text-[#F8D9AE]">
                    {timeLeft.seconds}
                </div>
                <div className="text-xs text-gray-400">Secs</div>
            </div>
        </div>
    );
}

function EventCard({ event }: { event: EventWithClub }) {
    const statusColors = {
        ONGOING: 'bg-green-500',
        UPCOMING: 'bg-blue-500',
        COMPLETED: 'bg-gray-500',
        CANCELLED: 'bg-red-500',
    };

    return (
        <div className="overflow-hidden rounded-xl bg-[#252834] shadow-lg transition-transform hover:translate-y-[-4px]">
            <div className="p-5">
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-500/20">
                            <Image
                                src={event.club.image || '/images/logo.svg'}
                                alt={event.club.name}
                                width={40}
                                height={40}
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">
                                {event.club.name}
                            </p>
                            <h3 className="text-lg font-semibold text-white">
                                {event.title}
                            </h3>
                        </div>
                    </div>
                    <Badge className={`${statusColors[event.status]}`}>
                        {event.status}
                    </Badge>
                </div>

                <div className="mb-4">
                    <p className="mb-2 text-sm text-gray-300">
                        Position: {event.position}
                    </p>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-400">
                        {event.description}
                    </p>
                    <p className="text-sm text-[#F8D9AE]">
                        {format(new Date(event.eventDate), 'PPP p')}
                    </p>

                    {event.status === 'UPCOMING' && (
                        <CountdownTimer
                            targetDate={new Date(event.eventDate)}
                        />
                    )}
                </div>

                <div className="mt-4">
                    {event.status === 'ONGOING' && (
                        <Link
                            href={`/user/elections/${event.id}/vote`}
                            className="block"
                        >
                            <button className="w-full rounded-lg bg-[#F8D9AE] py-2 font-semibold text-[#262626] transition-colors hover:bg-[#f0c48b]">
                                Vote Now
                            </button>
                        </Link>
                    )}
                    {event.status === 'UPCOMING' && (
                        <Link
                            href={`/user/elections/${event.id}/upcoming`}
                            className="mt-4 block"
                        >
                            <button className="w-full rounded-lg bg-[#F8D9AE] py-2 font-semibold text-[#262626]">
                                View Details
                            </button>
                        </Link>
                    )}
                    {event.status === 'COMPLETED' && (
                        <Link
                            href={`/user/elections/${event.id}/results`}
                            className="block"
                        >
                            <button className="w-full rounded-lg border border-gray-500 py-2 font-semibold text-gray-400 transition-colors hover:bg-gray-700">
                                View Results
                            </button>
                        </Link>
                    )}
                    {event.status === 'CANCELLED' && (
                        <button className="w-full cursor-not-allowed rounded-lg bg-red-500/20 py-2 font-semibold text-red-400">
                            Cancelled
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ElectionsPage() {
    const [events, setEvents] = useState<EventWithClub[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const eventsData = await getEvents();
                setEvents(eventsData as EventWithClub[]);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    // Sort and categorize events
    const ongoingEvents = events.filter(event => event.status === 'ONGOING');
    const upcomingEvents = events.filter(event => event.status === 'UPCOMING');
    const completedEvents = events.filter(
        event => event.status === 'COMPLETED'
    );
    const cancelledEvents = events.filter(
        event => event.status === 'CANCELLED'
    );

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-8 pb-8">
            <div>
                <h1 className="mb-6 text-2xl font-bold text-white">
                    Elections
                </h1>
                <p className="mb-8 text-gray-400">
                    View and participate in all upcoming and ongoing elections
                    for your clubs.
                </p>
            </div>

            {/* Ongoing Events */}
            {ongoingEvents.length > 0 && (
                <section>
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                        <span className="h-3 w-3 rounded-full bg-green-500"></span>
                        Ongoing Elections
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {ongoingEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
                <section>
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                        <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                        Upcoming Elections
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </section>
            )}

            {/* Completed Events */}
            {completedEvents.length > 0 && (
                <section>
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                        <span className="h-3 w-3 rounded-full bg-gray-500"></span>
                        Completed Elections
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {completedEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </section>
            )}

            {/* Cancelled Events */}
            {cancelledEvents.length > 0 && (
                <section>
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                        <span className="h-3 w-3 rounded-full bg-red-500"></span>
                        Cancelled Elections
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {cancelledEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </section>
            )}

            {events.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#1e2028] p-10 text-center">
                    <div className="mb-4 text-5xl">📋</div>
                    <h3 className="mb-2 text-xl font-semibold text-white">
                        No Elections Available
                    </h3>
                    <p className="text-gray-400">
                        There are no elections to display at this time.
                    </p>
                </div>
            )}
        </div>
    );
}
