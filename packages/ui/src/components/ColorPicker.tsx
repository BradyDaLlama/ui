import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
} from 'react';
import { cx } from '../cx';
import { Button } from './Button';
import { ColorSwatches, type ColorSwatch } from './ColorSwatches';
import { formatColor, hsvToHex, hsvToRgb, parseColor, sameColor, shiftHsl, type ColorFormat, type Hsv } from './color';

const FORMATS: ColorFormat[] = ['hex', 'rgb', 'hsl'];
const FALLBACK: Hsv = { h: 0, s: 0, v: 100, a: 1 };

// Tools pane (from orbt): a grid of hue / lightness neighbours and classic harmonies.
const GRID_ROWS = 3; // rows above and below the current color
const GRID_COLS = 4; // columns either side
const HUE_STEP = 25;
const LIGHT_STEP = 10;
const HARMONIES = [
    { name: 'Complementary', offsets: [180] },
    { name: 'Analogous', offsets: [30, 330] },
    { name: 'Triadic', offsets: [120, 240] },
    { name: 'Split', offsets: [150, 210] },
    { name: 'Square', offsets: [90, 180, 270] },
    { name: 'Tetradic', offsets: [60, 180, 240] },
];

export type ColorPickerProps = {
    /** Any CSS hex, rgb() or hsl() color. */
    value: string;
    /** Called with a lowercase hex color (`#rrggbb`, or `#rrggbbaa` with alpha). */
    onChange: (hex: string) => void;
    /** Visible label above the picker. */
    label?: ReactNode;
    /** Show the opacity bar. */
    alpha?: boolean;
    /** Preset colors shown as a swatch row; picking one sets its fill. */
    swatches?: readonly ColorSwatch[];
    /** Offer the tools pane (shades and color harmonies) next to the sliders. */
    tools?: boolean;
    /** Show the editable hex / rgb / hsl field. */
    input?: boolean;
    disabled?: boolean;
    /** Adds a hidden input carrying the hex value, for plain form posts. */
    name?: string;
    id?: string;
    className?: string;
    style?: CSSProperties;
};

/**
 * Free-form color picker, ported from orbt: a saturation / brightness area, hue and
 * opacity bars, a text field that reads hex, rgb or hsl, optional preset swatches and
 * an optional tools pane. Inline (no popover), so it fits in cards and sheets.
 */
export function ColorPicker({
    value,
    onChange,
    label,
    alpha = false,
    swatches,
    tools = false,
    input = true,
    disabled,
    name,
    id,
    className,
    style,
}: ColorPickerProps) {
    const labelId = useId();
    const [hsv, setHsv] = useState<Hsv>(() => parseColor(value) ?? FALLBACK);
    const emitted = useRef(value);
    const [mode, setMode] = useState<'sliders' | 'tools'>('sliders');

    // Follow outside changes to `value`, but keep our own HSV while it round-trips, so hue
    // survives greys and black (where hex alone has no hue).
    useEffect(() => {
        if (value === emitted.current || sameColor(value, emitted.current)) return;
        const parsed = parseColor(value);
        if (parsed) setHsv(parsed);
        emitted.current = value;
    }, [value]);

    function update(next: Hsv) {
        const fixed = alpha ? next : { ...next, a: 1 };
        setHsv(fixed);
        const hex = hsvToHex(fixed);
        emitted.current = hex;
        if (!sameColor(hex, value)) onChange(hex);
    }

    const hex = hsvToHex(hsv);
    const { r, g, b } = hsvToRgb(hsv);
    const vars = {
        '--bd-color-hue': hsv.h,
        '--bd-color-rgb': `${r}, ${g}, ${b}`,
        '--bd-color-value': hex,
        ...style,
    } as CSSProperties;

    const presetValue = swatches?.find((s) => sameColor(s.fill, hex))?.value ?? '';

    return (
        <div
            id={id}
            role="group"
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : 'Color'}
            aria-disabled={disabled || undefined}
            className={cx('bd-field', 'bd-color-picker', className)}
            style={vars}
        >
            {label && (
                <span id={labelId} className="bd-field-label">
                    {label}
                </span>
            )}

            {swatches && swatches.length > 0 && (
                <ColorSwatches
                    aria-label="Presets"
                    size="sm"
                    colors={swatches}
                    value={presetValue}
                    disabled={disabled}
                    onChange={(_, swatch) => {
                        const parsed = parseColor(swatch.fill);
                        if (parsed) update(parsed);
                    }}
                />
            )}

            {mode === 'sliders' ? (
                <SliderPane hsv={hsv} alpha={alpha} disabled={disabled} onChange={update} />
            ) : (
                <ToolsPane hsv={hsv} disabled={disabled} onPick={update} />
            )}

            {(input || tools) && (
                <div className="bd-color-row">
                    <span className="bd-color-chip" aria-hidden />
                    {input && <ColorField hsv={hsv} disabled={disabled} onChange={update} />}
                    {tools && (
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={disabled}
                            aria-pressed={mode === 'tools'}
                            onClick={() => setMode(mode === 'sliders' ? 'tools' : 'sliders')}
                        >
                            {mode === 'sliders' ? 'Tools' : 'Sliders'}
                        </Button>
                    )}
                </div>
            )}
            {name && <input type="hidden" name={name} value={hex} />}
        </div>
    );
}

/* ---------------- sliders ---------------- */

function SliderPane({
    hsv,
    alpha,
    disabled,
    onChange,
}: {
    hsv: Hsv;
    alpha: boolean;
    disabled?: boolean;
    onChange: (next: Hsv) => void;
}) {
    const areaRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);

    function fromPointer(event: PointerEvent<HTMLDivElement>) {
        const rect = areaRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
        onChange({ ...hsv, s: Math.round(x * 1000) / 10, v: Math.round((1 - y) * 1000) / 10 });
    }

    function onAreaKey(event: KeyboardEvent<HTMLDivElement>) {
        const step = event.shiftKey ? 10 : 1;
        const moves: Record<string, [number, number]> = {
            ArrowLeft: [-step, 0],
            ArrowRight: [step, 0],
            ArrowUp: [0, step],
            ArrowDown: [0, -step],
        };
        const move = moves[event.key];
        if (!move) return;
        event.preventDefault();
        const clamp = (n: number) => Math.min(100, Math.max(0, n));
        onChange({ ...hsv, s: clamp(hsv.s + move[0]), v: clamp(hsv.v + move[1]) });
    }

    return (
        <>
            <div
                ref={areaRef}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-label="Saturation and brightness"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(hsv.s)}
                aria-valuetext={`saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%`}
                aria-disabled={disabled || undefined}
                className="bd-color-area"
                onKeyDown={disabled ? undefined : onAreaKey}
                onPointerDown={(event) => {
                    if (disabled) return;
                    event.preventDefault();
                    event.currentTarget.focus();
                    event.currentTarget.setPointerCapture(event.pointerId);
                    dragging.current = true;
                    fromPointer(event);
                }}
                onPointerMove={(event) => dragging.current && fromPointer(event)}
                onPointerUp={() => (dragging.current = false)}
                onPointerCancel={() => (dragging.current = false)}
            >
                <span className="bd-color-thumb" style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }} />
            </div>
            <Bar
                kind="hue"
                label="Hue"
                max={360}
                value={hsv.h}
                disabled={disabled}
                onChange={(h) => onChange({ ...hsv, h })}
            />
            {alpha && (
                <Bar
                    kind="alpha"
                    label="Opacity"
                    max={100}
                    value={Math.round(hsv.a * 100)}
                    disabled={disabled}
                    onChange={(a) => onChange({ ...hsv, a: a / 100 })}
                />
            )}
        </>
    );
}

/** A gradient track over a native range input, so it keeps keyboard and screen-reader support. */
function Bar({
    kind,
    label,
    max,
    value,
    disabled,
    onChange,
}: {
    kind: 'hue' | 'alpha';
    label: string;
    max: number;
    value: number;
    disabled?: boolean;
    onChange: (value: number) => void;
}) {
    return (
        <span className="bd-color-bar" data-kind={kind}>
            <input
                type="range"
                min={0}
                max={max}
                step={1}
                value={Math.round(value)}
                aria-label={label}
                disabled={disabled}
                className="bd-color-range"
                onChange={(e) => onChange(Number(e.target.value))}
            />
            <span className="bd-color-bar-thumb" style={{ '--bd-at': value / max } as CSSProperties} />
        </span>
    );
}

/* ---------------- text field ---------------- */

function ColorField({ hsv, disabled, onChange }: { hsv: Hsv; disabled?: boolean; onChange: (next: Hsv) => void }) {
    const [format, setFormat] = useState<ColorFormat>('hex');
    const [draft, setDraft] = useState<string | null>(null);
    const shown = formatColor(hsv, format);

    return (
        <span className="bd-color-field">
            <button
                type="button"
                className="bd-color-format"
                disabled={disabled}
                aria-label={`Color format: ${format}. Switch format`}
                onClick={() => setFormat(FORMATS[(FORMATS.indexOf(format) + 1) % FORMATS.length])}
            >
                {format}
            </button>
            <input
                type="text"
                spellCheck={false}
                autoComplete="off"
                aria-label={`${format} value`}
                disabled={disabled}
                className="bd-color-text bd-keep-case"
                value={draft ?? shown}
                onFocus={() => setDraft(shown)}
                onChange={(e) => {
                    setDraft(e.target.value);
                    const parsed = parseColor(e.target.value);
                    if (parsed) onChange(parsed);
                }}
                onBlur={() => setDraft(null)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }
                }}
            />
        </span>
    );
}

/* ---------------- tools ---------------- */

function ToolsPane({ hsv, disabled, onPick }: { hsv: Hsv; disabled?: boolean; onPick: (next: Hsv) => void }) {
    const cells = useMemo(() => {
        const out: { key: string; hsv: Hsv; center: boolean }[] = [];
        for (let row = -GRID_ROWS; row <= GRID_ROWS; row++) {
            for (let col = -GRID_COLS; col <= GRID_COLS; col++) {
                out.push({
                    key: `${row}:${col}`,
                    hsv: shiftHsl(hsv, col * HUE_STEP, -row * LIGHT_STEP),
                    center: row === 0 && col === 0,
                });
            }
        }
        return out;
    }, [hsv]);

    const pick = (next: Hsv) => onPick({ ...next, a: hsv.a });
    const swatch = (c: Hsv, key: string, className: string, current = false) => {
        const hex = hsvToHex({ ...c, a: 1 });
        return (
            <button
                key={key}
                type="button"
                className={className}
                aria-label={`Pick ${hex}`}
                aria-current={current || undefined}
                title={hex}
                disabled={disabled}
                style={{ background: hex }}
                onClick={() => pick(c)}
            />
        );
    };

    return (
        <div className="bd-color-tools">
            <div className="bd-color-grid" style={{ '--bd-cols': GRID_COLS * 2 + 1 } as CSSProperties}>
                {cells.map((c) => swatch(c.hsv, c.key, 'bd-color-cell', c.center))}
            </div>
            <span className="bd-field-label">Harmonies</span>
            <div className="bd-color-harmonies">
                {HARMONIES.map(({ name, offsets }) => (
                    <div key={name} className="bd-color-harmony">
                        <span>{name}</span>
                        <div>
                            {[0, ...offsets].map((o) => swatch(shiftHsl(hsv, o, 0), `${name}${o}`, 'bd-color-dot'))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
