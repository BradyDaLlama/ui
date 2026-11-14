'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../cx';
import { IconButton } from './Button';

/** Native <dialog>. `sheet` docks to the bottom of the screen, which suits phones. */
export function Dialog({
    open,
    onClose,
    title,
    variant = 'center',
    children,
    className,
}: {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    variant?: 'center' | 'sheet';
    children: ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            className={cx('bd-dialog', className)}
            data-variant={variant}
            onClose={onClose}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bd-dialog-body">
                <header className="bd-dialog-header">
                    {title && <h2 className="bd-dialog-title">{title}</h2>}
                    <IconButton icon="mark-x" label="Close" variant="ghost" size="sm" onClick={onClose} />
                </header>
                {children}
            </div>
        </dialog>
    );
}
