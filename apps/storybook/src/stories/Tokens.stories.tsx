import type { Meta, StoryObj } from '@storybook/react-vite';
import { colors, palette, radius, text } from '@bradydallama/tokens';
import { readableInk } from '@bradydallama/ui';

const meta = { title: 'Foundations/Tokens' } satisfies Meta;
export default meta;
type Story = StoryObj;

function Swatch({ name, value, cssVar }: { name: string; value: string; cssVar?: string }) {
    return (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
            <div
                style={{
                    height: 72,
                    borderRadius: 'var(--radius-sm)',
                    background: value,
                    color: readableInk(value),
                    border: '2px solid color-mix(in srgb, var(--color-bubble) 25%, transparent)',
                    display: 'grid',
                    placeItems: 'end start',
                    padding: '0.5rem 0.75rem',
                    fontSize: 'var(--text-xxs)',
                }}
            >
                {value}
            </div>
            <strong style={{ fontSize: 'var(--text-xs)' }}>{name}</strong>
            {cssVar && <code style={{ fontSize: 'var(--text-xxs)', opacity: 0.7 }}>{cssVar}</code>}
        </div>
    );
}

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.25rem' } as const;

export const SemanticColors: Story = {
    render: () => (
        <div style={grid}>
            {Object.entries(colors).map(([name, value]) => (
                <Swatch key={name} name={name} value={value} cssVar={`--color-${name}`} />
            ))}
        </div>
    ),
};

export const Palette: Story = {
    render: () => (
        <div style={grid}>
            {Object.entries(palette).map(([name, value]) => (
                <Swatch key={name} name={name} value={value} />
            ))}
        </div>
    ),
};

export const TypeScale: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(text).map(([name, rem]) => (
                <div key={name} style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline' }}>
                    <code style={{ width: 160, flexShrink: 0, fontSize: 'var(--text-xxs)', opacity: 0.7 }}>
                        --text-{name} · {rem}rem
                    </code>
                    <span style={{ fontSize: `var(--text-${name})` }}>The quick llama jumps</span>
                </div>
            ))}
        </div>
    ),
};

export const Radii: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {Object.entries(radius).map(([name, value]) => (
                <div key={name} style={{ display: 'grid', gap: '0.5rem', justifyItems: 'center' }}>
                    <div
                        style={{
                            width: 120,
                            height: 64,
                            borderRadius: value,
                            border: '2px solid var(--color-primary)',
                        }}
                    />
                    <code style={{ fontSize: 'var(--text-xxs)' }}>
                        {name} · {value}
                    </code>
                </div>
            ))}
        </div>
    ),
};
