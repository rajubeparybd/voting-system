'use server';

import { db } from '@/lib/prisma';
import { NominationFormValues } from '@/validation/nomination';
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
                applications: {
                    include: {
                        user: {
                            select: {
                                studentId: true,
                                name: true,
                                email: true,
                                department: true,
                            },
                        },
                    },
                },
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

interface ApplyForNominationParams {
    nominationId: string;
    statement: string;
}

export async function applyForNomination({
    nominationId,
    statement,
}: ApplyForNominationParams) {
    try {
        const session = await auth();

        if (!session) {
            throw new Error('Unauthorized');
        }

        // Check if nomination exists and is active
        const nomination = await db.nomination.findUnique({
            where: { id: nominationId },
            include: {
                club: true,
            },
        });

        if (!nomination) {
            throw new Error('Nomination not found');
        }

        if (nomination.status !== 'ACTIVE') {
            throw new Error(
                'This nomination is no longer accepting applications'
            );
        }

        // Check if user is a member of the club
        const club = await db.club.findUnique({
            where: { id: nomination.clubId },
        });

        if (!club?.members.includes(session.user.id)) {
            throw new Error('You must be a member of this club to apply');
        }

        // Check if user has already applied
        const existingApplication = await db.application.findFirst({
            where: {
                nominationId,
                userId: session.user.id,
            },
        });

        if (existingApplication) {
            throw new Error('You have already applied for this nomination');
        }

        // Create the application
        const application = await db.application.create({
            data: {
                nominationId,
                userId: session.user.id,
                statement,
            },
        });

        revalidatePath('/user/candidate');
        return application;
    } catch (error: unknown) {
        console.error('Failed to apply for nomination:', error);
        throw error instanceof Error
            ? error
            : new Error('Failed to apply for nomination');
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

        // Get the nomination ID to revalidate the correct paths
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
            // Revalidate both admin and user routes
            revalidatePath(`/admin/nominations/${nomination.id}/candidates`);
            revalidatePath('/user/candidate');
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
