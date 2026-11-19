import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, Clipboard, Icon, Spinner, Tooltip } from '@bradydallama/ui';

const meta = { title: 'Components/Feedback' } satisfies Meta;
export default meta;
type Story = StoryObj;

const row = { display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' } as const;

export const SpinnerLoading: Story = { name: 'Spinner', render: () => <Spinner /> };

/** Toggle `loading` to watch it fade out and collapse. */
export const SpinnerToggle: Story = {
    name: 'Spinner (toggle)',
    render: function Render() {
        const [loading, setLoading] = useState(true);
        return (
            <div style={row}>
                <Button variant="secondary" onClick={() => setLoading((l) => !l)}>
                    {loading ? 'Finish loading' : 'Start loading'}
                </Button>
                <Spinner loading={loading} />
            </div>
        );
    },
};

export const Tooltips: Story = {
    render: () => (
        <div style={{ ...row, padding: '3rem', justifyContent: 'center' }}>
            {(['top', 'right', 'bottom', 'left'] as const).map((location) => (
                <Tooltip key={location} text={`Tooltip on ${location}`} location={location}>
                    <Button variant="secondary">{location}</Button>
                </Tooltip>
            ))}
            <Icon
                name="star"
                size="md"
                label="Star"
                tooltip={{ text: 'Icons take a tooltip prop', location: 'bottom' }}
            />
        </div>
    ),
};

export const ClipboardButtons: Story = {
    name: 'Clipboard',
    render: () => (
        <div style={row}>
            <span style={row}>
                Copy <Clipboard text="npm i @bradydallama/ui" />
            </span>
            <span style={row}>
                Paste <Clipboard onClick={() => {}} />
            </span>
        </div>
    ),
};
