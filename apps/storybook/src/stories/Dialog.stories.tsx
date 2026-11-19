import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps } from 'react';
import { Button, Dialog, Input } from '@bradydallama/ui';

type Props = ComponentProps<typeof Dialog>;

// The dialog is controlled, so each story keeps its own open state behind a trigger button.
function Demo(props: Omit<Props, 'open' | 'onClose'>) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Open {props.variant ?? 'center'} dialog</Button>
            <Dialog {...props} open={open} onClose={() => setOpen(false)} />
        </>
    );
}

const meta = {
    title: 'Components/Dialog',
    component: Dialog,
    args: {
        title: 'Rename list',
        open: false,
        onClose: () => {},
        children: (
            <div style={{ display: 'grid', gap: '1rem' }}>
                <Input label="Name" defaultValue="Groceries" />
                <Button>Save</Button>
            </div>
        ),
    },
    argTypes: { open: { control: false }, onClose: { control: false } },
    render: ({ open: _open, onClose: _onClose, ...args }) => <Demo {...args} />,
    parameters: { docs: { story: { inline: false, height: '420px' } } },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Center: Story = {};
export const Sheet: Story = {
    args: { variant: 'sheet' },
    parameters: { docs: { description: { story: 'Docks to the bottom of the screen, which suits phones.' } } },
};
