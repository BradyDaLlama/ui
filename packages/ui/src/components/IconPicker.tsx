import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import icons from '../icons/icons.json';
import { cx } from '../cx';
import { Icon, iconNames, type IconName } from './Icon';
import { Input } from './Input';
import { focusRadio, nextRadioIndex } from './radioGroup';

const iconTags = icons as Record<string, { tags?: string[] }>;

/** Every icon except the library's internal ones (the missing-icon fallback and similar). */
export const pickableIconNames: IconName[] = iconNames.filter((n) => !iconTags[n]?.tags?.includes('system'));

/** "flame-1" -> "flame 1". */
export function iconLabel(name: IconName) {
    return name.replace(/-/g, ' ');
}

export type IconPickerProps = {
    value: IconName;
    onChange: (value: IconName) => void;
    /** Icons to offer, in order. Defaults to `pickableIconNames`. */
    icons?: readonly IconName[];
    /** Accessible name and tooltip for each icon. Defaults to `iconLabel`. */
    getLabel?: (name: IconName) => string;
    /** Visible group label; pass `aria-label` instead when there is no visible label. */
    label?: ReactNode;
    'aria-label'?: string;
    /** Show a search field that filters by name and tag. */
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Fill behind the selected icon. Defaults to the primary token. */
    accent?: string;
    /** Icon color on the selected fill. Defaults to the background token. */
    accentInk?: string;
    /** Fixed column count; by default as many as fit. */
    columns?: number;
    /** Max grid height before it scrolls (any CSS length). */
    maxHeight?: string;
    /** Adds a hidden input carrying `value`, for plain form posts. */
    name?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
    style?: CSSProperties;
};

/** A scrollable grid of icons with radio-group semantics. */
export function IconPicker({
    value,
    onChange,
    icons: options = pickableIconNames,
    getLabel = iconLabel,
    label,
    'aria-label': ariaLabel,
    searchable,
    searchPlaceholder = 'Search icons',
    accent,
    accentInk,
    columns,
    maxHeight,
    name,
    disabled,
    id,
    className,
    style,
}: IconPickerProps) {
    const labelId = useId();
    const groupRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');

    const shown = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter(
            (n) => getLabel(n).toLowerCase().includes(q) || iconTags[n]?.tags?.some((t) => t.includes(q)),
        );
    }, [options, query, getLabel]);

    const selected = shown.indexOf(value);
    const tabStop = selected >= 0 ? selected : 0;

    function select(index: number) {
        const next = shown[index];
        if (next && next !== value) onChange(next);
    }

    function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (disabled) return;
        const current = shown.indexOf((event.target as HTMLElement).dataset.value as IconName);
        const next = nextRadioIndex(event, current >= 0 ? current : tabStop, shown.length);
        if (next === null) return;
        event.preventDefault();
        select(next);
        if (groupRef.current) focusRadio(groupRef.current, next);
    }

    const vars = {
        ...(accent && { '--bd-accent': accent }),
        ...(accentInk && { '--bd-accent-ink': accentInk }),
        ...(columns && { '--bd-picker-columns': columns }),
        ...(maxHeight && { '--bd-picker-height': maxHeight }),
        ...style,
    } as CSSProperties;

    return (
        <div className={cx('bd-field', 'bd-picker', className)} style={vars}>
            {label && (
                <span id={labelId} className="bd-field-label">
                    {label}
                </span>
            )}
            {searchable && (
                <Input
                    type="search"
                    value={query}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    disabled={disabled}
                    onChange={(e) => setQuery(e.target.value)}
                />
            )}
            <div
                ref={groupRef}
                id={id}
                role="radiogroup"
                aria-labelledby={label ? labelId : undefined}
                aria-label={label ? undefined : ariaLabel}
                aria-disabled={disabled || undefined}
                className="bd-icon-grid"
                data-columns={columns ? true : undefined}
                onKeyDown={onKeyDown}
            >
                {shown.map((icon, index) => {
                    const text = getLabel(icon);
                    return (
                        <button
                            key={icon}
                            type="button"
                            role="radio"
                            aria-checked={index === selected}
                            aria-label={text}
                            title={text}
                            data-value={icon}
                            tabIndex={index === tabStop ? 0 : -1}
                            disabled={disabled}
                            className="bd-icon-option"
                            onClick={() => select(index)}
                        >
                            <Icon name={icon} />
                        </button>
                    );
                })}
                {shown.length === 0 && <span className="bd-icon-grid-empty">No icons found</span>}
            </div>
            {name && <input type="hidden" name={name} value={value} />}
        </div>
    );
}
