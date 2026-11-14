import { cx } from '../cx';
import { Icon } from './Icon';

/** Spinning star. Fades out (and collapses) when `loading` turns false. */
export function Spinner({ loading = true, className }: { loading?: boolean; className?: string }) {
    return (
        <span
            className={cx('bd-spinner', className)}
            data-loading={loading}
            role="status"
            aria-label={loading ? 'loading' : undefined}
        >
            <Icon name="star" size="sm" />
        </span>
    );
}
