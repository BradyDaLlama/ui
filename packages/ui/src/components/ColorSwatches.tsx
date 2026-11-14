import { palette } from '@bradydallama/tokens';
import { useId, useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../cx';
import { Icon } from './Icon';
import { focusRadio, nextRadioIndex } from './radioGroup';

export type ColorSwatch = {
    /** What `value` / `onChange` use, e.g. a palette key like "peach" or a hex string. */
    value: string;
    /** Accessible name and tooltip for the swatch. */
    label: string;
    /** Swatch color (any CSS color). */
    fill: string;
    /** Color drawn on top of the fill (the check mark). Defaults to the background token. */
    ink?: string;
};

/** Swatches built from the token palette, for apps without their own list. */
export const tokenSwatches: ColorSwatch[] = [
    { value: 'peach', label: 'Peach', fill: palette.peach, ink: palette.navy900 },
    { value: 'pink', label: 'Pink', fill: palette.pink, ink: palette.navy900 },
    { value: 'rose', label: 'Rose', fill: palette.rose, ink: palette.cloud },
    { value: 'wine', label: 'Wine', fill: palette.wine, ink: palette.cloud },
    { value: 'cloud', label: 'Cloud', fill: palette.cloud, ink: palette.navy900 },
    { value: 'slate', label: 'Slate', fill: palette.navy600, ink: palette.cloud },
];

export type ColorSwatchesProps = {
    value: string;
    onChange: (value: string, swatch: ColorSwatch) => void;
    /** Defaults to `tokenSwatches`. */
    colors?: readonly ColorSwatch[];
    /** Visible group label; pass `aria-label` instead when there is no visible label. */
    label?: ReactNode;
    'aria-label'?: string;
    /** Swatch size. */
    size?: 'sm' | 'md';
    /** Adds a hidden input carrying `value`, for plain form posts. */
    name?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
    style?: CSSProperties;
};

/** A row of round color swatches with radio-group semantics (preset colors). */
export function ColorSwatches({
    value,
    onChange,
    colors = tokenSwatches,
    label,
    'aria-label': ariaLabel,
    size = 'md',
    name,
    disabled,
    id,
    className,
    style,
}: ColorSwatchesProps) {
    const labelId = useId();
    const groupRef = useRef<HTMLDivElement>(null);
    const selected = colors.findIndex((c) => c.value === value);
    const tabStop = selected >= 0 ? selected : 0;

    function select(index: number) {
        const swatch = colors[index];
        if (swatch && swatch.value !== value) onChange(swatch.value, swatch);
    }

    function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (disabled) return;
        const current = colors.findIndex((c) => c.value === (event.target as HTMLElement).dataset.value);
        const next = nextRadioIndex(event, current >= 0 ? current : tabStop, colors.length);
        if (next === null) return;
        event.preventDefault();
        select(next);
        if (groupRef.current) focusRadio(groupRef.current, next);
    }

    return (
        <div className={cx('bd-field', 'bd-picker', className)} style={style}>
            {label && (
                <span id={labelId} className="bd-field-label">
                    {label}
                </span>
            )}
            <div
                ref={groupRef}
                id={id}
                role="radiogroup"
                aria-labelledby={label ? labelId : undefined}
                aria-label={label ? undefined : ariaLabel}
                aria-disabled={disabled || undefined}
                className="bd-swatches"
                data-size={size}
                onKeyDown={onKeyDown}
            >
                {colors.map((swatch, index) => {
                    const checked = index === selected;
                    return (
                        <button
                            key={swatch.value}
                            type="button"
                            role="radio"
                            aria-checked={checked}
                            aria-label={swatch.label}
                            title={swatch.label}
                            data-value={swatch.value}
                            tabIndex={index === tabStop ? 0 : -1}
                            disabled={disabled}
                            className="bd-swatch"
                            style={
                                {
                                    '--bd-swatch-fill': swatch.fill,
                                    '--bd-swatch-ink': swatch.ink ?? 'var(--color-bg)',
                                } as CSSProperties
                            }
                            onClick={() => select(index)}
                        >
                            <Icon name="mark-check" size="xs" className="bd-swatch-check" />
                        </button>
                    );
                })}
            </div>
            {name && <input type="hidden" name={name} value={value} />}
        </div>
    );
}
