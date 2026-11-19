import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '@bradydallama/tokens/tokens.css';
import '@bradydallama/ui/styles.css';
import { theme } from './theme';

// Toolbar toggle for the library's optional lowercase display mode (<html data-case="lower">).
const withCase: Decorator = (Story, { globals }) => {
    useEffect(() => {
        const root = document.documentElement;
        if (globals.case === 'lower') root.dataset.case = 'lower';
        else delete root.dataset.case;
    }, [globals.case]);
    return <Story />;
};

// The preview's own <body> gets bd-body, exactly like a consumer app, so the dotted
// surface fills the whole canvas. Each story just gets some breathing room.
const withSurface: Decorator = (Story) => {
    useEffect(() => {
        document.body.classList.add('bd-body');
    }, []);
    return (
        <div style={{ padding: '2rem' }}>
            <Story />
        </div>
    );
};

const preview: Preview = {
    decorators: [withSurface, withCase],
    globalTypes: {
        case: {
            description: 'Display text case',
            toolbar: {
                title: 'Case',
                icon: 'paragraph',
                items: [
                    { value: 'normal', title: 'Normal case' },
                    { value: 'lower', title: 'Lowercase (data-case="lower")' },
                ],
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: { case: 'normal' },
    parameters: {
        layout: 'fullscreen',
        backgrounds: { disable: true },
        controls: { expanded: true, sort: 'requiredFirst' },
        docs: { theme },
        a11y: { test: 'todo' },
        options: {
            storySort: { order: ['Introduction', 'Foundations', 'Components', 'Motion'] },
        },
    },
    tags: ['autodocs'],
};

export default preview;
