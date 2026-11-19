import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, Pill } from '@bradydallama/ui';
import { AnimatedElement, AnimatedText } from '@bradydallama/ui/motion';

const meta = {
    title: 'Motion/AnimatedText',
    component: AnimatedText,
    args: { children: 'hello from bradydallama' },
    parameters: { docs: { description: { component: 'Needs the optional `gsap` peer dependency.' } } },
} satisfies Meta<typeof AnimatedText>;
export default meta;
type Story = StoryObj<typeof meta>;

const heading = { fontSize: 'var(--text-2xl)', margin: 0 } as const;

/** Change the text in Controls to replay the animation. */
export const Default: Story = {
    render: (args) => (
        <h1 style={heading}>
            <AnimatedText {...args} />
        </h1>
    ),
};

export const Replay: Story = {
    render: function Render() {
        const phrases = ['hello there', 'pill shaped', 'double rings', 'bouncy text'];
        const [i, setI] = useState(0);
        return (
            <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'start' }}>
                <h1 style={heading}>
                    <AnimatedText>{phrases[i]!}</AnimatedText>
                </h1>
                <Button variant="secondary" onClick={() => setI((n) => (n + 1) % phrases.length)}>
                    Next phrase
                </Button>
            </div>
        );
    },
};

export const StaggeredElements: Story = {
    render: function Render() {
        const [key, setKey] = useState(0);
        return (
            <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'start' }}>
                <AnimatedElement animateKey={key} to={{ stagger: 0.08 }}>
                    {['react', 'tokens', 'tailwind', 'gsap'].map((t) => (
                        <Pill key={t} tone="primary" style={{ marginRight: 8 }}>
                            {t}
                        </Pill>
                    ))}
                </AnimatedElement>
                <Button variant="ghost" icon="star" onClick={() => setKey((k) => k + 1)}>
                    Replay
                </Button>
            </div>
        );
    },
};
