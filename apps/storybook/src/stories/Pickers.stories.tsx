import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Card, ColorPicker, ColorSwatches, IconPicker, tokenSwatches, type IconName } from '@bradydallama/ui';

const meta = { title: 'Components/Pickers' } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Swatches: Story = {
    render: function Render() {
        const [value, setValue] = useState('peach');
        return (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <ColorSwatches label="Accent color" value={value} onChange={setValue} />
                <ColorSwatches aria-label="Small swatches" size="sm" value={value} onChange={setValue} />
                <ColorSwatches aria-label="Disabled swatches" value={value} onChange={setValue} disabled />
                <small>Selected: {value}</small>
            </div>
        );
    },
};

export const Color: Story = {
    name: 'Color picker',
    render: function Render() {
        const [value, setValue] = useState('#ff8fb1');
        return (
            <div style={{ maxWidth: 340 }}>
                <ColorPicker label="Highlight" value={value} onChange={setValue} />
            </div>
        );
    },
};

export const ColorFull: Story = {
    name: 'Color picker (alpha, swatches, tools)',
    render: function Render() {
        const [value, setValue] = useState('#c45478cc');
        return (
            <Card tone="dark" style={{ maxWidth: 380 }}>
                <ColorPicker
                    label="Theme color"
                    value={value}
                    onChange={setValue}
                    alpha
                    tools
                    swatches={tokenSwatches.map((s) => ({ ...s, value: s.fill }))}
                />
            </Card>
        );
    },
};

export const ColorDisabled: Story = {
    name: 'Color picker (disabled)',
    render: () => (
        <div style={{ maxWidth: 340 }}>
            <ColorPicker label="Locked" value="#455d6b" onChange={() => {}} disabled />
        </div>
    ),
};

export const Icons: Story = {
    name: 'Icon picker',
    render: function Render() {
        const [value, setValue] = useState<IconName>('star');
        return (
            <div style={{ maxWidth: 420 }}>
                <IconPicker label="List icon" value={value} onChange={setValue} searchable maxHeight="18rem" />
            </div>
        );
    },
};
