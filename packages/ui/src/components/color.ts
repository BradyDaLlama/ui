// Color math for ColorPicker (ported from orbt's picker, without chroma-js).
// HSV is the working model: hue 0-360, saturation / value 0-100, alpha 0-1.

export type Hsv = { h: number; s: number; v: number; a: number };
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const wrapHue = (h: number) => ((h % 360) + 360) % 360;

export function hsvToRgb({ h, s, v }: Hsv) {
    const sf = s / 100;
    const vf = v / 100;
    const channel = (n: number) => {
        const k = (n + (h / 360) * 6) % 6;
        return vf - vf * sf * Math.max(0, Math.min(k, 4 - k, 1));
    };
    return { r: Math.round(channel(5) * 255), g: Math.round(channel(3) * 255), b: Math.round(channel(1) * 255) };
}

export function rgbToHsv(r: number, g: number, b: number, a = 1): Hsv {
    const [rf, gf, bf] = [r / 255, g / 255, b / 255];
    const max = Math.max(rf, gf, bf);
    const delta = max - Math.min(rf, gf, bf);
    let h = 0;
    if (delta !== 0) {
        if (max === rf) h = 60 * (((gf - bf) / delta) % 6);
        else if (max === gf) h = 60 * ((bf - rf) / delta + 2);
        else h = 60 * ((rf - gf) / delta + 4);
    }
    return { h: wrapHue(h), s: max === 0 ? 0 : (delta / max) * 100, v: max * 100, a };
}

export function hsvToHsl({ h, s, v }: Hsv) {
    const sf = s / 100;
    const vf = v / 100;
    const l = vf * (1 - sf / 2);
    const sl = l === 0 || l === 1 ? 0 : (vf - l) / Math.min(l, 1 - l);
    return { h, s: sl * 100, l: l * 100 };
}

export function hslToHsv(h: number, s: number, l: number, a = 1): Hsv {
    const sf = s / 100;
    const lf = l / 100;
    const v = lf + sf * Math.min(lf, 1 - lf);
    return { h: wrapHue(h), s: v === 0 ? 0 : 2 * (1 - lf / v) * 100, v: v * 100, a };
}

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, '0');

/** `#rrggbb`, or `#rrggbbaa` when alpha is below 1. Lowercase. */
export function hsvToHex(hsv: Hsv) {
    const { r, g, b } = hsvToRgb(hsv);
    const base = `#${hex2(r)}${hex2(g)}${hex2(b)}`;
    return hsv.a >= 1 ? base : `${base}${hex2(clamp(hsv.a, 0, 1) * 255)}`;
}

/** Parses hex (3, 6 or 8 digits, `#` optional), `rgb()` / `rgba()` and `hsl()` / `hsla()`. */
export function parseColor(input: string): Hsv | null {
    const text = input.trim();

    const hex = text.replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(hex)) return parseColor(hex.replace(/./g, '$&$&'));
    if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) {
        const n = (i: number) => parseInt(hex.slice(i, i + 2), 16);
        return rgbToHsv(n(0), n(2), n(4), hex.length === 8 ? n(6) / 255 : 1);
    }

    const num = String.raw`(-?\d*\.?\d+)`;
    const sep = String.raw`\s*[ ,/]\s*`;
    const rgb = text.match(
        new RegExp(String.raw`^rgba?\(\s*${num}${sep}${num}${sep}${num}(?:${sep}${num})?\s*\)$`, 'i'),
    );
    if (rgb) {
        const [r, g, b] = [rgb[1], rgb[2], rgb[3]].map(Number);
        const a = rgb[4] !== undefined ? Number(rgb[4]) : 1;
        if ([r, g, b].some((c) => c < 0 || c > 255) || a < 0 || a > 1) return null;
        return rgbToHsv(r, g, b, a);
    }

    const hsl = text.match(
        new RegExp(String.raw`^hsla?\(\s*${num}(?:deg)?${sep}${num}%${sep}${num}%(?:${sep}${num})?\s*\)$`, 'i'),
    );
    if (hsl) {
        const [h, s, l] = [hsl[1], hsl[2], hsl[3]].map(Number);
        const a = hsl[4] !== undefined ? Number(hsl[4]) : 1;
        if (s < 0 || s > 100 || l < 0 || l > 100 || a < 0 || a > 1) return null;
        return hslToHsv(h, s, l, a);
    }
    return null;
}

export function formatColor(hsv: Hsv, format: ColorFormat) {
    const a = Number(hsv.a.toFixed(3));
    if (format === 'rgb') {
        const { r, g, b } = hsvToRgb(hsv);
        return a >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    if (format === 'hsl') {
        const { h, s, l } = hsvToHsl(hsv);
        const [hr, sr, lr] = [Math.round(h), Math.round(s), Math.round(l)];
        return a >= 1 ? `hsl(${hr}, ${sr}%, ${lr}%)` : `hsla(${hr}, ${sr}%, ${lr}%, ${a})`;
    }
    return hsvToHex(hsv);
}

/** Same color, ignoring how it is written. */
export function sameColor(a: string, b: string) {
    const pa = parseColor(a);
    const pb = parseColor(b);
    return !!pa && !!pb && hsvToHex(pa) === hsvToHex(pb);
}

/** Shift an HSV color in HSL space: hue by degrees, lightness by percentage points. */
export function shiftHsl(hsv: Hsv, hue: number, lightness: number): Hsv {
    const { h, s, l } = hsvToHsl(hsv);
    return hslToHsv(h + hue, s, clamp(l + lightness, 0, 100), hsv.a);
}

function luminance(hsv: Hsv) {
    const { r, g, b } = hsvToRgb(hsv);
    const lin = (c: number) => {
        const f = c / 255;
        return f <= 0.03928 ? f / 12.92 : ((f + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * The more readable of a dark and a light ink on top of `color` (WCAG contrast).
 * Defaults to the token navy and cloud.
 */
export function readableInk(color: string, dark = '#10212a', light = '#f3f2ff') {
    const bg = parseColor(color);
    const d = parseColor(dark);
    const l = parseColor(light);
    if (!bg || !d || !l) return dark;
    const contrast = (x: number, y: number) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    const lb = luminance(bg);
    return contrast(lb, luminance(d)) >= contrast(lb, luminance(l)) ? dark : light;
}
