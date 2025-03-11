'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
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

import {
    NominationSchema,
    NominationFormValues,
} from '@/validation/nomination';
import { createNomination } from '@/actions/nomination';
import { getClubs } from '@/actions/club';

interface Club {
    id: string;
    name: string;
    positions: string[];
}

type NominationStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED';
const STATUS_OPTIONS: NominationStatus[] = ['ACTIVE', 'INACTIVE', 'CLOSED'];

export default function NewNominationPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    const [positions, setPositions] = useState<string[]>([]);

    const form = useForm<NominationFormValues>({
        resolver: zodResolver(NominationSchema),
        defaultValues: {
            clubId: '',
            position: '',
            description: '',
            status: 'ACTIVE' as NominationStatus,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
        },
    });

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const clubsData = await getClubs();
                // Only include clubs that have positions defined
                const clubsWithPositions = clubsData.filter(
                    (club: any) => club.positions && club.positions.length > 0
                );
                setClubs(clubsWithPositions as Club[]);
            } catch (error) {
                console.error('Failed to fetch clubs:', error);
                toast.error('Failed to load clubs');
            }
        };

        fetchClubs();
    }, []);

    // Update available positions when club changes
    const handleClubChange = (clubId: string) => {
        const club = clubs.find(c => c.id === clubId);
        if (club) {
            setSelectedClub(club);
            setPositions(club.positions);
            // Reset position field when club changes
            form.setValue('position', '');
        } else {
            setSelectedClub(null);
            setPositions([]);
        }
    };

    const onSubmit = async (values: NominationFormValues) => {
        setIsSubmitting(true);

        try {
            await createNomination(values);
            toast.success('Nomination created successfully');
            router.push('/admin/nominations');
        } catch (error: any) {
            console.error('Failed to create nomination:', error);
            toast.error(error.message || 'Failed to create nomination');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <Button
                variant="ghost"
                className="mb-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                onClick={() => router.push('/admin/nominations')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Nominations
            </Button>

            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-white">
                    Create New Nomination
                </h1>
                <p className="text-gray-400">
                    Create a nomination for a club position
                </p>
            </div>

            <div className="mx-auto max-w-2xl">
                <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="clubId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">
                                            Club
                                        </FormLabel>
                                        <Select
                                            onValueChange={value => {
                                                field.onChange(value);
                                                handleClubChange(value);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a club" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {clubs.map(club => (
                                                    <SelectItem
                                                        key={club.id}
                                                        value={club.id}
                                                    >
                                                        {club.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">
                                            Position
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!selectedClub}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a position" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {positions.map(position => (
                                                    <SelectItem
                                                        key={position}
                                                        value={position}
                                                    >
                                                        {position}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter nomination description"
                                                className="min-h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">
                                            Status
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map(status => (
                                                    <SelectItem
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status.charAt(0) +
                                                            status
                                                                .slice(1)
                                                                .toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">
                                                Start Date
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">
                                                End Date
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Creating...'
                                    : 'Create Nomination'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
