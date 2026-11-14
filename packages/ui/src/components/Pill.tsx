import { Children, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../cx';
import { Icon, type IconName } from './Icon';

export type PillTone = 'bubble' | 'primary' | 'secondary' | 'outline';

/** Rounded label: tags, counts, small statuses (the old TextBubble). */
export function Pill({
    tone = 'bubble',
    icon,
    className,
    children,
    ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: PillTone; icon?: IconName }) {
    // A side that ends in an icon gets tighter padding than a side that ends in text.
    const items = Children.toArray(children);
    const isIcon = (node: ReactNode) => isValidElement(node) && node.type === Icon;
    return (
        <span
            className={cx('bd-pill', className)}
            data-tone={tone}
            data-icon-start={icon || isIcon(items[0]) || undefined}
            data-icon-end={isIcon(items[items.length - 1]) || undefined}
            {...props}
        >
            {icon && <Icon name={icon} size="xs" />}
            {children}
        </span>
    );
}

/** Double-ringed label with an inset value, e.g. "streak [12 days]" (from the orbt id badge). */
export function RingLabel({
    label,
    value,
    tone = 'primary',
    className,
    ...props
}: HTMLAttributes<HTMLSpanElement> & { label: ReactNode; value: ReactNode; tone?: 'primary' | 'bubble' }) {
    return (
        <span className={cx('bd-ring-label', className)} data-tone={tone} {...props}>
            <span>{label}</span>
            <span className="bd-ring-label-value">{value}</span>
        </span>
    );
}
