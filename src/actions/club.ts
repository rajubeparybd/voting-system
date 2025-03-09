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
