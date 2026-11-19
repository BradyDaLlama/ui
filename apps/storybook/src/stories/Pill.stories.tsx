import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, Pill, RingLabel } from '@bradydallama/ui';

const meta = {
    title: 'Components/Pill',
    component: Pill,
    args: { children: 'design' },
} satisfies Meta<typeof Pill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Bubble: Story = {};
export const Primary: Story = { args: { tone: 'primary' } };
export const Secondary: Story = { args: { tone: 'secondary' } };
export const Outline: Story = { args: { tone: 'outline' } };
export const WithIcon: Story = { args: { icon: 'star', children: '12' } };

export const AllTones: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {(['bubble', 'primary', 'secondary', 'outline'] as const).map((tone) => (
                <Pill key={tone} tone={tone}>
                    {tone}
                </Pill>
            ))}
            <Pill tone="primary" icon="star">
                starred
            </Pill>
            <Pill tone="outline">
                trailing <Icon name="star" size="xs" />
            </Pill>
        </div>
    ),
};

export const RingLabels: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <RingLabel label="streak" value="12 days" />
            <RingLabel label="level" value="4" tone="bubble" />
        </div>
    ),
};
