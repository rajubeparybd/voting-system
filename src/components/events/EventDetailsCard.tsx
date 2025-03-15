'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event, EventStatus } from '@prisma/client';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Edit, Trash } from 'lucide-react';
import EventEditDialog from './EventEditDialog';
import EventDeleteDialog from './EventDeleteDialog';
import EventStatusUpdate from './EventStatusUpdate';

interface EventDetailsCardProps {
    event: Event & {
        club: {
            name: string;
        };
    };
}

const statusColors = {
    UPCOMING: 'bg-blue-500',
    ONGOING: 'bg-green-500',
    COMPLETED: 'bg-gray-500',
    CANCELLED: 'bg-red-500',
};

export default function EventDetailsCard({ event }: EventDetailsCardProps) {
    const router = useRouter();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                className="mb-4"
                onClick={() => router.back()}
            >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Events
            </Button>

            <Card className="border-gray-800 bg-gray-900">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-white">
                        {event.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <EventStatusUpdate
                            eventId={event.id}
                            currentStatus={event.status as EventStatus}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsEditOpen(true)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400">Club</p>
                            <p className="text-white">{event.club.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Position</p>
                            <p className="text-white">{event.position}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Event Date</p>
                            <p className="text-white">
                                {format(new Date(event.eventDate), 'PPP p')}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Status</p>
                            <Badge
                                className={
                                    statusColors[event.status as EventStatus]
                                }
                            >
                                {event.status}
                            </Badge>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-400">Description</p>
                        <p className="mt-1 text-white">{event.description}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                        <p>
                            Created:{' '}
                            {format(new Date(event.createdAt), 'PPP p')}
                        </p>
                        <p>
                            Last updated:{' '}
                            {format(new Date(event.updatedAt), 'PPP p')}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <EventEditDialog
                event={event}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            <EventDeleteDialog
                eventId={event.id}
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            />
        </>
    );
}
