'use client';

import { useEffect, useState } from 'react';
import { getEvent } from '@/actions/event';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { use } from 'react';

interface Candidate {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    studentId: string | null;
    department: string | null;
    // This would come from your actual API
    votes?: number;
}

interface EventDetails {
    id: string;
    title: string;
    description: string;
    position: string;
    eventDate: Date;
    status: 'ONGOING' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
    candidateDetails: Candidate[];
    club: {
        name: string;
    };
}

export default function ResultsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [totalVotes, setTotalVotes] = useState(0);

    useEffect(() => {
        async function fetchEventDetails() {
            try {
                const eventData = await getEvent(resolvedParams.id);
                setEvent(eventData as EventDetails);

                // Simulate vote data for demonstration purposes
                // In a real app, you would fetch this from your API
                if (eventData) {
                    const mockCandidates = eventData.candidateDetails.map(
                        candidate => {
                            return {
                                ...candidate,
                                votes: Math.floor(Math.random() * 100) + 1,
                            };
                        }
                    );

                    // Sort by votes (descending)
                    mockCandidates.sort(
                        (a, b) => (b.votes || 0) - (a.votes || 0)
                    );

                    setCandidates(mockCandidates);
                    setTotalVotes(
                        mockCandidates.reduce(
                            (sum, candidate) => sum + (candidate.votes || 0),
                            0
                        )
                    );
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchEventDetails();
    }, [resolvedParams.id]);

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

    if (event.status !== 'COMPLETED') {
        return (
            <div className="container mx-auto py-8">
                <div className="rounded-xl bg-yellow-500/10 p-6 text-center">
                    <h2 className="mb-2 text-xl font-semibold text-white">
                        Results Not Available
                    </h2>
                    <p className="mb-4 text-gray-400">
                        {event.status === 'UPCOMING'
                            ? 'This election has not started yet.'
                            : event.status === 'ONGOING'
                              ? 'This election is still ongoing.'
                              : 'This election has been cancelled.'}
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
                    <Badge className="self-start bg-gray-500">COMPLETED</Badge>
                </div>

                <div className="mb-6">
                    <p className="mb-2 text-gray-300">{event.description}</p>
                    <p className="text-sm text-[#F8D9AE]">
                        Election Date:{' '}
                        {format(new Date(event.eventDate), 'PPP p')}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                        Election Results
                    </h2>
                    <p className="text-sm text-gray-400">
                        Total Votes: {totalVotes}
                    </p>
                </div>

                {candidates.length === 0 ? (
                    <div className="rounded-xl bg-[#1e2028] p-6 text-center">
                        <p className="text-gray-400">
                            No candidates were available for this election.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {candidates.map((candidate, index) => {
                            const votePercent =
                                totalVotes > 0
                                    ? ((candidate.votes || 0) / totalVotes) *
                                      100
                                    : 0;

                            return (
                                <div
                                    key={candidate.id}
                                    className={`rounded-xl ${index === 0 ? 'bg-[#2d2a20]' : 'bg-[#1e2028]'} p-4`}
                                >
                                    <div className="mb-3 flex items-center gap-3">
                                        {index === 0 && (
                                            <div className="rounded-full bg-[#F8D9AE] p-2 text-xl text-[#262626]">
                                                👑
                                            </div>
                                        )}
                                        <div className="h-12 w-12 overflow-hidden rounded-full">
                                            {candidate.image ? (
                                                <Image
                                                    src={candidate.image}
                                                    alt={
                                                        candidate.name ||
                                                        'Candidate'
                                                    }
                                                    width={48}
                                                    height={48}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-blue-500 text-xl font-bold text-white">
                                                    {candidate.name?.charAt(
                                                        0
                                                    ) || '?'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-white">
                                                    {candidate.name}
                                                </h3>
                                                <div className="text-right">
                                                    <span className="font-semibold text-[#F8D9AE]">
                                                        {candidate.votes}
                                                    </span>
                                                    <span className="ml-1 text-sm text-gray-400">
                                                        votes
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 w-full overflow-hidden rounded-full bg-gray-700">
                                                <div
                                                    className={`h-2 ${index === 0 ? 'bg-[#F8D9AE]' : 'bg-blue-500'}`}
                                                    style={{
                                                        width: `${votePercent}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-1 flex justify-between text-xs">
                                                <span className="text-gray-400">
                                                    {candidate.department ||
                                                        'Department not specified'}
                                                </span>
                                                <span className="text-gray-400">
                                                    {votePercent.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
