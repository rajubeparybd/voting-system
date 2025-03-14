'use client';

import { useEffect, useState } from 'react';
import { getEvent, getVoteResults, hasUserVoted } from '@/actions/event';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import {
    User2,
    Trophy,
    AlertCircle,
    CalendarClock,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Candidate {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    studentId: string | null;
    department: string | null;
}

interface CandidateWithVotes {
    candidate: Candidate | null;
    votes: number;
    percentage?: number;
}

interface VoteResults {
    results: CandidateWithVotes[];
    totalVotes: number;
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
    const router = useRouter();
    const { data: session, status } = useSession();
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [voteResults, setVoteResults] = useState<VoteResults | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const [accessChecked, setAccessChecked] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session?.user) {
            router.push('/auth/signin');
            return;
        }

        async function checkAccess() {
            try {
                if (!session?.user?.id) return;

                // Check if the user has voted in this event
                const userVoted = await hasUserVoted(
                    resolvedParams.id,
                    session.user.id
                );
                setHasVoted(userVoted);
                setAccessChecked(true);
            } catch (error) {
                console.error('Error checking if user has voted:', error);
                // Allow access even if check fails (fallback)
                setHasVoted(true);
                setAccessChecked(true);
            }
        }

        async function fetchData() {
            if (!session?.user?.id) return;

            try {
                const eventData = await getEvent(resolvedParams.id);
                setEvent(eventData as EventDetails);

                if (eventData) {
                    try {
                        const results = (await getVoteResults(
                            resolvedParams.id
                        )) as VoteResults;

                        // Calculate percentage for each candidate
                        if (results && results.results) {
                            const resultsWithPercentage = results.results.map(
                                result => ({
                                    ...result,
                                    percentage:
                                        results.totalVotes > 0
                                            ? Math.round(
                                                  (result.votes /
                                                      results.totalVotes) *
                                                      100
                                              )
                                            : 0,
                                })
                            );

                            setVoteResults({
                                ...results,
                                results: resultsWithPercentage,
                            });
                        }
                    } catch (voteError) {
                        console.error(
                            'Error fetching vote results:',
                            voteError
                        );
                    }
                }
            } catch (err) {
                console.error('Error fetching event:', err);
                setErrorMessage('Failed to load event data');
            } finally {
                setLoading(false);
            }
        }

        checkAccess();
        fetchData();
    }, [resolvedParams.id, router, session, status]);

    // Render loading state
    if (loading) {
        return (
            <Card className="bg-gray-900">
                <CardContent className="flex items-center justify-center p-12">
                    <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-gray-800"></div>
                </CardContent>
            </Card>
        );
    }

    // If user hasn't voted, show access denied message
    if (accessChecked && !hasVoted && event) {
        return (
            <Card className="bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Access Denied
                    </CardTitle>
                    <CardDescription>
                        You need to vote in this election before viewing the
                        results.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
                    <AlertCircle className="h-16 w-16 text-yellow-500" />
                    <p className="text-center text-lg font-medium">
                        Please cast your vote to see the results
                    </p>
                    <Link
                        href={`/user/elections/${resolvedParams.id}/vote`}
                        className="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Go to Voting Page
                    </Link>
                </CardContent>
            </Card>
        );
    }

    // If event not found
    if (!event) {
        return (
            <Card className="bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Election Results
                    </CardTitle>
                    <CardDescription>
                        {errorMessage || 'Event not found'}
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // Format the event date for display
    const formattedEventDate = format(new Date(event.eventDate), 'PPP');

    // Get status badge color and icon
    const getStatusBadge = (status: string) => {
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

    const statusInfo = getStatusBadge(event.status);

    return (
        <Card className="bg-gray-900">
            <CardHeader>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <CardTitle className="text-xl font-bold">
                        {event.title} - Results
                    </CardTitle>
                    <Badge
                        className={`flex items-center ${statusInfo.color} px-3 py-1 text-xs`}
                    >
                        {statusInfo.icon}
                        {statusInfo.label}
                    </Badge>
                </div>
                <CardDescription>{event.description}</CardDescription>
                <CardDescription>
                    <p className="mt-2 text-sm">
                        Election Date: {formattedEventDate}
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Display status-specific messages */}
                {event.status === 'UPCOMING' && (
                    <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center">
                        <CalendarClock className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                        <p className="text-lg font-semibold text-blue-700">
                            This election hasn&apos;t started yet
                        </p>
                        <p className="text-sm text-blue-600">
                            Results will be available once voting begins.
                        </p>
                    </div>
                )}

                {event.status === 'CANCELLED' && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-center">
                        <XCircle className="mx-auto mb-2 h-8 w-8 text-red-600" />
                        <p className="text-lg font-semibold text-red-700">
                            This election has been cancelled
                        </p>
                        <p className="text-sm text-red-600">
                            Election results are not available.
                        </p>
                    </div>
                )}

                {event.status === 'UPCOMING' ? (
                    <div className="p-6 text-center">
                        <p className="text-lg font-semibold">
                            Voting hasn&apos;t started yet.
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Results will be available once the voting period
                            begins.
                        </p>
                    </div>
                ) : voteResults ? (
                    <div className="space-y-6">
                        {/* Show victory trophy for completed elections */}
                        {event.status === 'COMPLETED' &&
                            voteResults.results.length > 0 && (
                                <div className="mb-6 flex flex-col items-center justify-center">
                                    <Trophy className="mb-2 h-16 w-16 text-yellow-500" />
                                    <p className="text-xl font-bold">
                                        Election Results Finalized
                                    </p>
                                    {voteResults.results[0]?.candidate && (
                                        <div className="mt-2 rounded-lg bg-yellow-50 p-3 text-center">
                                            <p className="text-sm text-yellow-700">
                                                Winner:{' '}
                                                <span className="font-bold">
                                                    {
                                                        voteResults.results[0]
                                                            .candidate.name
                                                    }
                                                </span>
                                            </p>
                                            <p className="text-xs text-yellow-600">
                                                with{' '}
                                                {voteResults.results[0].votes}{' '}
                                                votes (
                                                {
                                                    voteResults.results[0]
                                                        .percentage
                                                }
                                                %)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                        <div className="mb-6 text-center">
                            <p className="text-lg">
                                Total Votes:{' '}
                                <span className="font-bold">
                                    {voteResults.totalVotes}
                                </span>
                            </p>
                        </div>

                        {voteResults.results.length > 0 ? (
                            <div className="space-y-4">
                                {voteResults.results.map((result, index) => (
                                    <div
                                        key={result.candidate?.id || index}
                                        className="relative"
                                    >
                                        <div className="mb-1 flex items-center gap-3">
                                            <div className="relative">
                                                {result.candidate?.image ? (
                                                    <Image
                                                        src={
                                                            result.candidate
                                                                .image
                                                        }
                                                        alt={
                                                            result.candidate
                                                                .name ||
                                                            'Candidate'
                                                        }
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                                                        <User2 className="h-6 w-6 text-gray-500" />
                                                    </div>
                                                )}
                                                {/* Show trophy for the winner in completed elections */}
                                                {index === 0 &&
                                                    event.status ===
                                                        'COMPLETED' && (
                                                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500">
                                                            <Trophy className="h-3.5 w-3.5 text-white" />
                                                        </div>
                                                    )}
                                                {/* Show position number for ongoing elections */}
                                                {index === 0 &&
                                                    event.status ===
                                                        'ONGOING' &&
                                                    voteResults.totalVotes >
                                                        0 && (
                                                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                                                            <span className="text-xs font-bold text-white">
                                                                1
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    {result.candidate?.name ||
                                                        'Unknown Candidate'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {result.candidate
                                                        ?.department || ''}
                                                </p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="font-bold">
                                                    {result.votes} votes
                                                </p>
                                                <p className="text-sm">
                                                    {result.percentage}%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
                                            <div
                                                className={`h-2.5 rounded-full ${index === 0 && event.status === 'COMPLETED' ? 'bg-yellow-500' : 'bg-blue-600'}`}
                                                style={{
                                                    width: `${result.percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-lg font-semibold">
                                    No votes have been cast yet.
                                </p>
                            </div>
                        )}

                        {event.status === 'COMPLETED' && (
                            <div className="mt-8 rounded-lg bg-green-50 p-4 text-center">
                                <Trophy className="mx-auto mb-2 h-8 w-8 text-green-600" />
                                <p className="text-lg font-semibold text-green-700">
                                    This election has ended.
                                </p>
                                <p className="mt-1 text-sm text-green-600">
                                    Final results are displayed above.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-6 text-center">
                        <p className="text-lg font-semibold">
                            Loading results...
                        </p>
                    </div>
                )}

                <div className="mt-6 flex justify-center">
                    <Link
                        href="/user/elections"
                        className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
                    >
                        Back to Elections
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
