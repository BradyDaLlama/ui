import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, IconButton, iconNames } from '@bradydallama/ui';

const meta = {
    title: 'Components/Button',
    component: Button,
    args: { children: 'Save changes', onClick: fn() },
    argTypes: {
        icon: { control: 'select', options: [undefined, ...iconNames] },
    },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' } as const;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } };
export const Disabled: Story = { args: { disabled: true } };
export const WithIcon: Story = { args: { icon: 'star', children: 'Favorite' } };
export const IconAtEnd: Story = { args: { icon: 'star', iconPosition: 'end', children: 'Next' } };
export const LongPress: Story = {
    args: { children: 'Hold me', onLongPress: fn() },
    parameters: {
        docs: {
            description: { story: 'Hold for about 500 ms, right-click, or press Shift+F10 to fire `onLongPress`.' },
        },
    },
};

/** Every variant at every size, plus disabled. */
export const Matrix: Story = {
    render: (args) => (
        <div style={{ display: 'grid', gap: '1rem' }}>
            {(['primary', 'secondary', 'ghost', 'danger'] as const).map((variant) => (
                <div key={variant} style={row}>
                    {(['sm', 'md', 'lg'] as const).map((size) => (
                        <Button key={size} {...args} variant={variant} size={size}>
                            {variant} {size}
                        </Button>
                    ))}
                    <Button {...args} variant={variant} disabled>
                        disabled
                    </Button>
                </div>
            ))}
        </div>
    ),
};

export const IconButtons: Story = {
    render: () => (
        <div style={row}>
            {(['primary', 'secondary', 'ghost', 'danger'] as const).map((variant) => (
                <IconButton key={variant} icon="star" label={`${variant} star`} variant={variant} />
            ))}
            <IconButton icon="mark-x" label="Small close" size="sm" />
            <IconButton icon="mark-x" label="Large close" size="lg" />
            <IconButton icon="mark-x" label="Disabled close" disabled />
        </div>
    ),
};
