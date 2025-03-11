'use server';

import { db } from '@/lib/prisma';
import {
    NominationFormValues,
    ApplicationFormValues,
} from '@/validation/nomination';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

export async function getNominations() {
    try {
        const nominations = await db.nomination.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                club: true,
                applications: true,
            },
        });

        return nominations;
    } catch (error) {
        console.error('Failed to fetch nominations:', error);
        throw new Error('Failed to fetch nominations');
    }
}

export async function getNomination(id: string) {
    try {
        const nomination = await db.nomination.findUnique({
            where: {
                id,
            },
            include: {
                club: true,
                applications: true,
            },
        });

        return nomination;
    } catch (error) {
        console.error(`Failed to fetch nomination with ID ${id}:`, error);
        throw new Error('Failed to fetch nomination');
    }
}

export async function createNomination(data: NominationFormValues) {
    try {
        // Verify that the user is an admin
        const session = await auth();
        if (!session?.user?.role?.includes('ADMIN')) {
            throw new Error('Unauthorized');
        }

        // Verify that the position exists in the club
        const club = await db.club.findUnique({
            where: { id: data.clubId },
            select: { positions: true },
        });

        if (!club || !club.positions.includes(data.position)) {
            throw new Error('Invalid position for this club');
        }

        // Check if there's already an active nomination for this position
        const existingNomination = await db.nomination.findFirst({
            where: {
                clubId: data.clubId,
                position: data.position,
                status: 'ACTIVE',
            },
        });

        if (existingNomination) {
            throw new Error(
                'An active nomination already exists for this position'
            );
        }

        const nomination = await db.nomination.create({
            data: {
                clubId: data.clubId,
                position: data.position,
                description: data.description,
                status: data.status,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            },
        });

        revalidatePath('/admin/nominations');
        return nomination;
    } catch (error) {
        console.error('Failed to create nomination:', error);
        throw error;
    }
}

export async function updateNomination(id: string, data: NominationFormValues) {
    try {
        // Verify that the user is an admin
        const session = await auth();
        if (!session?.user?.role?.includes('ADMIN')) {
            throw new Error('Unauthorized');
        }

        const nomination = await db.nomination.update({
            where: {
                id,
            },
            data: {
                position: data.position,
                description: data.description,
                status: data.status,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            },
        });

        revalidatePath('/admin/nominations');
        return nomination;
    } catch (error) {
        console.error(`Failed to update nomination with ID ${id}:`, error);
        throw error;
    }
}

export async function deleteNomination(id: string) {
    try {
        // Verify that the user is an admin
        const session = await auth();
        if (!session?.user?.role?.includes('ADMIN')) {
            throw new Error('Unauthorized');
        }

        // Check if the nomination exists
        const nomination = await db.nomination.findUnique({
            where: { id },
            include: { applications: true },
        });

        if (!nomination) {
            throw new Error('Nomination not found');
        }

        // Delete all applications associated with this nomination first
        if (nomination.applications.length > 0) {
            await db.application.deleteMany({
                where: { nominationId: id },
            });
        }

        // Delete the nomination
        await db.nomination.delete({
            where: { id },
        });

        revalidatePath('/admin/nominations');
        return { success: true };
    } catch (error) {
        console.error(`Failed to delete nomination with ID ${id}:`, error);
        throw error;
    }
}

export async function applyForNomination(data: ApplicationFormValues) {
    try {
        // Get the current user
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error('Unauthorized');
        }

        // Get the nomination and related club
        const nomination = await db.nomination.findUnique({
            where: { id: data.nominationId },
            include: { club: true },
        });

        if (!nomination) {
            throw new Error('Nomination not found');
        }

        // Verify that the user is a member of the club
        if (!nomination.club.members.includes(session.user.id)) {
            throw new Error('You must be a member of the club to apply');
        }

        // Verify that the user has the CANDIDATE role
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (!user?.role?.includes('CANDIDATE')) {
            throw new Error('Only candidates can apply for nominations');
        }

        // Check if the user has already applied
        const existingApplication = await db.application.findFirst({
            where: {
                nominationId: data.nominationId,
                userId: session.user.id,
            },
        });

        if (existingApplication) {
            throw new Error('You have already applied for this nomination');
        }

        const application = await db.application.create({
            data: {
                nominationId: data.nominationId,
                userId: session.user.id,
                statement: data.statement,
            },
        });

        revalidatePath('/nominations');
        return application;
    } catch (error) {
        console.error('Failed to create application:', error);
        throw error;
    }
}

// New function to update candidate status
export async function updateCandidateStatus(
    candidateId: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING'
) {
    try {
        // Verify that the user is an admin
        const session = await auth();
        if (!session?.user?.role?.includes('ADMIN')) {
            throw new Error('Unauthorized');
        }

        // Update the candidate status
        const updatedCandidate = await db.application.update({
            where: {
                id: candidateId,
            },
            data: {
                status,
            },
        });

        // Get the nomination ID to revalidate the correct path
        const nomination = await db.nomination.findFirst({
            where: {
                applications: {
                    some: {
                        id: candidateId,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        if (nomination) {
            revalidatePath(`/admin/nominations/${nomination.id}/candidates`);
        }

        return updatedCandidate;
    } catch (error) {
        console.error(
            `Failed to update candidate status with ID ${candidateId}:`,
            error
        );
        throw error;
    }
}
