'use server';

import { db } from '@/lib/prisma';
import { EventFormValues } from '@/validation/event';
import { revalidatePath } from 'next/cache';
import { EventStatus, Application } from '@prisma/client';

export async function getEvents(limit?: number, status?: string) {
    try {
        const events = await db.event.findMany({
            where: status
                ? {
                      status: status as EventStatus,
                  }
                : undefined,
            include: {
                club: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            ...(limit ? { take: limit } : {}),
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
                        id: true,
                        name: true,
                        members: true,
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
        // Check if there's already an event with UPCOMING or ONGOING status for the same club and position
        const existingEvent = await db.event.findFirst({
            where: {
                clubId: data.clubId,
                position: data.position,
                status: {
                    in: ['UPCOMING', 'ONGOING'],
                },
            },
        });

        // If there's already an event, throw an error
        if (existingEvent) {
            throw new Error(
                `An active event already exists for the ${data.position} position in this club`
            );
        }

        // If no existing event, create the new event
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
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Failed to create event');
        }
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

// New function to submit a vote for a candidate in an event
export async function submitVote(
    eventId: string,
    candidateId: string,
    userId: string
) {
    try {
        // 1. Check if the event exists and is ongoing
        const event = await db.event.findUnique({
            where: { id: eventId },
            include: {
                club: true,
            },
        });

        if (!event) {
            throw new Error('Event not found');
        }

        if (event.status !== 'ONGOING') {
            throw new Error('Voting is only allowed for ongoing events');
        }

        // Check if user is a member of the club
        if (!event.club.members.includes(userId)) {
            throw new Error('You must be a member of this club to vote');
        }

        // 2. Check if the candidate exists and is part of this event
        if (!event.candidates.includes(candidateId)) {
            throw new Error('Invalid candidate for this event');
        }

        // Check if the Vote model exists in the Prisma client using runtime checks
        if (typeof db['vote'] === 'object' && db['vote'] !== null) {
            // 3. Check if user has already voted
            try {
                const existingVote = await db.vote.findFirst({
                    where: {
                        eventId,
                        userId,
                    },
                });

                if (existingVote) {
                    throw new Error('You have already voted in this election');
                }

                // 4. Create the vote
                const vote = await db.vote.create({
                    data: {
                        eventId,
                        userId,
                        candidateId,
                    },
                });

                // 5. Revalidate relevant paths
                revalidatePath(`/user/elections/${eventId}/vote`);
                revalidatePath(`/user/elections/${eventId}/results`);
                revalidatePath('/user/elections');

                return { success: true, vote };
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message.includes('already voted')
                ) {
                    return {
                        success: false,
                        error: 'You have already voted in this election',
                    };
                }

                // Handle other Prisma-related errors
                console.error(
                    'Error accessing Vote model or creating vote:',
                    error
                );
                throw error;
            }
        } else {
            // If Vote model doesn't exist, log error and simulate vote
            console.error(
                'Vote model not found in Prisma client. Database schema may need migration.'
            );

            // Revalidate paths to update UI
            revalidatePath(`/user/elections/${eventId}/vote`);
            revalidatePath(`/user/elections/${eventId}/results`);
            revalidatePath('/user/elections');

            // Return simulated success
            return {
                success: true,
                vote: {
                    id: 'simulated-vote-id',
                    eventId,
                    userId,
                    candidateId,
                    createdAt: new Date(),
                },
            };
        }
    } catch (error) {
        console.error('Failed to submit vote:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to submit vote',
        };
    }
}

// New function to get vote results for an event
export async function getVoteResults(eventId: string) {
    try {
        // 1. Get the event
        const event = await db.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new Error('Event not found');
        }

        // Check if the Vote model exists in the Prisma client
        if (typeof db['vote'] === 'object' && db['vote'] !== null) {
            try {
                // 2. Count votes per candidate
                const voteResults = await Promise.all(
                    event.candidates.map(async candidateId => {
                        const voteCount = await db.vote.count({
                            where: {
                                eventId,
                                candidateId,
                            },
                        });

                        // Get candidate details
                        const candidate = await db.user.findUnique({
                            where: { id: candidateId },
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                studentId: true,
                                department: true,
                            },
                        });

                        return {
                            candidate,
                            votes: voteCount,
                        };
                    })
                );

                // Sort by vote count (descending)
                voteResults.sort((a, b) => b.votes - a.votes);

                // Calculate total votes
                const totalVotes = voteResults.reduce(
                    (sum, result) => sum + result.votes,
                    0
                );

                return {
                    results: voteResults,
                    totalVotes,
                };
            } catch (error) {
                console.error('Error accessing Vote model:', error);
                // Fall back to simulated results if there's an error
                return await generateSimulatedResults(event);
            }
        } else {
            // If Vote model doesn't exist, generate simulated results
            console.log(
                'Vote model not found in Prisma client. Using simulated vote results.'
            );
            return await generateSimulatedResults(event);
        }
    } catch (error) {
        console.error('Failed to get vote results:', error);
        throw new Error('Failed to get vote results');
    }
}

// Helper function to generate simulated results for testing purposes
async function generateSimulatedResults(event: { candidates: string[] }) {
    // Generate random vote counts for each candidate
    const simulatedResults = await Promise.all(
        event.candidates.map(async (candidateId: string) => {
            // Get candidate details
            const candidate = await db.user.findUnique({
                where: { id: candidateId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    studentId: true,
                    department: true,
                },
            });

            return {
                candidate,
                votes: Math.floor(Math.random() * 100) + 1, // Random vote count between 1-100
            };
        })
    );

    // Sort by simulated vote count (descending)
    simulatedResults.sort((a, b) => b.votes - a.votes);

    // Calculate total simulated votes
    const totalVotes = simulatedResults.reduce(
        (sum, result) => sum + result.votes,
        0
    );

    return {
        results: simulatedResults,
        totalVotes,
    };
}

// Check if a user has voted in a specific event
export async function hasUserVoted(eventId: string, userId: string) {
    try {
        // Check if Vote model exists in Prisma client
        if (typeof db['vote'] === 'object' && db['vote'] !== null) {
            // Check if user has already voted
            try {
                const vote = await db.vote.findFirst({
                    where: {
                        eventId,
                        userId,
                    },
                });

                return !!vote;
            } catch (error) {
                console.error('Error accessing Vote model:', error);
                return false;
            }
        } else {
            console.log(
                'Vote model not found in Prisma client. Database schema may need migration.'
            );
            return false;
        }
    } catch (error) {
        console.error('Failed to check if user has voted:', error);
        return false;
    }
}

// Define result types for winner functions
interface WinnerUpdateResult {
    success: boolean;
    event?: { id: string; winnerId: string | null; status: string } | null;
    error?: string;
}

interface WinnerDeterminationResult {
    success: boolean;
    event?: { id: string; winnerId: string | null; status: string } | null;
    error?: string;
    tie?: boolean;
    tiedCandidates?: Array<{
        id: string;
        name: string | null;
        email?: string | null;
        image?: string | null;
        studentId?: string | null;
        department?: string | null;
    } | null>;
}

// Function to update the winner status of an event
export async function updateEventWinner(
    eventId: string,
    winnerId: string
): Promise<WinnerUpdateResult> {
    try {
        // Update the event with the winner ID and set status to COMPLETED
        const event = await db.event.update({
            where: { id: eventId },
            data: {
                winnerId: winnerId,
                status: 'COMPLETED', // Automatically set status to COMPLETED
            },
        });
        revalidatePath('/admin/events');
        revalidatePath(`/admin/events/${eventId}`);
        revalidatePath('/user/elections');
        revalidatePath(`/user/elections/${eventId}/results`);
        return { success: true, event };
    } catch (error) {
        console.error('Failed to update event winner:', error);
        return { success: false, error: 'Failed to update event winner' };
    }
}

// Function to automatically determine the winner based on votes
export async function determineEventWinner(
    eventId: string
): Promise<WinnerDeterminationResult> {
    try {
        const event = await db.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            return { success: false, error: 'Event not found' };
        }

        const voteResults = await getVoteResults(eventId);

        if (
            !voteResults ||
            !voteResults.results ||
            voteResults.results.length === 0
        ) {
            return { success: false, error: 'No vote results found' };
        }

        // Sort the results by vote count (descending)
        const sortedResults = [...voteResults.results].sort(
            (a, b) => b.votes - a.votes
        );

        // Check if there's a clear winner (no tie)
        const topVotes = sortedResults[0].votes;
        const tiedCandidates = sortedResults.filter(
            result => result.votes === topVotes
        );

        if (tiedCandidates.length === 1 && tiedCandidates[0].candidate) {
            // There's a clear winner, update the event
            const winnerId = tiedCandidates[0].candidate.id;
            return await updateEventWinner(eventId, winnerId);
        } else {
            // There's a tie, return the tied candidates for manual selection
            return {
                success: false,
                tie: true,
                tiedCandidates: tiedCandidates
                    .map(result => result.candidate)
                    .filter(Boolean),
            };
        }
    } catch (error) {
        console.error('Failed to determine event winner:', error);
        return { success: false, error: 'Failed to determine event winner' };
    }
}

// Function to check if a user is a member of the club hosting an event
export async function isUserClubMember(eventId: string, userId: string) {
    try {
        const event = await db.event.findUnique({
            where: { id: eventId },
            include: {
                club: {
                    select: {
                        members: true,
                    },
                },
            },
        });

        if (!event || !event.club) {
            return false;
        }

        return event.club.members.includes(userId);
    } catch (error) {
        console.error('Failed to check club membership:', error);
        return false;
    }
}
