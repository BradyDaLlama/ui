import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { cx } from '../cx';
import { Icon, type IconName } from './Icon';
import { useLongPress, withLongPress } from './useLongPress';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/** Shared by Button and IconButton. */
type LongPressProps = {
    /**
     * Runs when the button is held (about half a second), right-clicked, or
     * opened with the Menu key / Shift+F10. A plain tap still runs `onClick`.
     * While held, the button sinks in slightly so it reads as "keep holding".
     */
    onLongPress?: () => void;
    /** Hold duration in ms for `onLongPress`. Default 500. */
    longPressMs?: number;
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    LongPressProps & {
        variant?: ButtonVariant;
        size?: 'sm' | 'md' | 'lg';
        icon?: IconName;
        iconPosition?: 'start' | 'end';
    };

/**
 * Adds long-press handling to a button's props when `onLongPress` is set;
 * returns them unchanged otherwise. Hooks run either way (rules of hooks).
 */
function useLongPressProps({
    onLongPress,
    longPressMs,
    onClick,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & LongPressProps) {
    const { handlers, pressing } = useLongPress({
        onLongPress: () => onLongPress?.(),
        onTap: (e) => onClick?.(e as MouseEvent<HTMLButtonElement>),
        ms: longPressMs,
    });
    if (!onLongPress) return { ...props, onClick };
    return {
        ...withLongPress(props as Record<string, unknown>, handlers),
        'data-pressing': pressing || undefined,
    } as ButtonHTMLAttributes<HTMLButtonElement>;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = 'primary', size = 'md', icon, iconPosition = 'start', className, children, type = 'button', ...rest },
    ref,
) {
    const props = useLongPressProps(rest);
    const iconEl = icon && <Icon name={icon} size="xs" className="bd-button-icon" />;
    return (
        <button
            ref={ref}
            type={type}
            className={cx('bd-button', className)}
            data-variant={variant}
            data-size={size}
            {...props}
        >
            {iconPosition === 'start' && iconEl}
            {children}
            {iconPosition === 'end' && iconEl}
        </button>
    );
});

export type IconButtonProps = Omit<ButtonProps, 'icon' | 'iconPosition' | 'children'> & {
    icon: IconName;
    /** Required: icon-only buttons need an accessible name. */
    label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
    { icon, label, variant = 'secondary', size = 'md', className, type = 'button', ...rest },
    ref,
) {
    const props = useLongPressProps(rest);
    return (
        <button
            ref={ref}
            type={type}
            aria-label={label}
            title={label}
            className={cx('bd-button', 'bd-icon-button', className)}
            data-variant={variant}
            data-size={size}
            {...props}
        >
            <Icon name={icon} size={size === 'lg' ? 'sm' : 'xs'} />
        </button>
    );
});
