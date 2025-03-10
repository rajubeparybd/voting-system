'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEvent, getVoteResults, updateEventWinner } from '@/actions/event';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Trophy, User2, Mail, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { use } from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

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

interface EventData {
    id: string;
    title: string;
    description: string;
    position: string;
    candidateDetails: Candidate[];
    status: string;
    club: {
        name: string;
    };
    eventDate: Date;
    createdAt: Date;
    updatedAt: Date;
    winnerId?: string | null;
}

export default function SelectWinnerPage({
    params: paramsPromise,
}: {
    params: Promise<{ id: string }>;
}) {
    const params = use(paramsPromise);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
    const [tiedCandidates, setTiedCandidates] = useState<CandidateWithVotes[]>(
        []
    );
    const [event, setEvent] = useState<EventData | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                // Load event data
                const eventData = await getEvent(params.id);
                if (!eventData) {
                    toast.error('Event not found');
                    router.push('/admin/events');
                    return;
                }
                setEvent(eventData);

                // Load vote results
                const voteResults = await getVoteResults(params.id);
                if (!voteResults || !voteResults.results) {
                    toast.error('Failed to load vote results');
                    return;
                }

                // Find tied candidates with highest votes
                const sortedResults = [...voteResults.results].sort(
                    (a, b) => b.votes - a.votes
                );
                const highestVotes = sortedResults[0]?.votes || 0;
                const tiedForFirst = sortedResults.filter(
                    result => result.votes === highestVotes
                );

                setTiedCandidates(tiedForFirst);
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Failed to load event data');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [params.id, router]);

    const handleWinnerConfirmation = () => {
        if (!selectedWinner) {
            toast.error('Please select a winner');
            return;
        }

        // Show confirmation dialog
        setShowConfirmation(true);
    };

    const handleConfirmedSubmit = async () => {
        try {
            setSubmitting(true);
            const result = await updateEventWinner(params.id, selectedWinner!);

            if (result.success) {
                toast.success(
                    'Winner has been selected and event marked as completed'
                );
                router.push(`/admin/events/${params.id}/details`);
            } else {
                toast.error(result.error || 'Failed to update winner');
            }
        } catch (error) {
            console.error('Error selecting winner:', error);
            toast.error('An error occurred while selecting the winner');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Get winner name for confirmation dialog
    const selectedWinnerName = selectedWinner
        ? tiedCandidates.find(c => c.candidate?.id === selectedWinner)
              ?.candidate?.name || 'this candidate'
        : '';

    return (
        <div className="container mx-auto p-6">
            <Button
                variant="outline"
                className="mb-4"
                onClick={() => router.back()}
            >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">
                        Select Winner for {event?.title}
                    </CardTitle>
                    <CardDescription>
                        Multiple candidates have tied for the highest number of
                        votes. Please select one candidate as the winner.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {tiedCandidates.length > 0 ? (
                        <>
                            <div className="mb-6 text-center">
                                <Trophy className="mx-auto h-10 w-10 text-yellow-500" />
                                <p className="mt-2 text-white">
                                    These candidates tied with{' '}
                                    {tiedCandidates[0]?.votes || 0} votes each
                                </p>
                            </div>

                            <RadioGroup
                                value={selectedWinner || ''}
                                onValueChange={setSelectedWinner}
                                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {tiedCandidates.map(candidate => (
                                    <div
                                        key={candidate.candidate?.id}
                                        className={`relative flex transform cursor-pointer flex-col rounded-lg border p-4 transition-all ${
                                            selectedWinner ===
                                            candidate.candidate?.id
                                                ? 'scale-[1.02] border-blue-600 bg-gray-800 shadow-lg'
                                                : 'border-gray-800 hover:scale-[1.01] hover:bg-gray-800'
                                        }`}
                                        onClick={() =>
                                            setSelectedWinner(
                                                candidate.candidate?.id || ''
                                            )
                                        }
                                    >
                                        {selectedWinner ===
                                            candidate.candidate?.id && (
                                            <div className="absolute top-2 right-2">
                                                <Trophy className="h-5 w-5 text-yellow-500" />
                                            </div>
                                        )}
                                        <div className="mb-3 flex items-center space-x-3">
                                            {candidate.candidate?.image ? (
                                                <Image
                                                    src={
                                                        candidate.candidate
                                                            .image
                                                    }
                                                    alt={
                                                        candidate.candidate
                                                            .name || 'Candidate'
                                                    }
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700">
                                                    <User2 className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-base font-medium text-white">
                                                    {candidate.candidate
                                                        ?.name ||
                                                        'Unknown Candidate'}
                                                </span>
                                                <span className="mt-1 inline-block w-fit rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
                                                    {candidate.votes} votes
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-2 text-sm text-gray-400">
                                            {candidate.candidate?.studentId && (
                                                <div className="flex items-center space-x-1">
                                                    <span>
                                                        ID:{' '}
                                                        {
                                                            candidate.candidate
                                                                .studentId
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {candidate.candidate
                                                ?.department && (
                                                <div className="flex items-center space-x-1">
                                                    <span>
                                                        {
                                                            candidate.candidate
                                                                .department
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {candidate.candidate?.email && (
                                                <div className="flex items-center space-x-1">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">
                                                        {
                                                            candidate.candidate
                                                                .email
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-auto flex items-center pt-2">
                                            <RadioGroupItem
                                                value={
                                                    candidate.candidate?.id ||
                                                    ''
                                                }
                                                id={
                                                    candidate.candidate?.id ||
                                                    ''
                                                }
                                                checked={
                                                    selectedWinner ===
                                                    candidate.candidate?.id
                                                }
                                                className="pointer-events-none"
                                            />
                                            <Label
                                                htmlFor={
                                                    candidate.candidate?.id ||
                                                    ''
                                                }
                                                className={`ml-2 cursor-pointer ${
                                                    selectedWinner ===
                                                    candidate.candidate?.id
                                                        ? 'font-medium text-blue-400'
                                                        : ''
                                                }`}
                                            >
                                                Select as winner
                                            </Label>
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>

                            <div className="mt-8 flex justify-end">
                                <Button
                                    onClick={handleWinnerConfirmation}
                                    disabled={!selectedWinner || submitting}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {submitting
                                        ? 'Confirming...'
                                        : 'Confirm Winner'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-lg text-white">
                                No tied candidates found.
                            </p>
                            <Button
                                className="mt-4 bg-blue-600 hover:bg-blue-700"
                                onClick={() =>
                                    router.push(
                                        `/admin/events/${params.id}/details`
                                    )
                                }
                            >
                                Return to Event Details
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleConfirmedSubmit}
                title="Confirm Winner Selection"
                description={
                    <div className="space-y-4 py-2">
                        <p>
                            Are you sure you want to select{' '}
                            <span className="font-bold text-blue-400">
                                {selectedWinnerName}
                            </span>{' '}
                            as the winner?
                        </p>
                        <div className="rounded-md bg-yellow-800/30 p-3 text-yellow-200">
                            <p className="flex items-center">
                                <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>
                                    Once confirmed, the event will be marked as{' '}
                                    <span className="font-bold text-yellow-300">
                                        COMPLETED
                                    </span>{' '}
                                    and this action cannot be undone.
                                </span>
                            </p>
                        </div>
                    </div>
                }
                confirmText="Confirm Winner"
                cancelText="Cancel"
                confirmVariant="default"
                icon={<Trophy className="h-12 w-12 text-blue-400" />}
            />
        </div>
    );
}
