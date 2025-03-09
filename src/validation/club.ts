import { z } from 'zod';

export const ClubSchema = z.object({
    name: z.string().min(1, 'Club name is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().min(1, 'Image URL is required'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']),
    open_date: z.string().optional(),
    positions: z.array(z.string()).default([]),
});

export type ClubFormValues = z.infer<typeof ClubSchema>;
