'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    alt?: string;
    fallback?: string;
}

export function Avatar({
    src,
    alt,
    fallback,
    className,
    ...props
}: AvatarProps) {
    return (
        <div
            className={cn(
                'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
                className
            )}
            {...props}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt || ''}
                    className="aspect-square h-full w-full"
                    width={40}
                    height={40}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-800 text-sm font-medium text-white">
                    {fallback || alt?.charAt(0).toUpperCase() || '?'}
                </div>
            )}
        </div>
    );
}

export const AvatarImage = Avatar;
export const AvatarFallback = Avatar;
