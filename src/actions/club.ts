'use server';

import { db } from '@/lib/prisma';
import { ClubFormValues } from '@/validation/club';
import { revalidatePath } from 'next/cache';

export async function getClubs() {
    try {
        const clubs = await db.club.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                status: true,
                open_date: true,
                members: true,
                positions: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return clubs;
    } catch (error) {
        console.error('Failed to fetch clubs:', error);
        throw new Error('Failed to fetch clubs');
    }
}

export async function getClub(id: string) {
    try {
        const club = await db.club.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                status: true,
                open_date: true,
                members: true,
                positions: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return club;
    } catch (error) {
        console.error(`Failed to fetch club with ID ${id}:`, error);
        throw new Error('Failed to fetch club');
    }
}

export async function createClub(data: ClubFormValues) {
    try {
        // Convert open_date string to Date if provided
        const openDate = data.open_date ? new Date(data.open_date) : undefined;

        const club = await db.club.create({
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
                status: data.status,
                open_date: openDate,
                members: [],
                positions: data.positions || [],
            },
        });

        revalidatePath('/admin/clubs');
        return club;
    } catch (error) {
        console.error('Failed to create club:', error);
        throw new Error('Failed to create club');
    }
}

export async function updateClub(id: string, data: ClubFormValues) {
    try {
        // Convert open_date string to Date if provided
        const openDate = data.open_date ? new Date(data.open_date) : undefined;

        const club = await db.club.update({
            where: {
                id,
            },
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
                status: data.status,
                open_date: openDate,
                positions: data.positions || [],
            },
        });

        revalidatePath('/admin/clubs');
        return club;
    } catch (error) {
        console.error(`Failed to update club with ID ${id}:`, error);
        throw new Error('Failed to update club');
    }
}

export async function deleteClub(id: string) {
    try {
        await db.club.delete({
            where: {
                id,
            },
        });

        revalidatePath('/admin/clubs');
        return { success: true };
    } catch (error) {
        console.error(`Failed to delete club with ID ${id}:`, error);
        throw new Error('Failed to delete club');
    }
}

export async function getActiveClubs(limit?: number) {
    try {
        const clubs = await db.club.findMany({
            where: {
                status: 'ACTIVE',
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                members: true,
                open_date: true,
            },
        });

        return clubs;
    } catch (error) {
        console.error('Failed to fetch active clubs:', error);
        throw new Error('Failed to fetch active clubs');
    }
}

export async function joinClub(clubId: string, userId: string) {
    try {
        const club = await db.club.findUnique({
            where: { id: clubId },
            select: { members: true },
        });

        if (!club) {
            throw new Error('Club not found');
        }

        if (club.members.includes(userId)) {
            throw new Error('Already a member of this club');
        }

        await db.club.update({
            where: { id: clubId },
            data: {
                members: {
                    push: userId,
                },
            },
        });

        revalidatePath('/user/clubs');
        return { success: true };
    } catch (error) {
        console.error('Failed to join club:', error);
        throw error;
    }
}
