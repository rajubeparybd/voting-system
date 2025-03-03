'use client';

import * as React from 'react';
import { ReactTyped } from 'react-typed';

interface TypedTextProps {
    strings: string[];
    typeSpeed?: number;
    backSpeed?: number;
    loop?: boolean;
    className?: string;
}

const TypedText = ({
    strings,
    typeSpeed = 70,
    backSpeed = 40,
    loop = true,
    className,
}: TypedTextProps) => {
    return (
        <ReactTyped
            strings={strings}
            typeSpeed={typeSpeed}
            backSpeed={backSpeed}
            loop={loop}
            className={className}
        />
    );
};

export { TypedText };
