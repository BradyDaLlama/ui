import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Icon, iconNames, Input } from '@bradydallama/ui';

const meta = {
    title: 'Foundations/Icons',
    component: Icon,
    args: { name: 'star', size: 'md' },
    argTypes: { name: { control: 'select', options: iconNames } },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Sizes: Story = {
    render: (args) => (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'end' }}>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: '0.5rem' }}>
                    <Icon {...args} size={size} />
                    <small>{size}</small>
                </div>
            ))}
        </div>
    ),
};

/** The full icon set, filterable by name. */
export const Gallery: Story = {
    render: function Render() {
        const [query, setQuery] = useState('');
        const shown = iconNames.filter((n) => n.includes(query.toLowerCase()));
        return (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ maxWidth: 280 }}>
                    <Input
                        aria-label="Filter icons"
                        icon="star"
                        placeholder={`Filter ${iconNames.length} icons`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {shown.map((name) => (
                        <div
                            key={name}
                            style={{ display: 'grid', justifyItems: 'center', gap: '0.5rem', textAlign: 'center' }}
                        >
                            <Icon name={name} size="md" />
                            <small style={{ opacity: 0.75, wordBreak: 'break-word' }}>{name}</small>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
};
