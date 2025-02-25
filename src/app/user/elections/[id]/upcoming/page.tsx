'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { getEvent } from '@/actions/event';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    CalendarClock,
    Info,
    CheckCircle2,
    Trophy,
    XCircle,
} from 'lucide-react';
import { use } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

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

interface Candidate {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    studentId: string | null;
    department: string | null;
}

interface EventDetails {
    id: string;
    title: string;
    description: string;
    position: string;
    eventDate: Date;
    status: 'ONGOING' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
    candidateDetails: Candidate[];
    candidates: string[];
    winnerId?: string | null;
    club: {
        id: string;
        name: string;
        members: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}

export default function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEventDetails() {
            try {
                const eventData = await getEvent(resolvedParams.id);
                setEvent(eventData);

                // Redirect based on event status
                if (eventData) {
                    if (eventData.status === 'ONGOING') {
                        // Redirect to voting page if event is ongoing
                        router.push(`/user/elections/${eventData.id}/vote`);
                    } else if (
                        eventData.status === 'COMPLETED' ||
                        eventData.status === 'CANCELLED'
                    ) {
                        // Redirect to results page if event is completed or cancelled
                        router.push(`/user/elections/${eventData.id}/results`);
                    }
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchEventDetails();
    }, [resolvedParams.id, router]);

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto py-8">
                <div className="rounded-xl bg-red-500/10 p-6 text-center">
                    <h2 className="mb-2 text-xl font-semibold text-white">
                        Event Not Found
                    </h2>
                    <p className="mb-4 text-gray-400">
                        The event you&apos;re looking for doesn&apos;t exist or
                        has been removed.
                    </p>
                    <Link href="/user/elections">
                        <button className="rounded-lg bg-[#F8D9AE] px-4 py-2 font-semibold text-[#262626]">
                            Return to Elections
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'UPCOMING':
                return {
                    color: 'bg-blue-500',
                    label: 'Upcoming',
                    icon: <CalendarClock className="mr-1 h-3.5 w-3.5" />,
                };
            case 'ONGOING':
                return {
                    color: 'bg-green-500',
                    label: 'Ongoing',
                    icon: <CheckCircle2 className="mr-1 h-3.5 w-3.5" />,
                };
            case 'COMPLETED':
                return {
                    color: 'bg-purple-500',
                    label: 'Completed',
                    icon: <Trophy className="mr-1 h-3.5 w-3.5" />,
                };
            case 'CANCELLED':
                return {
                    color: 'bg-red-500',
                    label: 'Cancelled',
                    icon: <XCircle className="mr-1 h-3.5 w-3.5" />,
                };
            default:
                return {
                    color: 'bg-gray-500',
                    label: status,
                    icon: null,
                };
        }
    };

    const statusInfo = getStatusInfo(event.status);

    return (
        <div className="container mx-auto space-y-6 pb-8">
            <Link
                href="/user/elections"
                className="inline-flex items-center text-gray-400 hover:text-white"
            >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Elections
            </Link>

            <div className="rounded-xl bg-[#252834] p-6">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {event.title}
                        </h1>
                        <p className="text-gray-400">
                            {event.club.name} • {event.position}
                        </p>
                    </div>
                    <Badge
                        className={`self-start ${statusInfo.color} flex items-center`}
                    >
                        {statusInfo.icon}
                        {statusInfo.label}
                    </Badge>
                </div>

                <div className="mb-6">
                    <p className="mb-2 text-gray-300">{event.description}</p>
                    <p className="text-sm text-[#F8D9AE]">
                        Election Date:{' '}
                        {format(new Date(event.eventDate), 'PPP p')}
                    </p>
                </div>

                {event.status === 'UPCOMING' && (
                    <div className="mb-6 rounded-lg bg-[#191B22] p-4">
                        <h3 className="mb-2 font-semibold text-white">
                            Election starts in:
                        </h3>
                        <CountdownTimer
                            targetDate={new Date(event.eventDate)}
                        />
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="mb-4 text-xl font-semibold text-white">
                        Candidates ({event.candidateDetails.length})
                    </h2>

                    {event.candidateDetails.length === 0 ? (
                        <div className="rounded-xl bg-[#1e2028] p-6 text-center">
                            <p className="text-gray-400">
                                No candidates are available for this election
                                yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {event.candidateDetails.map(candidate => (
                                <div
                                    key={candidate.id}
                                    className="rounded-xl bg-[#1e2028] p-5 transition-all"
                                >
                                    <div className="mb-3 flex items-center gap-3">
                                        <Avatar
                                            src={candidate.image}
                                            alt={candidate.name || 'Candidate'}
                                            fallback={
                                                candidate.name
                                                    ?.split(' ')
                                                    .map(name => name[0])
                                                    .join('') || 'U'
                                            }
                                        />
                                        <div>
                                            <p className="font-medium text-white">
                                                {candidate.name || 'Anonymous'}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {candidate.department ||
                                                    'Department not specified'}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        Student ID:{' '}
                                        {candidate.studentId || 'Not specified'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mb-6 rounded-lg bg-[#1E1F2A] p-4">
                    <div className="mb-3 flex items-center">
                        <Info className="mr-2 h-5 w-5 text-[#F8D9AE]" />
                        <h3 className="font-semibold text-white">
                            How to Vote
                        </h3>
                    </div>
                    <ul className="ml-6 list-disc space-y-2 text-gray-300">
                        <li>
                            You must be a member of{' '}
                            <span className="font-bold">{event.club.name}</span>{' '}
                            club to vote in this election.
                        </li>
                        <li>
                            Voting will be enabled when the election starts.
                        </li>
                        <li>
                            Each member can only vote once for their preferred
                            candidate.
                        </li>
                        <li>
                            The winner will be announced when the election ends.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
