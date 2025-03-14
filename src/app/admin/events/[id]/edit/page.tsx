'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventSchema, type EventFormValues } from '@/validation/event';
import {
    getEvent,
    updateEvent,
    getApprovedCandidates,
    getClubsWithClosedNominations,
    getClosedNominationsByClub,
} from '@/actions/event';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cache } from 'react';
import { use } from 'react';

interface CandidateUser {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    studentId: string | null;
    department: string | null;
}

interface Club {
    id: string;
    name: string;
}

interface Position {
    id: string;
    position: string;
}

// Cache the getEvent function to prevent multiple calls
const getCachedEvent = cache(async (id: string) => {
    return await getEvent(id);
});

export default function EditEventPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Use the React.use hook to unwrap the params promise
    const resolvedParams = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableCandidates, setAvailableCandidates] = useState<
        CandidateUser[]
    >([]);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [selectedClubId, setSelectedClubId] = useState<string>('');
    const [selectedPositionId, setSelectedPositionId] = useState<string>('');

    const form = useForm<EventFormValues>({
        resolver: zodResolver(EventSchema),
        defaultValues: {
            clubId: '',
            position: '',
            title: '',
            description: '',
            candidates: [],
            eventDate: '',
            status: 'UPCOMING',
        },
    });

    // Fetch event data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventData = await getCachedEvent(resolvedParams.id);
                if (!eventData) {
                    toast.error('Event not found');
                    router.push('/admin/events');
                    return;
                }

                // Load available clubs with closed nominations
                const clubsData = await getClubsWithClosedNominations();
                setClubs(clubsData);

                // Format date for datetime-local input
                const eventDate = new Date(eventData.eventDate);
                const formattedDate =
                    eventDate instanceof Date && !isNaN(eventDate.getTime())
                        ? eventDate.toISOString().slice(0, 16)
                        : '';

                // Set the form values
                form.reset({
                    clubId: eventData.clubId,
                    position: eventData.position,
                    title: eventData.title,
                    description: eventData.description,
                    candidates: eventData.candidates,
                    eventDate: formattedDate,
                    status: eventData.status,
                });

                setSelectedClubId(eventData.clubId);

                // For position, we need to find the matching nomination ID that corresponds to this position
                const positionsData = await getClosedNominationsByClub(
                    eventData.clubId
                );
                setPositions(positionsData);

                // Find the nomination that matches the position name from the event
                const matchingPosition = positionsData.find(
                    pos => pos.position === eventData.position
                );

                if (matchingPosition) {
                    setSelectedPositionId(matchingPosition.id);
                } else {
                    console.warn(
                        'Could not find matching position ID for:',
                        eventData.position
                    );
                    // If we can't find it, at least display the text correctly
                    setSelectedPositionId(eventData.position);
                }

                // Load candidates with error handling but don't redirect on failure
                try {
                    // If real nominationId is needed, use the position ID from getClosedNominationsByClub
                    const candidatesData = eventData.candidateDetails || [];
                    setAvailableCandidates(candidatesData);
                } catch (candidateError) {
                    console.error(
                        'Failed to fetch candidates:',
                        candidateError
                    );
                    toast.error(
                        'Failed to load candidates. Some editing options may be limited.'
                    );
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch event:', error);
                toast.error('Failed to load event data');
                router.push('/admin/events');
            }
        };

        fetchEvent();
    }, [resolvedParams.id, router, form]);

    // When club changes, fetch positions
    useEffect(() => {
        const fetchPositions = async () => {
            if (!selectedClubId) return;

            try {
                const positionsData =
                    await getClosedNominationsByClub(selectedClubId);
                setPositions(positionsData);

                // Reset position selection
                if (form.getValues().clubId !== selectedClubId) {
                    form.setValue('position', '');
                    setSelectedPositionId('');
                    setAvailableCandidates([]);
                }

                form.setValue('clubId', selectedClubId);
            } catch (error) {
                console.error('Failed to fetch positions:', error);
                toast.error('Failed to load positions');
            }
        };

        fetchPositions();
    }, [selectedClubId, form]);

    // When position changes, try to fetch candidates with fallback to empty array
    useEffect(() => {
        const fetchCandidates = async () => {
            if (!selectedPositionId) return;

            try {
                // Try to find the matching position in the positions array to get the nomination ID
                const positionItem = positions.find(
                    p => p.id === selectedPositionId
                );

                if (positionItem) {
                    try {
                        const candidatesData = await getApprovedCandidates(
                            positionItem.id
                        );
                        setAvailableCandidates(candidatesData);

                        // Set the position name in the form
                        form.setValue('position', positionItem.position);
                    } catch (error) {
                        console.error('Failed to fetch candidates:', error);
                        toast.error('Failed to load candidates');
                        // Use empty array as fallback
                        setAvailableCandidates([]);
                    }
                }
            } catch (error) {
                console.error('Error in position change handler:', error);
                toast.error('Error processing position selection');
            }
        };

        fetchCandidates();
    }, [selectedPositionId, form, positions]);

    async function onSubmit(data: EventFormValues) {
        try {
            setIsSubmitting(true);

            // Ensure we're saving the position name, not the ID
            const position = positions.find(
                p => p.id === selectedPositionId
            )?.position;
            if (position) {
                data.position = position;
            }

            await updateEvent(resolvedParams.id, data);
            toast.success('Event updated successfully');
            router.push('/admin/events');
        } catch (error) {
            toast.error('Failed to update event');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="flex h-64 items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                        <p className="text-gray-400">Loading event...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <Button
                variant="ghost"
                className="mb-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                onClick={() => router.push('/admin/events')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>

            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-white">
                    Edit Event
                </h1>
                <p className="text-gray-400">
                    Update the event details and candidates
                </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="clubId"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-white">
                                            Club
                                        </FormLabel>
                                        <div className="relative">
                                            <div className="flex h-10 w-full rounded-md border border-gray-900 bg-gray-900 px-3 py-2 text-gray-200">
                                                {clubs.find(
                                                    c => c.id === selectedClubId
                                                )?.name || 'Club not found'}
                                            </div>
                                            <input
                                                type="hidden"
                                                {...form.register('clubId')}
                                            />
                                        </div>
                                        <FormDescription className="text-gray-400">
                                            Club selection is disabled while
                                            editing
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="position"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-white">
                                            Position
                                        </FormLabel>
                                        <div className="relative">
                                            <div className="flex h-10 w-full rounded-md border border-gray-900 bg-gray-900 px-3 py-2 text-gray-200">
                                                {positions.find(
                                                    p =>
                                                        p.id ===
                                                        selectedPositionId
                                                )?.position ||
                                                    form.getValues().position}
                                            </div>
                                            <input
                                                type="hidden"
                                                {...form.register('position')}
                                            />
                                        </div>
                                        <FormDescription className="text-gray-400">
                                            Position selection is disabled while
                                            editing
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">
                                            Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter event title"
                                                className="border-gray-700 bg-gray-700 text-gray-200"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="eventDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">
                                            Event Date
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                className="border-gray-700 bg-gray-700 text-gray-200"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter event description"
                                            className="min-h-[120px] border-gray-700 bg-gray-700 text-gray-200"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="candidates"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-white">
                                        Select Candidates
                                    </FormLabel>
                                    <div className="space-y-2">
                                        {!selectedPositionId ? (
                                            <div className="rounded-md border border-gray-700 bg-gray-900 p-4 text-center text-gray-400">
                                                Select a position to view
                                                candidates
                                            </div>
                                        ) : availableCandidates.length === 0 ? (
                                            <div className="rounded-md border border-gray-700 bg-gray-900 p-4 text-center text-gray-400">
                                                No approved candidates found for
                                                this position
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                                                {availableCandidates.map(
                                                    candidate => (
                                                        <div
                                                            key={candidate.id}
                                                            className={`flex cursor-pointer items-center justify-between rounded-md border p-3 ${
                                                                form
                                                                    .getValues()
                                                                    .candidates.includes(
                                                                        candidate.id
                                                                    )
                                                                    ? 'border-indigo-600 bg-indigo-900/20'
                                                                    : 'border-gray-700 bg-gray-900'
                                                            }`}
                                                            onClick={() => {
                                                                const currentValue =
                                                                    [
                                                                        ...(form.getValues()
                                                                            .candidates ||
                                                                            []),
                                                                    ];
                                                                const newValue =
                                                                    currentValue.includes(
                                                                        candidate.id
                                                                    )
                                                                        ? currentValue.filter(
                                                                              id =>
                                                                                  id !==
                                                                                  candidate.id
                                                                          )
                                                                        : [
                                                                              ...currentValue,
                                                                              candidate.id,
                                                                          ];
                                                                form.setValue(
                                                                    'candidates',
                                                                    newValue
                                                                );
                                                            }}
                                                        >
                                                            <div>
                                                                <div className="font-medium text-white">
                                                                    {candidate.name ||
                                                                        'Unknown'}
                                                                </div>
                                                                <div className="text-sm text-gray-400">
                                                                    {candidate.studentId ||
                                                                        'No ID'}{' '}
                                                                    |{' '}
                                                                    {candidate.department ||
                                                                        'No Department'}{' '}
                                                                    |{' '}
                                                                    {candidate.email ||
                                                                        'No Email'}
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`h-5 w-5 rounded-full border ${
                                                                    form
                                                                        .getValues()
                                                                        .candidates.includes(
                                                                            candidate.id
                                                                        )
                                                                        ? 'border-indigo-600 bg-indigo-600'
                                                                        : 'border-gray-600'
                                                                }`}
                                                            >
                                                                {form
                                                                    .getValues()
                                                                    .candidates.includes(
                                                                        candidate.id
                                                                    ) && (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-full w-full text-white"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <FormDescription className="text-gray-400">
                                        Select one or more approved candidates
                                        for the event
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">
                                        Status
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="border-gray-700 bg-gray-700 text-gray-200">
                                                <SelectValue placeholder="Select event status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                                            <SelectItem value="UPCOMING">
                                                Upcoming
                                            </SelectItem>
                                            <SelectItem value="ONGOING">
                                                Ongoing
                                            </SelectItem>
                                            <SelectItem value="COMPLETED">
                                                Completed
                                            </SelectItem>
                                            <SelectItem value="CANCELLED">
                                                Cancelled
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
                                onClick={() => router.push('/admin/events')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
