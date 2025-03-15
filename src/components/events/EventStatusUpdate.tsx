'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventStatus } from '@prisma/client';
import { updateEventStatus } from '@/actions/event';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface EventStatusUpdateProps {
    eventId: string;
    currentStatus: EventStatus;
}

const statusOptions = [
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'ONGOING', label: 'Ongoing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

export default function EventStatusUpdate({
    eventId,
    currentStatus,
}: EventStatusUpdateProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleStatusChange(newStatus: string) {
        if (newStatus === currentStatus) return;

        try {
            setIsUpdating(true);
            await updateEventStatus(eventId, newStatus as EventStatus);
            toast.success('Event status updated successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to update event status');
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <Select
            defaultValue={currentStatus}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
        >
            <SelectTrigger className="w-[130px] bg-gray-800">
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800">
                {statusOptions.map(option => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white hover:bg-gray-700"
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
