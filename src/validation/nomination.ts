import { z } from 'zod';

export const NominationSchema = z.object({
    clubId: z.string().min(1, 'Club is required'),
    position: z.string().min(1, 'Position is required'),
    description: z.string().min(1, 'Description is required'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'CLOSED']),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z
        .string()
        .min(1, 'End date is required')
        .refine(date => new Date(date) > new Date(), {
            message: 'End date must be in the future',
        }),
});

export const ApplicationSchema = z.object({
    nominationId: z.string().min(1, 'Nomination is required'),
    statement: z
        .string()
        .min(10, 'Statement must be at least 10 characters long'),
});

export type NominationFormValues = z.infer<typeof NominationSchema>;
export type ApplicationFormValues = z.infer<typeof ApplicationSchema>;
