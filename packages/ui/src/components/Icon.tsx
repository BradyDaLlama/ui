import type { SVGProps } from 'react';
import icons from '../icons/icons.json';
import { cx } from '../cx';
import { Tooltip, type TooltipLocation } from './Tooltip';

export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as IconName[];

// Icons are stored as raw SVG strings; split them once into viewBox + inner markup.
const parsed = new Map<string, { viewBox: string; inner: string }>();
function parse(name: string) {
    let entry = parsed.get(name);
    if (!entry) {
        const svg = (icons as Record<string, { svg: string }>)[name]?.svg ?? icons['lost-icon'].svg;
        entry = {
            viewBox: svg.match(/viewBox=["']([^"']+)["']/)?.[1] ?? '0 0 24 24',
            inner: svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1] ?? '',
        };
        parsed.set(name, entry);
    }
    return entry;
}

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
    name: IconName;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /** Accessible label; icons are decorative (aria-hidden) without one. */
    label?: string;
    tooltip?: string | { text: string; location?: TooltipLocation };
};

export function Icon({ name, size = 'sm', label, tooltip, className, ...props }: IconProps) {
    const { viewBox, inner } = parse(name);
    const svg = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
            // The source SVGs declare fill="none" on the root; without it, stroke-only shapes
            // (mark-check, link, click-1, clip) pick up the default black fill.
            fill="none"
            className={cx('bd-icon', className)}
            data-size={size}
            role={label ? 'img' : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            dangerouslySetInnerHTML={{ __html: inner }}
            {...props}
        />
    );

    if (!tooltip) return svg;
    const t = typeof tooltip === 'string' ? { text: tooltip } : tooltip;
    return (
        <Tooltip text={t.text} location={t.location}>
            {svg}
        </Tooltip>
    );
}
