import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type MouseEvent,
    type PointerEvent,
} from 'react';

export type LongPressOptions = {
    /** Runs after a hold of `ms`. */
    onLongPress: () => void;
    /** Runs on an ordinary click/tap (not after a long press). Gets the click event. */
    onTap?: (e: MouseEvent<HTMLElement>) => void;
    /** Hold duration in ms. Default 500, about what phones use. */
    ms?: number;
    /** Movement in px that cancels the hold (it was a scroll or drag). Default 10. */
    slop?: number;
    /** Buzz briefly when it fires, where the browser allows (Android Chrome; not iOS Safari). Default true. */
    vibrate?: boolean;
};

export type LongPressHandlers = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: PointerEvent<HTMLElement>) => void;
    onPointerUp: (e: PointerEvent<HTMLElement>) => void;
    onPointerLeave: (e: PointerEvent<HTMLElement>) => void;
    onPointerCancel: (e: PointerEvent<HTMLElement>) => void;
    onClick: (e: MouseEvent<HTMLElement>) => void;
    onContextMenu: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
    style: CSSProperties;
};

/**
 * Tap does `onTap`; holding does `onLongPress` instead. Works with touch and
 * a mouse. Right-click and the keyboard's Menu key / Shift+F10 also fire
 * `onLongPress`, so the action stays reachable without a long press. Blocks
 * the browser's own long-press menu and text selection on the element.
 *
 * Spread `handlers` onto the element. `pressing` is true while a hold is in
 * progress (before it fires), for a visual cue. Button and IconButton take
 * `onLongPress` directly and use this for you.
 */
export function useLongPress({ onLongPress, onTap, ms = 500, slop = 10, vibrate = true }: LongPressOptions) {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const origin = useRef<{ x: number; y: number } | null>(null);
    const fired = useRef(false);
    const [pressing, setPressing] = useState(false);
    // Always call the latest callbacks without restarting a hold in progress.
    const latest = useRef({ onLongPress, onTap });
    latest.current = { onLongPress, onTap };

    const cancel = () => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        origin.current = null;
        setPressing(false);
    };
    useEffect(() => cancel, []);

    const fire = () => {
        fired.current = true;
        cancel();
        if (vibrate && typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(12);
        latest.current.onLongPress();
    };

    const handlers: LongPressHandlers = {
        onPointerDown: (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            fired.current = false;
            origin.current = { x: e.clientX, y: e.clientY };
            setPressing(true);
            timer.current = setTimeout(fire, ms);
        },
        onPointerMove: (e) => {
            const o = origin.current;
            if (o && Math.hypot(e.clientX - o.x, e.clientY - o.y) > slop) cancel();
        },
        onPointerUp: cancel,
        onPointerLeave: cancel,
        onPointerCancel: cancel,
        onClick: (e) => {
            // The click the browser sends after a long press shouldn't also tap.
            if (fired.current) {
                fired.current = false;
                e.preventDefault();
                return;
            }
            latest.current.onTap?.(e);
        },
        onContextMenu: (e) => {
            e.preventDefault();
            if (!fired.current) fire();
        },
        onKeyDown: (e) => {
            if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
                e.preventDefault();
                latest.current.onLongPress();
            }
        },
        style: { WebkitTouchCallout: 'none', userSelect: 'none', WebkitUserSelect: 'none' },
    };

    return { handlers, pressing };
}

/**
 * Runs the long-press handler and then the element's own handler for each
 * event, so a component's existing `onPointerDown`, `onKeyDown` etc. still run.
 */
export function withLongPress<P extends Record<string, unknown>>(props: P, lp: LongPressHandlers): P {
    const out: Record<string, unknown> = { ...props };
    for (const key of Object.keys(lp) as (keyof LongPressHandlers)[]) {
        if (key === 'style' || key === 'onClick') continue;
        const own = props[key] as ((e: unknown) => void) | undefined;
        const ours = lp[key] as (e: unknown) => void;
        out[key] = (e: unknown) => {
            ours(e);
            own?.(e);
        };
    }
    out.onClick = lp.onClick;
    out.style = { ...lp.style, ...(props.style as CSSProperties | undefined) };
    return out as P;
}
