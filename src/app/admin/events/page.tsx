'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEvents, deleteEvent } from '@/actions/event';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    Pencil,
    Trash2,
    PlusCircle,
    Calendar,
    MoreVertical,
    Eye,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

interface Club {
    id?: string;
    name: string;
}

interface Event {
    id: string;
    clubId: string;
    club?: Club;
    position: string;
    title: string;
    description: string;
    candidates: string[];
    eventDate: Date;
    status: EventStatus;
    createdAt: Date;
    updatedAt: Date;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);
    const [uniqueClubs, setUniqueClubs] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        club: 'all',
        position: '',
        status: 'all',
    });
    const router = useRouter();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await getEvents();
                if (!eventsData) {
                    setEvents([]);
                    setFilteredEvents([]);
                    // Extract unique clubs (empty in this case)
                    setUniqueClubs([]);
                } else {
                    setEvents(eventsData as Event[]);
                    setFilteredEvents(eventsData as Event[]);

                    // Extract unique clubs - filter out undefined club names first
                    const clubNames = eventsData
                        .map((e: Event) => e.club?.name)
                        .filter((name): name is string => !!name);
                    const clubs = [...new Set(clubNames)];
                    setUniqueClubs(clubs);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
                toast.error('Failed to load events');
                setEvents([]);
                setFilteredEvents([]);
                setUniqueClubs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        let result = [...events];

        if (filters.club && filters.club !== 'all') {
            result = result.filter(
                event => event.club && event.club.name === filters.club
            );
        }

        if (filters.position) {
            result = result.filter(event =>
                event.position
                    .toLowerCase()
                    .includes(filters.position.toLowerCase())
            );
        }

        if (filters.status && filters.status !== 'all') {
            result = result.filter(event => event.status === filters.status);
        }

        setFilteredEvents(result);
    }, [filters, events]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleDeleteClick = (id: string) => {
        setEventToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!eventToDelete) return;

        try {
            await deleteEvent(eventToDelete);
            setEvents(events.filter(e => e.id !== eventToDelete));
            toast.success('Event deleted successfully');
        } catch (error) {
            console.error('Failed to delete event:', error);
            toast.error('Failed to delete event');
        } finally {
            setDeleteDialogOpen(false);
            setEventToDelete(null);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: EventStatus) => {
        switch (status) {
            case 'UPCOMING':
                return (
                    <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                        Upcoming
                    </Badge>
                );
            case 'ONGOING':
                return (
                    <Badge className="bg-green-600 text-white hover:bg-green-700">
                        Ongoing
                    </Badge>
                );
            case 'COMPLETED':
                return (
                    <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                        Completed
                    </Badge>
                );
            case 'CANCELLED':
                return (
                    <Badge className="bg-red-600 text-white hover:bg-red-700">
                        Cancelled
                    </Badge>
                );
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="flex h-64 items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                        <p className="text-gray-400">Loading events...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Events</h1>
                <Button
                    onClick={() => router.push('/admin/events/new')}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
                </Button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <Select
                        value={filters.club}
                        onValueChange={value =>
                            handleFilterChange('club', value)
                        }
                    >
                        <SelectTrigger className="border-gray-700 bg-gray-800 text-gray-200">
                            <SelectValue placeholder="Filter by club" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clubs</SelectItem>
                            {uniqueClubs.map(club => (
                                <SelectItem key={club} value={club}>
                                    {club}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Select
                        value={filters.status}
                        onValueChange={value =>
                            handleFilterChange('status', value)
                        }
                    >
                        <SelectTrigger className="border-gray-700 bg-gray-800 text-gray-200">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="UPCOMING">Upcoming</SelectItem>
                            <SelectItem value="ONGOING">Ongoing</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Input
                        placeholder="Filter by position..."
                        value={filters.position}
                        onChange={e =>
                            handleFilterChange('position', e.target.value)
                        }
                        className="border-gray-700 bg-gray-800 text-gray-200"
                    />
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
                    <Calendar className="mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-xl font-medium text-white">
                        No events found
                    </h3>
                    <p className="text-gray-400">
                        {events.length > 0
                            ? 'Try adjusting your filters'
                            : 'Create your first event to get started'}
                    </p>
                    {events.length === 0 && (
                        <Button
                            onClick={() => router.push('/admin/events/new')}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Create Event
                        </Button>
                    )}
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-700">
                    <Table>
                        <TableHeader className="bg-gray-800">
                            <TableRow className="border-gray-700 hover:bg-gray-800">
                                <TableHead className="text-gray-300">
                                    Title
                                </TableHead>
                                <TableHead className="text-gray-300">
                                    Club
                                </TableHead>
                                <TableHead className="text-gray-300">
                                    Position
                                </TableHead>
                                <TableHead className="text-gray-300">
                                    Date
                                </TableHead>
                                <TableHead className="text-gray-300">
                                    Status
                                </TableHead>
                                <TableHead className="text-right text-gray-300">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.map(event => (
                                <TableRow
                                    key={event.id}
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                >
                                    <TableCell className="font-medium">
                                        {event.title}
                                    </TableCell>
                                    <TableCell>
                                        {event.club?.name || 'Unknown Club'}
                                    </TableCell>
                                    <TableCell>{event.position}</TableCell>
                                    <TableCell>
                                        {formatDate(event.eventDate)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(event.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                                >
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="border-gray-700 bg-gray-800 text-gray-200"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.push(
                                                            `/admin/events/${event.id}/details`
                                                        )
                                                    }
                                                    className="hover:bg-gray-700 hover:text-white"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.push(
                                                            `/admin/events/${event.id}/edit`
                                                        )
                                                    }
                                                    className="hover:bg-gray-700 hover:text-white"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            event.id
                                                        )
                                                    }
                                                    className="hover:bg-gray-700 hover:text-white"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="border-gray-700 bg-gray-800 text-gray-200 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            Confirm Deletion
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to delete this event? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
