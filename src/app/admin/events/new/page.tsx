'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventSchema, EventFormValues } from '@/validation/event';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
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
import { ArrowLeft } from 'lucide-react';
import {
    getClubsWithClosedNominations,
    getClosedNominationsByClub,
    getApprovedCandidates,
    createEvent,
} from '@/actions/event';

interface Club {
    id: string;
    name: string;
}

interface Nomination {
    id: string;
    position: string;
}

interface Candidate {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    studentId?: string | null;
    department?: string | null;
}

export default function CreateEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [nominations, setNominations] = useState<Nomination[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedClub, setSelectedClub] = useState<string>('');
    const [selectedNomination, setSelectedNomination] = useState<string>('');
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

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

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                setLoading(true);
                const clubsData = await getClubsWithClosedNominations();
                setClubs(clubsData);
            } catch (error) {
                console.error('Failed to fetch clubs:', error);
                toast.error('Failed to load clubs with closed nominations');
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const handleClubChange = async (clubId: string) => {
        setSelectedClub(clubId);
        form.setValue('clubId', clubId);
        form.setValue('position', '');
        setSelectedNomination('');
        setCandidates([]);
        setSelectedCandidates([]);

        if (clubId) {
            try {
                const nominationsData =
                    await getClosedNominationsByClub(clubId);
                setNominations(nominationsData);
            } catch (error) {
                console.error('Failed to fetch nominations:', error);
                toast.error('Failed to load closed nominations for this club');
            }
        } else {
            setNominations([]);
        }
    };

    const handleNominationChange = async (nominationId: string) => {
        setSelectedNomination(nominationId);
        const nomination = nominations.find(n => n.id === nominationId);
        if (nomination) {
            form.setValue('position', nomination.position);
        }

        if (nominationId) {
            try {
                const candidatesData =
                    await getApprovedCandidates(nominationId);
                setCandidates(candidatesData as Candidate[]);
            } catch (error) {
                console.error('Failed to fetch candidates:', error);
                toast.error('Failed to load approved candidates');
            }
        } else {
            setCandidates([]);
            setSelectedCandidates([]);
        }
    };

    const handleCandidateToggle = (candidateId: string) => {
        const newSelected = selectedCandidates.includes(candidateId)
            ? selectedCandidates.filter(id => id !== candidateId)
            : [...selectedCandidates, candidateId];

        setSelectedCandidates(newSelected);
        form.setValue('candidates', newSelected);
    };

    const onSubmit = async (data: EventFormValues) => {
        try {
            setLoading(true);
            await createEvent(data);
            toast.success('Event created successfully');
            router.push('/admin/events');
        } catch (error) {
            console.error('Failed to create event:', error);
            toast.error('Failed to create event');
        } finally {
            setLoading(false);
        }
    };

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
                    Create New Event
                </h1>
                <p className="text-gray-400">
                    Create an event for a closed nomination with approved
                    candidates
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">
                                            Club
                                        </FormLabel>
                                        <Select
                                            onValueChange={value => {
                                                field.onChange(value);
                                                handleClubChange(value);
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-gray-700 bg-gray-700 text-gray-200">
                                                    <SelectValue placeholder="Select a club" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                                                {clubs.length === 0 ? (
                                                    <SelectItem
                                                        value="none"
                                                        disabled
                                                    >
                                                        No clubs with closed
                                                        nominations
                                                    </SelectItem>
                                                ) : (
                                                    clubs.map(club => (
                                                        <SelectItem
                                                            key={club.id}
                                                            value={club.id}
                                                        >
                                                            {club.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className="text-gray-400">
                                            Select a club with closed
                                            nominations
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
                                        <Select
                                            onValueChange={value => {
                                                handleNominationChange(value);
                                            }}
                                            value={selectedNomination}
                                            disabled={!selectedClub}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-gray-700 bg-gray-700 text-gray-200">
                                                    <SelectValue placeholder="Select a position" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="border-gray-700 bg-gray-800 text-gray-200">
                                                {nominations.length === 0 ? (
                                                    <SelectItem
                                                        value="none"
                                                        disabled
                                                    >
                                                        No closed nominations
                                                    </SelectItem>
                                                ) : (
                                                    nominations.map(
                                                        nomination => (
                                                            <SelectItem
                                                                key={
                                                                    nomination.id
                                                                }
                                                                value={
                                                                    nomination.id
                                                                }
                                                            >
                                                                {
                                                                    nomination.position
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className="text-gray-400">
                                            Select a position with closed
                                            nomination
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
                                        {candidates.length === 0 ? (
                                            <div className="rounded-md border border-gray-700 bg-gray-900 p-4 text-center text-gray-400">
                                                {selectedNomination
                                                    ? 'No approved candidates found for this nomination'
                                                    : 'Select a nomination to view candidates'}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                                                {candidates.map(candidate => (
                                                    <div
                                                        key={candidate.id}
                                                        className={`flex cursor-pointer items-center justify-between rounded-md border p-3 ${
                                                            selectedCandidates.includes(
                                                                candidate.id
                                                            )
                                                                ? 'border-indigo-600 bg-indigo-900/20'
                                                                : 'border-gray-700 bg-gray-900'
                                                        }`}
                                                        onClick={() =>
                                                            handleCandidateToggle(
                                                                candidate.id
                                                            )
                                                        }
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
                                                                selectedCandidates.includes(
                                                                    candidate.id
                                                                )
                                                                    ? 'border-indigo-600 bg-indigo-600'
                                                                    : 'border-gray-600'
                                                            }`}
                                                        >
                                                            {selectedCandidates.includes(
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
                                                ))}
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
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Event'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
