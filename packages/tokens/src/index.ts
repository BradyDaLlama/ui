// Single source of truth for the design system. `scripts/build.ts` turns this into
// CSS custom properties, a Tailwind v4 @theme file, and JSON for native (Kotlin) targets.

export const palette = {
    navy900: '#10212a',
    navy800: '#1d313c',
    navy700: '#2a4250',
    navy600: '#455d6b',
    peach: '#fde1c8',
    pink: '#ff8fb1',
    rose: '#c45478',
    wine: '#66213f',
    cloud: '#f3f2ff',
} as const;

// Names match the ones already used across bradydallama.com so existing classes
// (bg-primary, text-bg, border-bubble...) keep working.
export const colors = {
    bg: palette.navy900,
    'bg-2': palette.navy800,
    'bg-3': palette.navy700,
    'bg-4': palette.navy600,
    text: palette.navy900,
    primary: palette.peach,
    'primary-100': palette.rose,
    'primary-200': palette.wine,
    secondary: palette.pink,
    bubble: palette.cloud,
} as const;

export const fonts = {
    // Apps can point --bd-font-display at a licensed display face (e.g. Mini Wakuwaku Maru);
    // the fallbacks are freely licensed rounded fonts.
    display: "var(--bd-font-display, 'Zen Maru Gothic', 'M PLUS Rounded 1c', ui-rounded, system-ui, sans-serif)",
    body: "var(--bd-font-body, var(--bd-font-display, 'Zen Maru Gothic', ui-rounded, system-ui, sans-serif))",
} as const;

// rem values, multiplied by --font-modifier at runtime.
export const text = {
    xxs: 0.75,
    xs: 0.875,
    sm: 1,
    md: 1.25,
    lg: 1.5,
    xl: 2,
    '2xl': 3,
} as const;

// rem values, multiplied by --size-modifier at runtime (icon / avatar sizes).
export const sizes = {
    xs: 0.875,
    sm: 1.25,
    md: 2.5,
    lg: 4,
    xl: 6,
} as const;

export const radius = {
    pill: '100vh',
    card: '24px',
    bubble: '22px',
    sm: '12px',
} as const;

export const borders = {
    outline: '2px',
    ring: '6px',
} as const;

export const shadows = {
    sm: '0 4px 4px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.6)',
} as const;

export const motion = {
    fast: '0.2s',
    base: '0.3s',
    slow: '0.5s',
    ease: 'ease-in-out',
    // CSS approximation of gsap's elastic.out(0.7, 0.3)
    elastic: 'linear(0, 0.7 12%, 1.12 22%, 0.97 35%, 1.02 50%, 1)',
} as const;

export const tokens = { palette, colors, fonts, text, sizes, radius, borders, shadows, motion };
export type Tokens = typeof tokens;
export type ColorName = keyof typeof colors;
