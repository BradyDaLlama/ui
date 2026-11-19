import {
    forwardRef,
    useId,
    type CSSProperties,
    type InputHTMLAttributes,
    type ReactElement,
    type ReactNode,
} from 'react';
import { cx } from '../cx';

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label?: ReactNode };

/** Shapes shipped as `--bd-shape-*` CSS variables. */
export type CheckboxShapeName = 'circle' | 'rounded' | 'square' | 'star' | 'sparkle' | 'heart';
export const checkboxShapes: CheckboxShapeName[] = ['circle', 'rounded', 'square', 'star', 'sparkle', 'heart'];

/** A shipped shape name, or any SVG element (e.g. `<Icon name="moon" />`). */
export type CheckboxShape = CheckboxShapeName | ReactElement;

/**
 * Without `shape`, the shape comes from CSS: `--bd-check-shape` (default `var(--bd-shape-rounded)`)
 * and, for `strike` checkboxes, `--bd-check-strike-shape` (default `var(--bd-shape-star)`).
 */
export const Checkbox = forwardRef<HTMLInputElement, ToggleProps & { strike?: boolean; shape?: CheckboxShape }>(
    function Checkbox({ label, strike, shape, id, className, ...props }, ref) {
        const fallbackId = useId();
        const inputId = id ?? fallbackId;
        const isSvg = shape !== undefined && typeof shape !== 'string';
        const style =
            typeof shape === 'string'
                ? ({ '--bd-check-own-shape': `var(--bd-shape-${shape})` } as CSSProperties)
                : undefined;
        return (
            <label htmlFor={inputId} className={cx('bd-check', className)} data-strike={strike || undefined}>
                <span className="bd-check-box" data-shape={isSvg ? 'svg' : 'css'} style={style}>
                    <input ref={ref} id={inputId} type="checkbox" className="bd-check-input" {...props} />
                    <span className="bd-check-fill" aria-hidden>
                        {isSvg && shape}
                    </span>
                    <span className="bd-check-outline" aria-hidden>
                        {isSvg && shape}
                    </span>
                </span>
                {label && <span className="bd-check-label">{label}</span>}
            </label>
        );
    },
);

export const Switch = forwardRef<HTMLInputElement, ToggleProps>(function Switch(
    { label, id, className, ...props },
    ref,
) {
    const fallbackId = useId();
    const inputId = id ?? fallbackId;
    return (
        <label htmlFor={inputId} className={cx('bd-switch', className)}>
            <input ref={ref} id={inputId} type="checkbox" role="switch" className="bd-switch-input" {...props} />
            {label && <span>{label}</span>}
        </label>
    );
});
