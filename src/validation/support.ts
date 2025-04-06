import { z } from 'zod';

export const SupportTicketSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    category: z.string().min(1, 'Category is required'),
});

export const SupportMessageSchema = z.object({
    content: z.string().min(1, 'Message is required'),
    ticketId: z.string().min(1, 'Ticket ID is required'),
});

export const UpdateTicketSchema = z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    assignedTo: z.string().optional().nullable(),
});

export type SupportTicketSchemaType = z.infer<typeof SupportTicketSchema>;
export type SupportMessageSchemaType = z.infer<typeof SupportMessageSchema>;
export type UpdateTicketSchemaType = z.infer<typeof UpdateTicketSchema>;
