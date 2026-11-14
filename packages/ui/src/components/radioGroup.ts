import type { KeyboardEvent } from 'react';

/**
 * Arrow-key handling shared by the pickers: a roving-tabindex radio group laid out as a grid.
 * Left/Right step one option, Up/Down step one row, Home/End jump to the ends. Moving also
 * selects, like native radio buttons. Returns the next index, or null when the key is not ours.
 */
export function nextRadioIndex(event: KeyboardEvent<HTMLElement>, index: number, count: number): number | null {
    if (count === 0) return null;
    const grid = event.currentTarget;
    const template = getComputedStyle(grid).gridTemplateColumns;
    const columns = Math.max(1, template && template !== 'none' ? template.split(' ').length : 1);
    const rtl = getComputedStyle(grid).direction === 'rtl';

    switch (event.key) {
        case 'ArrowRight':
            return (index + (rtl ? -1 : 1) + count) % count;
        case 'ArrowLeft':
            return (index + (rtl ? 1 : -1) + count) % count;
        case 'ArrowDown':
            return index + columns < count ? index + columns : index;
        case 'ArrowUp':
            return index - columns >= 0 ? index - columns : index;
        case 'Home':
            return 0;
        case 'End':
            return count - 1;
        default:
            return null;
    }
}

/** Focus the option at `index` inside a radio group element. */
export function focusRadio(group: HTMLElement, index: number) {
    const options = group.querySelectorAll<HTMLElement>('[role="radio"]');
    const option = options[index];
    option?.focus();
    option?.scrollIntoView?.({ block: 'nearest' });
}
