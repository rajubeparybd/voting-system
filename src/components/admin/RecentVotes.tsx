'use client';

import { formatDistanceToNow } from 'date-fns';

interface RecentVotesProps {
    data: {
        id: string;
        event: {
            title: string;
            club: {
                name: string;
            };
        };
        createdAt: Date;
    }[];
}

export function RecentVotes({ data }: RecentVotesProps) {
    return (
        <div className="space-y-8">
            {data.map(vote => (
                <div key={vote.id} className="flex items-center">
                    <div className="space-y-1">
                        <p className="text-sm leading-none font-medium">
                            {vote.event.title}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            {vote.event.club.name}
                        </p>
                    </div>
                    <div className="text-muted-foreground ml-auto text-sm">
                        {formatDistanceToNow(new Date(vote.createdAt), {
                            addSuffix: true,
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
