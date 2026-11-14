# @bradydallama/ui

Outlined, pill-shaped React components with double-ring accents, from the bradydallama design system.

Published to GitHub Packages. Add an `.npmrc` next to your `package.json`, with `NPM_TOKEN` set to a GitHub
token that has `read:packages`:

```
@bradydallama:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

```bash
npm i @bradydallama/ui @bradydallama/tokens
```

```css
/* Tailwind v4 */
@import 'tailwindcss';
@import '@bradydallama/tokens/theme.css';
@import '@bradydallama/ui/styles.css';

/* or without Tailwind */
@import '@bradydallama/tokens/tokens.css';
@import '@bradydallama/ui/styles.css';
```

```tsx
import { Button, Card, ProgressRing } from '@bradydallama/ui';
import { AnimatedText } from '@bradydallama/ui/motion'; // needs gsap

<html data-case="lower">  {/* optional: lowercase all display text; inputs keep their case */}
<body className="bd-body">
```

## Theming

Everything themeable is a CSS variable, so a theme is one `:root` block in your stylesheet,
after the imports. Set only what you want to change; Tailwind utilities like `bg-primary` follow too.

```css
:root {
    /* colors: bg, bg-2, bg-3, bg-4, text, primary, primary-100, primary-200, secondary, bubble */
    --color-primary: #c8e6ff;
    /* corners: pill, card, bubble, sm */
    --radius-card: 16px;
    /* checkbox shapes: circle, rounded, square, star, sparkle, heart */
    --bd-check-shape: var(--bd-shape-star); /* default: rounded */
    --bd-check-strike-shape: var(--bd-shape-heart); /* default: star */
}
```

Scope a block to a class instead of `:root` to theme one part of a page. A component's own
props still win: `<Checkbox shape="circle" />`, or any SVG such as `<Checkbox shape={<Icon name="moon" />} />`.

### Light and dark surfaces

Components read surface-aware variables (`--bd-on`, `--bd-outline`, `--bd-surface`, `--bd-accent`,
`--bd-accent-ink`, `--bd-edge`, `--bd-track`, `--bd-fill`) and fall back to the dark-page look. Inside a
light `Card` (the default tone) they switch automatically, so a primary button turns navy with peach ink,
inputs get a navy border, and outlines, labels and icons flip to navy.

For any other light container, opt in with `data-surface="light"` (or the `bd-surface-light` class).
`data-surface="dark"` (or `bd-surface-dark`) switches back, for example a dark panel inside a light card.
These work on a single component too: `<Button data-surface="dark">` keeps the peach look anywhere.
Explicit attributes win over the automatic card rule.

## Components

`Button` · `IconButton` · `Card` · `Pill` · `RingLabel` · `Bubble` · `Input` · `Checkbox` · `Switch` ·
`ProgressRing` · `ProgressBar` · `Spinner` · `Tooltip` · `Clipboard` · `Dialog` (center or bottom sheet) ·
`ColorPicker` (hue, saturation, brightness, opacity) · `ColorSwatches` (presets) ·
`IconPicker` (scrollable, searchable grid) · `Icon` (96 icons) ·
`AnimatedText` / `AnimatedElement` · `stagger()` + `bd-in-fade` / `bd-in-scale` / `bd-in-spin`

Color helpers (server-callable): `parseColor` · `formatColor` · `sameColor` · `readableInk`

## Long press

`Button` and `IconButton` take `onLongPress` (and optional `longPressMs`, default 500). A tap still runs
`onClick`; holding runs `onLongPress` instead, and the button sinks in over the hold. Right-click and the
Menu key / Shift+F10 also run it, so the action stays reachable without a long press. It works with touch
and a mouse, blocks the browser's own long-press menu and text selection, and vibrates briefly where the
browser allows (Android Chrome).

```tsx
<Button onClick={open} onLongPress={edit}>Skincare</Button>
```

For other elements, `useLongPress({ onTap, onLongPress })` returns `{ handlers, pressing }` to spread onto
any element; `withLongPress(props, handlers)` merges them with the element's own event handlers.

## Pickers

`ColorPicker` is the free-form picker ported from orbt: a saturation / brightness area, a hue bar,
an optional opacity bar, a text field that reads and writes hex, rgb or hsl, optional preset swatches,
and an optional tools pane with shades and color harmonies. It always reports a hex color.

```tsx
import { ColorPicker, ColorSwatches, IconPicker, readableInk, type ColorSwatch } from '@bradydallama/ui';

const presets: ColorSwatch[] = [
    { value: 'mint', label: 'Mint', fill: '#a8e6cf', ink: '#10212a' },
    { value: 'sky', label: 'Sky', fill: '#9ad0f5' }, // ink defaults to the bg token
];

<ColorPicker label="Color" value={hex} onChange={setHex} swatches={presets} tools />
<ColorPicker label="Overlay" value={hex} onChange={setHex} alpha input={false} />
<span style={{ background: hex, color: readableInk(hex) }}>Aa</span>
```

`ColorSwatches` and `IconPicker` are controlled radio groups: click, or use the arrow keys
(Home / End jump to the ends).

```tsx
<ColorSwatches label="Theme" colors={presets} value={name} onChange={(value, swatch) => setName(value)} />
<ColorSwatches aria-label="Theme" value={name} onChange={setName} /> // colors default to tokenSwatches

<IconPicker
    label="Icon"
    value={icon}
    onChange={setIcon}
    icons={['star', 'heart', 'moon', 'sun']} // optional subset; defaults to pickableIconNames
    accent={swatch.fill} // selected fill, defaults to the primary token
    accentInk={swatch.ink}
    searchable // optional search by name and tag
    maxHeight="10rem" // the grid scrolls past this
/>
```

## Fonts

Set `--bd-font-display` to your display face. Without it, components fall back to Zen Maru Gothic /
M PLUS Rounded 1c (both OFL) and then system rounded fonts.
