import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.role?.includes('ADMIN')) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const approvedCandidates = await db.application.findMany({
            where: {
                status: 'APPROVED',
            },
            include: {
                user: {
                    select: {
                        studentId: true,
                        name: true,
                        email: true,
                        department: true,
                        image: true,
                    },
                },
                nomination: {
                    select: {
                        position: true,
                        club: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(approvedCandidates);
    } catch (error) {
        console.error('Failed to fetch approved candidates:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
