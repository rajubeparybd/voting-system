'use server';

import { db } from '@/lib/prisma';
import { EventFormValues } from '@/validation/event';
import { revalidatePath } from 'next/cache';
import { EventStatus, Application } from '@prisma/client';

export async function getEvents() {
    try {
        const events = await db.event.findMany({
            include: {
                club: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return events;
    } catch (error) {
        console.error('Failed to fetch events:', error);
        throw new Error('Failed to fetch events');
    }
}

export async function getEvent(id: string) {
    try {
        const event = await db.event.findUnique({
            where: { id },
            include: {
                club: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!event) {
            return null;
        }

        // Fetch user details for candidates
        const candidateDetails = await db.user.findMany({
            where: {
                id: {
                    in: event.candidates,
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                studentId: true,
                department: true,
            },
        });

        console.log('Event candidates IDs:', event.candidates);
        console.log('Found candidate details:', candidateDetails);

        return {
            ...event,
            candidateDetails,
        };
    } catch (error) {
        console.error('Failed to fetch event:', error);
        throw new Error('Failed to fetch event');
    }
}

export async function createEvent(data: EventFormValues) {
    try {
        const event = await db.event.create({
            data: {
                ...data,
                eventDate: new Date(data.eventDate),
            },
        });
        revalidatePath('/admin/events');
        return event;
    } catch (error) {
        console.error('Failed to create event:', error);
        throw new Error('Failed to create event');
    }
}

export async function updateEvent(id: string, data: EventFormValues) {
    try {
        const event = await db.event.update({
            where: { id },
            data: {
                ...data,
                eventDate: new Date(data.eventDate),
            },
        });
        revalidatePath('/admin/events');
        revalidatePath(`/admin/events/${id}`);
        return event;
    } catch (error) {
        console.error('Failed to update event:', error);
        throw new Error('Failed to update event');
    }
}

export async function deleteEvent(id: string) {
    try {
        await db.event.delete({
            where: { id },
        });
        revalidatePath('/admin/events');
    } catch (error) {
        console.error('Failed to delete event:', error);
        throw new Error('Failed to delete event');
    }
}

export async function updateEventStatus(id: string, status: EventStatus) {
    try {
        const event = await db.event.update({
            where: { id },
            data: { status },
        });
        revalidatePath('/admin/events');
        revalidatePath(`/admin/events/${id}`);
        return event;
    } catch (error) {
        console.error('Failed to update event status:', error);
        throw new Error('Failed to update event status');
    }
}

export async function getClosedNominations() {
    try {
        const nominations = await db.nomination.findMany({
            where: {
                status: 'CLOSED',
            },
            include: {
                club: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return nominations;
    } catch (error) {
        console.error('Failed to fetch closed nominations:', error);
        throw new Error('Failed to fetch closed nominations');
    }
}

interface CandidateUser {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    studentId: string | null;
    department: string | null;
}

export async function getApprovedCandidates(nominationId: string) {
    try {
        // Check if nominationId is valid before proceeding
        if (!nominationId || nominationId.trim() === '') {
            console.log('Invalid nominationId provided:', nominationId);
            return [];
        }

        const candidates = await db.application.findMany({
            where: {
                nominationId,
                status: 'APPROVED',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        studentId: true,
                        department: true,
                    },
                },
            },
        });

        console.log('Raw candidates from DB:', candidates);

        const mappedCandidates = candidates.map(
            (candidate: Application & { user: CandidateUser }): CandidateUser =>
                candidate.user
        );

        console.log('Mapped candidate details:', mappedCandidates);

        return mappedCandidates;
    } catch (error) {
        console.error('Failed to fetch approved candidates:', error);
        // Return empty array instead of throwing error to prevent page crashes
        return [];
    }
}

export async function getClubsWithClosedNominations() {
    try {
        const clubs = await db.club.findMany({
            where: {
                nominations: {
                    some: {
                        status: 'CLOSED',
                    },
                },
            },
            select: {
                id: true,
                name: true,
            },
        });

        return clubs;
    } catch (error) {
        console.error('Failed to fetch clubs with closed nominations:', error);
        return [];
    }
}

export async function getClosedNominationsByClub(clubId: string) {
    try {
        const nominations = await db.nomination.findMany({
            where: {
                clubId,
                status: 'CLOSED',
            },
            select: {
                id: true,
                position: true,
            },
        });

        return nominations;
    } catch (error) {
        console.error(
            `Failed to fetch closed nominations for club ${clubId}:`,
            error
        );
        return [];
    }
}
