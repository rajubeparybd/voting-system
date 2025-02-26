'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getEvents } from '@/actions/event';
import { format } from 'date-fns';

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

interface ElectionCardProps {
    id: string;
    organization: string;
    logo: string;
    title: string;
    datetime: string;
    eventDate: Date;
}

function ElectionCard({
    id,
    organization,
    logo,
    title,
    datetime,
    eventDate,
}: ElectionCardProps) {
    return (
        <div className="rounded-xl bg-[#252834] p-4">
            <div className="mb-3 flex items-center gap-3">
                <Image
                    src={logo}
                    alt={organization}
                    width={40}
                    height={40}
                    className="rounded-lg"
                />
                <span>{organization}</span>
            </div>
            <h3 className="mb-2 font-semibold">{title}</h3>
            <p className="mb-2 text-sm text-[#F8D9AE]">{datetime}</p>
            <CountdownTimer targetDate={eventDate} />
            <Link href={`/user/elections/${id}`} className="mt-4 block">
                <button className="w-full rounded-lg bg-[#F8D9AE] py-2 font-semibold text-[#262626]">
                    View Details
                </button>
            </Link>
        </div>
    );
}

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

export default function UpcomingElections() {
    const [upcomingEvents, setUpcomingEvents] = useState<EventWithClub[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const eventsData = await getEvents(2, 'UPCOMING');
                setUpcomingEvents(eventsData);
            } catch (error) {
                console.error('Error fetching upcoming events:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    return (
        <div className="mb-4 rounded-2xl bg-[#191B22] p-4 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upcoming Elections</h2>
                <Link href="/user/elections" className="text-lg">
                    See all
                </Link>
            </div>

            {loading ? (
                <div className="flex h-40 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                </div>
            ) : upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {upcomingEvents.slice(0, 2).map(event => (
                        <ElectionCard
                            key={event.id}
                            id={event.id}
                            organization={event.club.name}
                            logo={event.club.image}
                            title={event.title}
                            datetime={format(
                                new Date(event.eventDate),
                                'MMMM d, yyyy | h:mm a'
                            )}
                            eventDate={new Date(event.eventDate)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-xl bg-[#252834] p-6 text-center">
                    <p className="mb-2 text-lg font-semibold">
                        No Upcoming Elections
                    </p>
                    <p className="text-sm text-gray-400">
                        Check back later for new election announcements.
                    </p>
                </div>
            )}
        </div>
    );
}
