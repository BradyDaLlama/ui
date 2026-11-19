import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, checkboxShapes, Icon, Switch } from '@bradydallama/ui';

const meta = {
    title: 'Components/Checkbox',
    component: Checkbox,
    args: { label: 'Drink water' },
    argTypes: { shape: { control: 'select', options: [undefined, ...checkboxShapes] } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

const col = { display: 'grid', gap: '0.75rem', justifyItems: 'start' } as const;

export const Unchecked: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Strike: Story = {
    args: { strike: true, defaultChecked: true, label: 'Finished task' },
    parameters: { docs: { description: { story: 'Strikes the label through when checked, for to-do lists.' } } },
};
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };

/** Every built-in shape, plus any SVG element as a custom shape. */
export const Shapes: Story = {
    render: () => (
        <div style={col}>
            {checkboxShapes.map((shape) => (
                <Checkbox key={shape} shape={shape} label={shape} defaultChecked />
            ))}
            <Checkbox shape={<Icon name="star" />} label="custom (Icon)" defaultChecked />
        </div>
    ),
};

export const Switches: Story = {
    render: () => (
        <div style={col}>
            <Switch label="Notifications" />
            <Switch label="Dark mode" defaultChecked />
            <Switch label="Disabled" disabled />
            <Switch label="Disabled on" disabled defaultChecked />
        </div>
    ),
};
