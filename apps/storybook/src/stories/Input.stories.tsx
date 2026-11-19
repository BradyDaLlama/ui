import type { Meta, StoryObj } from '@storybook/react-vite';
import { iconNames, Input } from '@bradydallama/ui';

const meta = {
    title: 'Components/Input',
    component: Input,
    args: { label: 'Display name', placeholder: 'brady' },
    argTypes: { icon: { control: 'select', options: [undefined, ...iconNames] } },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 320 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Shown on your profile.' } };
export const WithIcon: Story = { args: { icon: 'star', label: 'Search', placeholder: 'Search…' } };
export const Filled: Story = { args: { defaultValue: 'BradyDaLlama' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Locked' } };
export const NoLabel: Story = { args: { label: undefined, 'aria-label': 'Message', placeholder: 'Type a message' } };
