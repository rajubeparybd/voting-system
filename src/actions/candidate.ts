'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function becomeCandidate() {
    try {
        const session = await auth();

        if (!session) {
            throw new Error('Unauthorized');
        }

        // Get user data
        const user = await db.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if user has any club memberships
        const clubs = await db.club.findMany({
            where: {
                members: {
                    has: user.id,
                },
            },
        });

        if (clubs.length === 0) {
            throw new Error(
                'You must be a member of at least one club to become a candidate'
            );
        }

        // Check if user is already a candidate
        if (user.role?.includes('CANDIDATE')) {
            throw new Error('You are already a candidate');
        }

        // Update user role to CANDIDATE
        const updatedUser = await db.user.update({
            where: { id: session.user.id },
            data: {
                role: ['CANDIDATE', ...(user.role || [])],
            },
        });

        revalidatePath('/user/candidate');
        return updatedUser;
    } catch (error: unknown) {
        console.error('Failed to become a candidate:', error);
        throw error instanceof Error
            ? error
            : new Error('Failed to become a candidate');
    }
}
