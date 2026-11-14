import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../cx';
import { Icon, type IconName } from './Icon';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: ReactNode;
    hint?: ReactNode;
    icon?: IconName;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, hint, icon, id, className, ...props },
    ref,
) {
    const fallbackId = useId();
    const inputId = id ?? fallbackId;
    return (
        <span className={cx('bd-field', className)}>
            {label && (
                <label htmlFor={inputId} className="bd-field-label">
                    {label}
                </label>
            )}
            <span className="bd-input-wrap">
                {icon && <Icon name={icon} size="xs" className="bd-input-icon" />}
                <input ref={ref} id={inputId} className="bd-input" data-has-icon={icon ? true : undefined} {...props} />
            </span>
            {hint && <span className="bd-field-hint">{hint}</span>}
        </span>
    );
});
