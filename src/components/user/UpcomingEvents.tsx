'use client';

import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
    imageUrl: string;
    imageAlt: string;
    month: string;
    date: string;
    title: string;
    organizer: string;
    venue: string;
}

function EventCard({
    imageUrl,
    imageAlt,
    month,
    date,
    title,
    organizer,
    venue,
}: EventCardProps) {
    return (
        <div className="overflow-hidden rounded-2xl bg-[#252834]">
            <Image
                src={imageUrl}
                alt={imageAlt}
                width={400}
                height={200}
                className="w-full object-cover"
            />
            <div className="p-4">
                <div className="flex items-start gap-4">
                    <div className="rounded bg-blue-100/40 px-4 py-2">
                        <p className="text-sm font-semibold text-[#F0AD4E]">
                            {month}
                        </p>
                        <p className="text-2xl font-semibold text-[#F0AD4E]">
                            {date}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#F0AD4E]">
                            {title}
                        </h3>
                        <p className="text-sm">Organized By: {organizer}</p>
                        <p className="text-sm text-[#FAE6C8]">{venue}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UpcomingEvents() {
    const events = [
        {
            imageUrl: '/images/activity1.jpg',
            imageAlt: 'Hackathon',
            month: 'APR',
            date: '20',
            title: 'Hackathon 2025',
            organizer: 'IT Club',
            venue: 'Auditorium Hall',
        },
        {
            imageUrl: '/images/activity2.jpg',
            imageAlt: 'Cultural Program',
            month: 'MAY',
            date: '15',
            title: 'Cultural Program',
            organizer: 'Cultural Club',
            venue: 'Main Campus Ground',
        },
    ];

    return (
        <div className="rounded-2xl bg-[#191B22] p-4 lg:p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                <Link href="/user/events" className="text-lg">
                    See all
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {events.map((event, index) => (
                    <EventCard key={index} {...event} />
                ))}
            </div>
        </div>
    );
}
