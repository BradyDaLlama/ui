import type { CSSProperties } from 'react';

/** Inline style for the `bd-in-*` entrance animations: each item waits `index * delay`. */
export function stagger(index: number, delay = 0.05, duration?: number): CSSProperties {
    return {
        '--index': index,
        '--in-delay': `${delay}s`,
        ...(duration !== undefined && { '--in-duration': `${duration}s` }),
    } as CSSProperties;
}
