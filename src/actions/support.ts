'use server';

import { db } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import {
    SupportTicketSchema,
    SupportMessageSchema,
    UpdateTicketSchema,
} from '@/validation/support';
import { revalidatePath } from 'next/cache';

// Create a new support ticket
export async function createSupportTicket(
    prevState: { success: boolean; message: string },
    formData: FormData
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, message: 'Not authenticated' };
        }

        const title = formData.get('title');
        const description = formData.get('description');
        const priority = formData.get('priority');
        const category = formData.get('category');

        const validatedData = SupportTicketSchema.parse({
            title,
            description,
            priority,
            category,
        });

        await db.supportTicket.create({
            data: {
                ...validatedData,
                userId: session.user.id,
            },
        });

        revalidatePath('/user/support');
        return { success: true, message: 'Ticket created successfully' };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error ? error.message : 'Something went wrong',
        };
    }
}

// Get all tickets for the current user
export async function getUserTickets() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Not authenticated');
    }

    return db.supportTicket.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            messages: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
}

// Get all tickets (admin only)
export async function getAllTickets() {
    const session = await auth();
    if (!session?.user?.role?.includes('ADMIN')) {
        throw new Error('Not authorized');
    }

    return db.supportTicket.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    studentId: true,
                },
            },
            messages: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                            role: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
}

// Get a single ticket
export async function getTicket(ticketId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Not authenticated');
    }

    const ticket = await db.supportTicket.findUnique({
        where: {
            id: ticketId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    studentId: true,
                },
            },
            messages: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });

    if (!ticket) {
        throw new Error('Ticket not found');
    }

    // Check if user has access to this ticket
    if (
        ticket.userId !== session.user.id &&
        !session.user.role?.includes('ADMIN')
    ) {
        throw new Error('Not authorized');
    }

    return ticket;
}

// Add a message to a ticket
export async function addTicketMessage(
    prevState: { success: boolean; message: string },
    formData: FormData
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, message: 'Not authenticated' };
        }

        const content = formData.get('content');
        const ticketId = formData.get('ticketId');

        const validatedData = SupportMessageSchema.parse({
            content,
            ticketId,
        });

        const ticket = await db.supportTicket.findUnique({
            where: {
                id: validatedData.ticketId,
            },
        });

        if (!ticket) {
            return { success: false, message: 'Ticket not found' };
        }

        // Check if user has access to this ticket
        if (
            ticket.userId !== session.user.id &&
            !session.user.role?.includes('ADMIN')
        ) {
            return { success: false, message: 'Not authorized' };
        }

        await db.supportMessage.create({
            data: {
                content: validatedData.content,
                ticketId: validatedData.ticketId,
                userId: session.user.id,
                isStaff: session.user.role?.includes('ADMIN') || false,
            },
        });

        // Update ticket status to IN_PROGRESS if admin responds
        if (session.user.role?.includes('ADMIN') && ticket.status === 'OPEN') {
            await db.supportTicket.update({
                where: {
                    id: validatedData.ticketId,
                },
                data: {
                    status: 'IN_PROGRESS',
                },
            });
        }

        revalidatePath(`/user/support/${validatedData.ticketId}`);
        return { success: true, message: 'Message sent successfully' };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error ? error.message : 'Something went wrong',
        };
    }
}

// Update ticket status (admin only)
export async function updateTicketStatus(
    prevState: { success: boolean; message: string },
    formData: FormData
) {
    try {
        const session = await auth();
        if (!session?.user?.role?.includes('ADMIN')) {
            return { success: false, message: 'Not authorized' };
        }

        const ticketId = formData.get('ticketId');
        const status = formData.get('status');
        const priority = formData.get('priority');

        if (!ticketId) {
            return { success: false, message: 'Ticket ID is required' };
        }

        const validatedData = UpdateTicketSchema.parse({
            status,
            priority,
        });

        await db.supportTicket.update({
            where: {
                id: ticketId.toString(),
            },
            data: validatedData,
        });

        revalidatePath(`/user/support/${ticketId}`);
        revalidatePath('/admin/support');
        return { success: true, message: 'Ticket updated successfully' };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error ? error.message : 'Something went wrong',
        };
    }
}
