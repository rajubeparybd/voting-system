'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteEvent } from '@/actions/event';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface EventDeleteDialogProps {
    eventId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EventDeleteDialog({
    eventId,
    open,
    onOpenChange,
}: EventDeleteDialogProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        try {
            setIsDeleting(true);
            await deleteEvent(eventId);
            toast.success('Event deleted successfully');
            router.push('/admin/events');
            router.refresh();
        } catch (error) {
            toast.error('Failed to delete event');
            console.error(error);
        } finally {
            setIsDeleting(false);
            onOpenChange(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-gray-900 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Event</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to delete this event? This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="bg-gray-800 text-white hover:bg-gray-700"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
