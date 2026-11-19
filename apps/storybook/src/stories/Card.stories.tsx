import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, ProgressBar } from '@bradydallama/ui';

const meta = {
    title: 'Components/Card',
    component: Card,
    args: {
        style: { maxWidth: 320 },
        children: (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
                <strong>Daily water</strong>
                <span>6 of 8 glasses</span>
                <ProgressBar value={0.75} label="Water progress" />
            </div>
        ),
    },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};
export const Dark: Story = { args: { tone: 'dark' } };
export const Ring: Story = { args: { ring: true } };
export const Interactive: Story = { args: { interactive: true, ring: true } };

export const SideBySide: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {(['light', 'dark'] as const).map((tone) => (
                <Card key={tone} tone={tone} ring style={{ width: 260, display: 'grid', gap: '0.75rem' }}>
                    <strong>{tone} card</strong>
                    <ProgressBar value={0.4} label={`${tone} progress`} />
                    <Button size="sm">Action</Button>
                </Card>
            ))}
        </div>
    ),
};
