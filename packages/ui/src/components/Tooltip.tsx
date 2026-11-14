'use client';
import { useState, type ReactNode } from 'react';
import { cx } from '../cx';

export type TooltipLocation = 'top' | 'right' | 'bottom' | 'left';

export function Tooltip({
    text,
    children,
    location = 'top',
    className,
}: {
    text: string;
    children: ReactNode;
    location?: TooltipLocation;
    className?: string;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <span
            className="bd-tooltip-anchor"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
            onClick={() => setVisible(false)}
        >
            {children}
            <span
                role="tooltip"
                className={cx('bd-tooltip', className)}
                data-location={location}
                data-visible={visible}
            >
                {text}
            </span>
        </span>
    );
}
