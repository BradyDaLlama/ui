import type { CSSProperties, ReactNode } from 'react';
import type { ColorName } from '@bradydallama/tokens';
import { cx } from '../cx';

export type BubbleTail =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'right-top'
    | 'right-center'
    | 'right-bottom'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'left-top'
    | 'left-center'
    | 'left-bottom';

// Drawn three times: a fill on top to hide the border seam, then the inner and outer outline strokes behind.
function Tail({ layer }: { layer: 0 | 1 | 2 }) {
    return (
        <svg
            className="bd-bubble-tail"
            data-layer={layer}
            width="40"
            height="27.62"
            viewBox="-16 -12 173 120"
            fill="none"
            aria-hidden
        >
            <path
                d="M60.9785 10.8291C66.5838 3.67283 77.4162 3.67283 83.0215 10.8291L125.932 65.6182C133.128 74.8072 126.581 88.25 114.909 88.25H29.0908C17.4191 88.25 10.8721 74.8072 18.0684 65.6182L60.9785 10.8291Z"
                fill="currentColor"
            />
        </svg>
    );
}

/** Speech bubble with a double outline and a tail (the old ContentBubble). */
export function Bubble({
    children,
    tail = 'top-left',
    oneLine = false,
    textColor = 'text',
    bgColor = 'bubble',
    outline1 = 'bg',
    outline2 = 'primary',
    className,
}: {
    children: ReactNode;
    tail?: BubbleTail | 'none';
    oneLine?: boolean;
    textColor?: ColorName;
    bgColor?: ColorName;
    outline1?: ColorName;
    outline2?: ColorName;
    className?: string;
}) {
    const style = {
        '--bubble-text': `var(--color-${textColor})`,
        '--bubble-bg': `var(--color-${bgColor})`,
        '--bubble-outline-1': `var(--color-${outline1})`,
        '--bubble-outline-2': `var(--color-${outline2})`,
    } as CSSProperties;

    return (
        <span className="bd-bubble-wrapper" style={style}>
            <span className="bd-bubble" data-tail={tail}>
                {tail !== 'none' && (
                    <>
                        <Tail layer={1} />
                        <Tail layer={2} />
                    </>
                )}
                <span className={cx('bd-bubble-content', className)} data-one-line={oneLine || undefined}>
                    {children}
                </span>
                {tail !== 'none' && <Tail layer={0} />}
            </span>
        </span>
    );
}
