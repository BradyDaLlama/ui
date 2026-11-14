'use client';
import { memo, useEffect, useMemo, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { cx } from '../cx';

export type AnimationProps = {
    opacity?: number;
    y?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
    delay?: number;
};

/**
 * Animates its children (or descendants matching `.${select}`) in with a gsap stagger.
 *
 * It animates on mount, then again only when `animateKey` changes. Without an
 * `animateKey` it falls back to `children`, which re-animates whenever the
 * parent re-renders with new elements, so pass a key (such as the text) when
 * the parent re-renders often.
 */
export function AnimatedElement({
    children,
    select,
    className,
    from,
    to,
    animateKey,
}: {
    children: ReactNode;
    select?: string;
    className?: string;
    from?: AnimationProps;
    to?: AnimationProps;
    /** Re-run the animation only when this changes. */
    animateKey?: unknown;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    // Read the latest options inside the effect without making them a reason to re-animate.
    const options = useRef({ from, to });
    options.current = { from, to };
    const trigger = animateKey === undefined ? children : animateKey;

    useEffect(() => {
        if (!ref.current) return;
        const targets = select ? ref.current.querySelectorAll(`.${select}`) : ref.current.children;
        const tween = gsap.fromTo(
            targets,
            { opacity: 0, y: -8, ...options.current.from },
            {
                opacity: 1,
                y: 0,
                ease: 'elastic.out(0.7, 0.3)',
                duration: 0.4,
                stagger: 0.02,
                ...options.current.to,
            },
        );
        return () => {
            tween.kill();
        };
    }, [trigger, select]);

    return (
        <span ref={ref} className={cx('bd-animated', className)}>
            {children}
        </span>
    );
}

type AnimatedTextProps = {
    children: string;
    className?: string;
    from?: AnimationProps;
    to?: AnimationProps;
};

/**
 * Splits text into characters and bounces them in one by one. It animates
 * once when it mounts and again only when the text changes; parent re-renders
 * (even with new `from`/`to` objects) don't replay it.
 */
export const AnimatedText = memo(
    function AnimatedText({ children, className, from, to }: AnimatedTextProps) {
        const words = useMemo(
            () =>
                children.split(' ').map((word, w) => (
                    <span key={w} className="bd-animated-word">
                        {`${word} `.split('').map((char, c) => (
                            <span key={c} className="bd-animated-char">
                                {/* A plain space would collapse inside the span; keep it visible. */}
                                {char === ' ' ? ' ' : char}
                            </span>
                        ))}
                    </span>
                )),
            [children],
        );

        return (
            <AnimatedElement
                className={className}
                select="bd-animated-char"
                from={from}
                to={to}
                animateKey={children}
            >
                <span className="bd-sr-only">{children}</span>
                <span aria-hidden>{words}</span>
            </AnimatedElement>
        );
    },
    // `from`/`to` only shape the next animation, so new objects alone needn't re-render.
    (prev, next) => prev.children === next.children && prev.className === next.className,
);
