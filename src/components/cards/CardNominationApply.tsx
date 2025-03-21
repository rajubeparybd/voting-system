'use client';

import { useState } from 'react';
import { Nomination, Club, Application } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { applyForNomination } from '@/actions/nomination';
import { CalendarDays } from 'lucide-react';
import Image from 'next/image';

interface CardNominationApplyProps {
    nomination: Nomination & {
        applications?: Application[];
    };
    club: Club;
    onComplete?: () => void;
}

export function CardNominationApply({
    nomination,
    club,
    onComplete,
}: CardNominationApplyProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [statement, setStatement] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!statement.trim()) {
            toast.error('Please provide a statement');
            return;
        }

        try {
            setIsLoading(true);
            await applyForNomination({
                nominationId: nomination.id,
                statement: statement.trim(),
            });
            toast.success('Application submitted successfully');
            setStatement('');
            onComplete?.();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to submit application'
            );
            onComplete?.();
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
                    <Image
                        src={club.image}
                        alt={club.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 space-y-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-400">
                            {club.name}
                        </p>
                        <h3 className="text-xl font-semibold tracking-tight text-white/90">
                            {nomination.position}
                        </h3>
                    </div>
                    <p className="text-sm text-white/70">
                        {nomination.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                        <CalendarDays className="h-4 w-4" />
                        <span>
                            {new Date(
                                nomination.startDate
                            ).toLocaleDateString()}{' '}
                            -{' '}
                            {new Date(nomination.endDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor={`statement-${nomination.id}`}
                        className="text-sm font-medium text-white/90"
                    >
                        Your Statement
                    </label>
                    <Textarea
                        id={`statement-${nomination.id}`}
                        value={statement}
                        onChange={e => setStatement(e.target.value)}
                        placeholder="Why should you be selected for this position?"
                        className="min-h-[120px] resize-none border-white/10 bg-slate-800/50 text-white/90 placeholder:text-white/50"
                        disabled={isLoading}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700/90 hover:to-indigo-700/90"
                >
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
            </form>
        </div>
    );
}
