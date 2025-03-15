import { z } from 'zod';

export const EventSchema = z.object({
    clubId: z.string().min(1, 'Club is required'),
    position: z.string().min(1, 'Position is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    candidates: z
        .array(z.string())
        .min(1, 'At least one candidate must be selected'),
    eventDate: z.string().min(1, 'Event date is required'),
    status: z
        .enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'])
        .default('UPCOMING'),
});

export type EventFormValues = z.infer<typeof EventSchema>;
