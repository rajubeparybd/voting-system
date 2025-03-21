import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/prisma';
import { CardCandidateMain } from '@/components/cards/CardCandidateMain';

export const metadata: Metadata = {
    title: 'Candidate Application',
    description: 'Apply to become a candidate for club elections',
};

export default async function CandidatePage() {
    const session = await auth();

    if (!session) {
        redirect('/auth/signin');
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        redirect('/auth/signin');
    }

    const clubs = await db.club.findMany({
        where: {
            members: {
                has: user.id,
            },
        },
    });

    const nominations = await db.nomination.findMany({
        where: {
            clubId: {
                in: clubs.map(club => club.id),
            },
            status: 'ACTIVE',
            applications: {
                none: {
                    userId: user.id,
                },
            },
        },
        include: {
            club: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });

    // Get user's all applications including past ones
    const allApplications = await db.application.findMany({
        where: {
            userId: user.id,
        },
        include: {
            nomination: {
                include: {
                    club: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <>
            <CardCandidateMain
                user={user}
                clubs={clubs}
                nominations={nominations}
                applications={allApplications}
            />
        </>
    );
}
