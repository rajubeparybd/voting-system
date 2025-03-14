'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEvent, submitVote, hasUserVoted } from '@/actions/event';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { use } from 'react';

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
    club: {
        name: string;
    };
}

export default function VotePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { data: session, status } = useSession();
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
        null
    );
    const [voteSuccess, setVoteSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasAlreadyVoted, setHasAlreadyVoted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEventDetails() {
            try {
                if (status === 'loading') {
                    return;
                }

                if (!session?.user?.id) {
                    router.push('/auth/signin');
                    return;
                }

                const eventData = await getEvent(resolvedParams.id);
                setEvent(eventData as EventDetails);

                // Check if user has already voted
                try {
                    const userVoted = await hasUserVoted(
                        resolvedParams.id,
                        session.user.id
                    );
                    setHasAlreadyVoted(userVoted);

                    if (userVoted) {
                        setError('You have already voted in this election');
                    }
                } catch (checkError) {
                    console.error('Error checking vote status:', checkError);
                    // Continue showing the voting interface even if check fails
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
                setError('Failed to load event details');
            } finally {
                setLoading(false);
            }
        }

        fetchEventDetails();
    }, [resolvedParams.id, router, session, status]);

    const handleVote = async () => {
        if (!selectedCandidate) {
            setError('Please select a candidate to vote');
            return;
        }

        if (!event || !session?.user?.id) {
            setError('Session expired or event not found');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSaveError(null);

        try {
            const result = await submitVote(
                event.id,
                selectedCandidate,
                session.user.id
            );

            if (result.success) {
                setHasAlreadyVoted(true);
                setVoteSuccess(true);

                // Show success message for 2 seconds before redirecting
                setTimeout(() => {
                    router.push(`/user/elections/${event.id}/results`);
                }, 2000);
            } else {
                if (result.error?.includes('already voted')) {
                    setHasAlreadyVoted(true);
                } else {
                    setSaveError(
                        result.error ||
                            'Failed to submit vote. Please try again.'
                    );
                }
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
            // Handle specific error when the Vote model is not available
            if (
                error instanceof Error &&
                error.message.includes('Vote model')
            ) {
                setSaveError(
                    'The voting system is currently being updated. Please try again in a few minutes.'
                );
            } else if (
                error instanceof Error &&
                error.message.includes('already voted')
            ) {
                setHasAlreadyVoted(true);
            } else {
                setSaveError(
                    'An unexpected error occurred. Please try again later.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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

    if (event.status !== 'ONGOING') {
        return (
            <div className="container mx-auto py-8">
                <div className="rounded-xl bg-yellow-500/10 p-6 text-center">
                    <h2 className="mb-2 text-xl font-semibold text-white">
                        Voting Not Available
                    </h2>
                    <p className="mb-4 text-gray-400">
                        {event.status === 'UPCOMING'
                            ? 'This election has not started yet.'
                            : event.status === 'COMPLETED'
                              ? 'This election has already ended.'
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

    if (hasAlreadyVoted) {
        return (
            <div className="container mx-auto py-8">
                <div className="rounded-xl bg-blue-500/10 p-6 text-center">
                    <h2 className="mb-2 text-xl font-semibold text-white">
                        You&apos;ve Already Voted
                    </h2>
                    <p className="mb-4 text-gray-400">
                        You have already cast your vote in this election. Each
                        user can only vote once.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <Link href={`/user/elections/${event.id}/results`}>
                            <button className="rounded-lg bg-[#F8D9AE] px-4 py-2 font-semibold text-[#262626]">
                                View Results
                            </button>
                        </Link>
                        <Link href="/user/elections">
                            <button className="rounded-lg border border-gray-600 px-4 py-2 font-semibold text-gray-300 hover:bg-gray-800">
                                Return to Elections
                            </button>
                        </Link>
                    </div>
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
                    <Badge className="self-start bg-green-500">ONGOING</Badge>
                </div>

                <div className="mb-6">
                    <p className="mb-2 text-gray-300">{event.description}</p>
                    <p className="text-sm text-[#F8D9AE]">
                        Election Date:{' '}
                        {format(new Date(event.eventDate), 'PPP p')}
                    </p>
                </div>
            </div>

            {voteSuccess ? (
                <div className="rounded-xl bg-green-500/10 p-8 text-center">
                    <div className="mb-4 text-5xl">🎉</div>
                    <h2 className="mb-2 text-xl font-semibold text-white">
                        Vote Submitted Successfully!
                    </h2>
                    <p className="text-gray-400">
                        Thank you for participating in this election. You will
                        be redirected to the results page shortly.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">
                        Select a Candidate
                    </h2>

                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-400">
                            <AlertCircle className="h-5 w-5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {saveError && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-400">
                            <AlertCircle className="h-5 w-5" />
                            <p>{saveError}</p>
                        </div>
                    )}

                    {event.candidateDetails.length === 0 ? (
                        <div className="rounded-xl bg-[#1e2028] p-6 text-center">
                            <p className="text-gray-400">
                                No candidates are available for this election.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {event.candidateDetails.map(candidate => (
                                <div
                                    key={candidate.id}
                                    className={`cursor-pointer rounded-xl p-5 transition-all ${
                                        selectedCandidate === candidate.id
                                            ? 'bg-[#353948] shadow-lg'
                                            : 'bg-[#1e2028] hover:bg-[#252834]'
                                    }`}
                                    onClick={() =>
                                        setSelectedCandidate(candidate.id)
                                    }
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <Avatar
                                                src={candidate.image}
                                                alt={candidate.name || ''}
                                                className="h-14 w-14 border-2 border-gray-700"
                                                fallback={
                                                    candidate.name
                                                        ? candidate.name
                                                              .split(' ')
                                                              .map(n => n[0])
                                                              .join('')
                                                              .toUpperCase()
                                                        : '?'
                                                }
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-semibold text-white">
                                                    {candidate.name}
                                                </h3>
                                                {selectedCandidate ===
                                                    candidate.id && (
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F8D9AE]">
                                                        <Check className="h-3 w-3 text-[#262626]" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center text-xs text-gray-500">
                                                <span className="mr-2">
                                                    ID:{' '}
                                                    {candidate.studentId ||
                                                        'Not available'}
                                                </span>
                                                <span className="text-gray-600">
                                                    •
                                                </span>
                                                <span className="ml-2">
                                                    {candidate.department ||
                                                        'Department not specified'}
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-400">
                                                {candidate.email ||
                                                    'Email not available'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div
                                            className={`flex items-center justify-center rounded-lg py-2 text-sm font-medium ${
                                                selectedCandidate ===
                                                candidate.id
                                                    ? 'bg-[#F8D9AE] text-[#262626]'
                                                    : 'border border-gray-700 text-gray-400'
                                            }`}
                                        >
                                            {selectedCandidate === candidate.id
                                                ? 'Selected'
                                                : 'Select this candidate'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center pt-4">
                        <button
                            className={`rounded-lg px-8 py-3 font-semibold transition-colors ${
                                selectedCandidate &&
                                !error &&
                                !saveError &&
                                !isSubmitting
                                    ? 'bg-[#F8D9AE] text-[#262626] hover:bg-[#f0c48b]'
                                    : 'cursor-not-allowed bg-gray-700 text-gray-400'
                            }`}
                            disabled={
                                !selectedCandidate ||
                                !!error ||
                                !!saveError ||
                                isSubmitting
                            }
                            onClick={handleVote}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
