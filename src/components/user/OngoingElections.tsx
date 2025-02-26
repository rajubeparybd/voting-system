'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getEvents } from '@/actions/event';
import { format } from 'date-fns';

interface ElectionCardProps {
    id: string;
    organization: string;
    logo: string;
    title: string;
    datetime: string;
    position: string;
}

function ElectionCard({
    id,
    organization,
    logo,
    title,
    datetime,
    position,
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
            <p className="mb-2 text-sm text-gray-300">Position: {position}</p>
            <p className="mb-4 text-sm text-[#F8D9AE]">{datetime}</p>

            <Link href={`/user/elections/${id}/vote`} className="block">
                <button className="w-full rounded-lg bg-[#F8D9AE] py-2 font-semibold text-[#262626] transition-colors hover:bg-[#f0c48b]">
                    Vote Now
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

export default function OngoingElections() {
    const [ongoingEvents, setOngoingEvents] = useState<EventWithClub[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const eventsData = await getEvents(2, 'ONGOING');
                setOngoingEvents(eventsData);
            } catch (error) {
                console.error('Error fetching ongoing events:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    // Don't render anything if there are no ongoing events and loading is complete
    if (!loading && ongoingEvents.length === 0) {
        return null;
    }

    return (
        <div className="mb-4 rounded-2xl bg-[#191B22] p-4 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="mr-2 h-3 w-3 rounded-full bg-green-500"></span>
                    <h2 className="text-xl font-semibold">Ongoing Elections</h2>
                </div>
                <Link href="/user/elections" className="text-lg">
                    See all
                </Link>
            </div>

            {loading ? (
                <div className="flex h-40 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
                    {ongoingEvents.map(event => (
                        <ElectionCard
                            key={event.id}
                            id={event.id}
                            organization={event.club.name}
                            logo={event.club.image}
                            title={event.title}
                            position={event.position}
                            datetime={format(
                                new Date(event.eventDate),
                                'MMMM d, yyyy | h:mm a'
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
