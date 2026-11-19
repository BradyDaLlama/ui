import type { Meta, StoryObj } from '@storybook/react-vite';
import { colors } from '@bradydallama/tokens';
import { Bubble, type BubbleTail } from '@bradydallama/ui';

const colorNames = Object.keys(colors);
const tails: BubbleTail[] = [
    'top-left',
    'top-center',
    'top-right',
    'right-top',
    'right-center',
    'right-bottom',
    'bottom-left',
    'bottom-center',
    'bottom-right',
    'left-top',
    'left-center',
    'left-bottom',
];

const meta = {
    title: 'Components/Bubble',
    component: Bubble,
    args: { children: "Hi! I'm a speech bubble." },
    argTypes: {
        tail: { control: 'select', options: [...tails, 'none'] },
        textColor: { control: 'select', options: colorNames },
        bgColor: { control: 'select', options: colorNames },
        outline1: { control: 'select', options: colorNames },
        outline2: { control: 'select', options: colorNames },
    },
} satisfies Meta<typeof Bubble>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoTail: Story = { args: { tail: 'none' } };
export const OneLine: Story = { args: { oneLine: true, children: 'This one stays on a single line no matter what' } };
export const Recolored: Story = { args: { bgColor: 'secondary', outline2: 'primary-100' } };

/** All twelve tail positions. */
export const Tails: Story = {
    render: (args) => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '3rem 2rem',
                padding: '1.5rem',
            }}
        >
            {tails.map((tail) => (
                <Bubble key={tail} {...args} tail={tail}>
                    {tail}
                </Bubble>
            ))}
        </div>
    ),
};
