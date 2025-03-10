'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventStatus } from '@prisma/client';
import { updateEventStatus, determineEventWinner } from '@/actions/event';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { InfoIcon } from 'lucide-react';

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
    const [showTooltip, setShowTooltip] = useState(false);

    // Prevent status changes if status is already COMPLETED
    const isCompleted = currentStatus === 'COMPLETED';

    async function handleStatusChange(newStatus: string) {
        if (newStatus === currentStatus) return;

        // Prevent changing status from COMPLETED to anything else
        if (currentStatus === 'COMPLETED') {
            toast.error('Status cannot be changed once event is completed');
            return;
        }

        try {
            setIsUpdating(true);
            await updateEventStatus(eventId, newStatus as EventStatus);

            // If the new status is COMPLETED, determine the winner
            if (newStatus === 'COMPLETED') {
                const result = await determineEventWinner(eventId);

                if (result.success) {
                    toast.success('Event completed and winner determined');
                } else if (result.tie) {
                    // If there's a tie, show a notification and navigate to the manual selection page
                    toast.info(
                        'Multiple candidates tied for the top spot. Please select a winner manually.'
                    );
                    router.push(`/admin/events/${eventId}/select-winner`);
                    return;
                } else {
                    toast.error(result.error || 'Failed to determine winner');
                }
            } else {
                toast.success('Event status updated successfully');
            }

            router.refresh();
        } catch (error) {
            toast.error('Failed to update event status');
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    }

    // If completed, show a non-interactive display
    if (isCompleted) {
        return (
            <div className="relative">
                <div
                    className="flex items-center space-x-1"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <div className="border-input w-[130px] rounded-md border bg-gray-800 px-3 py-2 text-sm text-white">
                        Completed
                    </div>
                    <InfoIcon className="h-4 w-4 text-gray-400" />
                </div>

                {showTooltip && (
                    <div className="absolute top-[-40px] right-0 z-50 rounded-md border border-gray-700 bg-gray-800 p-2 text-xs text-white shadow-md">
                        Status cannot be changed once event is completed
                    </div>
                )}
            </div>
        );
    }

    return (
        <Select
            defaultValue={currentStatus}
            onValueChange={handleStatusChange}
            disabled={isUpdating || isCompleted}
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
