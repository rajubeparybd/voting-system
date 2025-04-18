'use client';

import { useState } from 'react';
import { User, Club, Nomination, Application } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { becomeCandidate } from '@/actions/candidate';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CardNominationApply } from '@/components/cards/CardNominationApply';
import { CardReadyToLead } from '@/components/cards/CardReadyToLead';

type ExtendedNomination = Nomination & {
    applications?: Application[];
    club: {
        name: string;
        image: string;
    };
};

type ExtendedApplication = Application & {
    nomination: Nomination & {
        club: {
            name: string;
            image: string;
        };
    };
};

interface CardCandidateMainProps {
    user: User;
    clubs: Club[];
    nominations: ExtendedNomination[];
    applications: ExtendedApplication[];
}

interface NominationApplicationFormProps {
    clubs: Club[];
    nominations: ExtendedNomination[];
    applications: ExtendedApplication[];
}

function NominationApplicationForm({
    clubs,
    nominations,
    applications,
}: NominationApplicationFormProps) {
    const [selectedNomination, setSelectedNomination] =
        useState<ExtendedNomination | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const availablePositions = nominations;

    function handleNominationSelect(nomination: ExtendedNomination) {
        setSelectedNomination(nomination);
        setIsModalOpen(true);
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-white/90">
                    Available Positions
                    <Badge variant="default">
                        {availablePositions.length} Position
                        {availablePositions.length !== 1 ? 's' : ''}
                    </Badge>
                </div>

                {availablePositions.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {availablePositions.map(nomination => {
                            const club = clubs.find(
                                c => c.id === nomination.clubId
                            );
                            return (
                                <div
                                    key={nomination.id}
                                    className="group rounded-xl border border-white/10 bg-slate-800/50 p-6 transition-all hover:border-white/20 hover:bg-slate-800/70"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-blue-400">
                                            {club?.name}
                                        </p>
                                        <h4 className="text-lg font-medium text-white/90">
                                            {nomination.position}
                                        </h4>
                                        <p className="mt-1 line-clamp-2 text-sm text-white/70">
                                            {nomination.description}
                                        </p>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleNominationSelect(
                                                    nomination
                                                )
                                            }
                                            className="border-white/10 bg-white/5 hover:bg-white/10"
                                        >
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 p-8 text-center backdrop-blur-xl">
                        No positions available for application
                    </div>
                )}
            </div>

            {applications.length > 0 && (
                <div className="mb-10 space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-white/90">
                        Your Applications
                        <Badge variant="default">
                            {applications.length} Application
                            {applications.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {applications.map(application => (
                            <div
                                key={application.id}
                                className="rounded-xl border border-white/10 bg-slate-800/50 p-6"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-blue-400">
                                            {application.nomination.club.name}
                                        </p>
                                        <h4 className="text-lg font-medium text-white/90">
                                            {application.nomination.position}
                                        </h4>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    application.status ===
                                                    'APPROVED'
                                                        ? 'success'
                                                        : application.status ===
                                                            'REJECTED'
                                                          ? 'destructive'
                                                          : 'default'
                                                }
                                            >
                                                {application.status}
                                            </Badge>
                                            <span className="text-sm text-white/50">
                                                Applied on{' '}
                                                {new Date(
                                                    application.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="line-clamp-3 text-sm text-white/70">
                                            {application.statement}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="border-white/10 bg-slate-900 text-left sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-white/90">
                            Apply for Position
                        </DialogTitle>
                    </DialogHeader>
                    {selectedNomination && (
                        <CardNominationApply
                            nomination={selectedNomination}
                            club={
                                clubs.find(
                                    club =>
                                        club.id === selectedNomination.clubId
                                )!
                            }
                            onComplete={() => {
                                setIsModalOpen(false);
                                setSelectedNomination(null);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export function CardCandidateMain({
    user,
    clubs,
    nominations,
    applications,
}: CardCandidateMainProps) {
    const isCandidate = user.role?.includes('CANDIDATE');
    const hasJoinedClubs = clubs.length > 0;

    async function handleApplyAsCandidate() {
        try {
            await becomeCandidate();
            toast.success('You are now a candidate!');
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to apply as candidate'
            );
        }
    }

    if (!isCandidate && !hasJoinedClubs) {
        return (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-6">
                <div className="flex items-start gap-4">
                    <div className="rounded-full bg-yellow-500/20 p-2">
                        <AlertCircle className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium text-yellow-500">
                            Club Membership Required
                        </h3>
                        <p className="text-sm text-white/70">
                            You need to be a member of at least one club to
                            become a candidate. Please join a club first before
                            applying for candidacy.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {!isCandidate && (
                <CardReadyToLead
                    clubs={clubs}
                    isLoading={false}
                    onApply={handleApplyAsCandidate}
                />
            )}

            {isCandidate && (
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-800/50 p-6">
                    <div className="rounded-full bg-blue-500/20 p-2">
                        <Sparkles className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white/90">
                            Welcome to Your Candidate Dashboard
                        </h3>
                        <p className="text-sm text-white/70">
                            You can now apply for available positions in your
                            clubs
                        </p>
                    </div>
                </div>
            )}

            {isCandidate && (
                <NominationApplicationForm
                    clubs={clubs}
                    nominations={nominations}
                    applications={applications}
                />
            )}
        </div>
    );
}
