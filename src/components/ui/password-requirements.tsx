'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirementProps {
    password: string;
    showRequirements: boolean;
}

export function PasswordRequirements({
    password,
    showRequirements,
}: PasswordRequirementProps) {
    const requirements = [
        {
            text: 'At least 8 characters',
            test: () => password.length >= 8,
        },
        {
            text: 'Contains uppercase letter',
            test: () => /[A-Z]/.test(password),
        },
        {
            text: 'Contains lowercase letter',
            test: () => /[a-z]/.test(password),
        },
        {
            text: 'Contains number',
            test: () => /[0-9]/.test(password),
        },
        {
            text: 'Contains special character',
            test: () => /[^A-Za-z0-9]/.test(password),
        },
    ];

    if (!showRequirements) return null;

    return (
        <div className="animate-in fade-in slide-in-from-top-1 mt-2 space-y-2">
            {requirements.map((requirement, index) => {
                const isMet = requirement.test();
                return (
                    <div
                        key={index}
                        className={cn(
                            'flex items-center gap-2 text-sm transition-colors duration-200',
                            isMet ? 'text-green-500' : 'text-muted-foreground'
                        )}
                    >
                        {isMet ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : (
                            <XCircle className="h-4 w-4" />
                        )}
                        {requirement.text}
                    </div>
                );
            })}
        </div>
    );
}
