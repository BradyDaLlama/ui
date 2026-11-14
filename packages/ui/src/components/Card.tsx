import type { HTMLAttributes } from 'react';
import { cx } from '../cx';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
    tone?: 'dark' | 'light';
    /** Lifts on hover and presses down on tap. */
    interactive?: boolean;
    /** Adds the outer second outline. */
    ring?: boolean;
};

export function Card({ tone = 'light', interactive, ring, className, ...props }: CardProps) {
    return (
        <div
            className={cx('bd-card', className)}
            data-tone={tone}
            data-interactive={interactive || undefined}
            data-ring={ring || undefined}
            {...props}
        />
    );
}
