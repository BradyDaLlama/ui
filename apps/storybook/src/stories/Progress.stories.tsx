import type { Meta, StoryObj } from '@storybook/react-vite';
import { colors } from '@bradydallama/tokens';
import { Card, ProgressBar, ProgressRing } from '@bradydallama/ui';

const colorNames = Object.keys(colors);

const meta = {
    title: 'Components/Progress',
    component: ProgressRing,
    args: { value: 0.65, label: 'Goal progress' },
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
        color: { control: 'select', options: [undefined, ...colorNames] },
    },
} satisfies Meta<typeof ProgressRing>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ring: Story = {};
export const RingWithContent: Story = { args: { size: 128, children: <strong>65%</strong> } };
export const RingSteps: Story = {
    render: (args) => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                <ProgressRing key={v} {...args} value={v} label={`${v * 100}%`}>
                    {v * 100}%
                </ProgressRing>
            ))}
        </div>
    ),
};

export const Bar: Story = {
    render: (args) => (
        <div style={{ maxWidth: 360 }}>
            <ProgressBar value={args.value} color={args.color} label="Upload" />
        </div>
    ),
};

/** Fills default to secondary, and switch to primary on light cards. */
export const OnCards: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {(['light', 'dark'] as const).map((tone) => (
                <Card
                    key={tone}
                    tone={tone}
                    style={{ width: 240, display: 'grid', gap: '1rem', justifyItems: 'center' }}
                >
                    <ProgressRing value={0.7} label={`${tone} ring`}>
                        70%
                    </ProgressRing>
                    <div style={{ width: '100%' }}>
                        <ProgressBar value={0.7} label={`${tone} bar`} />
                    </div>
                </Card>
            ))}
        </div>
    ),
};
