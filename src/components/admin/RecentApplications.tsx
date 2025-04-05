'use client';

import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface RecentApplicationsProps {
    data: {
        id: string;
        user: {
            name: string | null;
            image: string | null;
            studentId: string | null;
        };
        nomination: {
            position: string;
            club: {
                name: string;
            };
        };
        status: string;
        createdAt: Date;
    }[];
}

export function RecentApplications({ data }: RecentApplicationsProps) {
    return (
        <div className="space-y-8">
            {data.map(application => (
                <div key={application.id} className="flex items-center">
                    <Avatar
                        src={application.user.image || undefined}
                        alt={application.user.name || 'User'}
                        fallback={(application.user.name || 'U')
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()}
                    />
                    <div className="ml-4 space-y-1">
                        <p className="text-sm leading-none font-medium">
                            {application.user.name ||
                                application.user.studentId}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Applied for {application.nomination.position} at{' '}
                            {application.nomination.club.name}
                        </p>
                    </div>
                    <div className="text-muted-foreground ml-auto text-sm">
                        {formatDistanceToNow(new Date(application.createdAt), {
                            addSuffix: true,
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
