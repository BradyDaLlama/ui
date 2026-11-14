'use client';
import { useState } from 'react';
import { Icon } from './Icon';

/** Copies `text`, or runs `onClick` (paste mode) when no text is given. */
export function Clipboard({ text, onClick }: { text?: string; onClick?: () => void }) {
    const [done, setDone] = useState(false);

    function handleClick() {
        if (text) navigator.clipboard.writeText(text);
        onClick?.();
        if (done) return;
        setDone(true);
        setTimeout(() => setDone(false), 3000);
    }

    const label =
        onClick && !text ? (done ? 'Pasted!' : 'Paste from clipboard') : done ? 'Copied!' : 'Copy to clipboard';

    return (
        <button type="button" className="bd-clipboard" onClick={handleClick} aria-label={label}>
            <Icon name={done ? 'clipboard-2' : 'clipboard'} tooltip={label} />
        </button>
    );
}
