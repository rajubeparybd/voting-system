import { Club } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface CardReadyToLeadProps {
    clubs: Club[];
    isLoading: boolean;
    onApply: () => void;
}

export function CardReadyToLead({
    clubs,
    isLoading,
    onApply,
}: CardReadyToLeadProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-600/10 p-8 shadow-lg backdrop-blur-xl">
            <div className="relative z-10 flex items-start gap-4">
                <div className="rounded-xl bg-blue-500/20 p-4 backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-2xl font-semibold text-white/90">
                        Ready to Lead?
                    </h2>
                    <p className="text-white/70">
                        Join {clubs.length} club{clubs.length !== 1 ? 's' : ''}{' '}
                        as a candidate and make a difference!
                    </p>
                    <Button onClick={onApply} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Become a Candidate'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
