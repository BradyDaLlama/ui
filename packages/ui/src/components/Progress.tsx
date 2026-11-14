import type { CSSProperties, ReactNode } from 'react';
import type { ColorName } from '@bradydallama/tokens';
import { cx } from '../cx';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Circular progress (water intake, goal completion). `value` is 0–1. */
export function ProgressRing({
    value,
    size = 96,
    thickness = 10,
    label,
    color,
    children,
    className,
}: {
    value: number;
    size?: number;
    thickness?: number;
    label?: string;
    /** Fill color; defaults to secondary, or primary on light cards. */
    color?: ColorName;
    children?: ReactNode;
    className?: string;
}) {
    // Matches ProgressBar: a contrasting outline, a surface-colored outline, then a contrasting track with a 2px gap.
    const gap = 2;
    const outline = 2;
    const r = (size - thickness) / 2 - gap - outline * 2;
    const circumference = 2 * Math.PI * r;
    const v = clamp(value);
    return (
        <span
            className={cx('bd-ring', className)}
            style={{ width: size, height: size, '--progress-color': color && `var(--color-${color})` } as CSSProperties}
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(v * 100)}
        >
            <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
                <circle
                    className="bd-ring-outline"
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    strokeWidth={thickness + 2 * (gap + outline * 2)}
                />
                <circle
                    className="bd-ring-surface"
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    strokeWidth={thickness + 2 * (gap + outline)}
                />
                <circle className="bd-ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={thickness + 2 * gap} />
                <circle
                    className="bd-ring-fill"
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    strokeWidth={thickness}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - v)}
                />
            </svg>
            {children && <span className="bd-ring-content">{children}</span>}
        </span>
    );
}

export function ProgressBar({
    value,
    thickness = 6,
    label,
    color,
    className,
}: {
    value: number;
    /** Height of the fill in px; the gap and two outlines add 6px on each side. */
    thickness?: number;
    label?: string;
    /** Fill color; defaults to secondary, or primary on light cards. */
    color?: ColorName;
    className?: string;
}) {
    const v = clamp(value);
    return (
        <span
            className={cx('bd-bar', className)}
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(v * 100)}
            style={
                {
                    '--value': v,
                    '--progress-color': color && `var(--color-${color})`,
                    '--bar-thickness': `${thickness}px`,
                } as CSSProperties
            }
        >
            <span className="bd-bar-fill" />
        </span>
    );
}
