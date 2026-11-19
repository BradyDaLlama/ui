import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';
import remarkGfm from 'remark-gfm';
import { mergeConfig } from 'vite';

// Stories import the ui package from source (not dist), so edits hot-reload and
// autodocs can read prop types and JSDoc straight from the components.
const uiSrc = fileURLToPath(new URL('../../../packages/ui/src', import.meta.url));

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
    addons: [
        {
            // remark-gfm adds GitHub-flavored Markdown (tables, strikethrough, task lists) to MDX pages.
            name: '@storybook/addon-docs',
            options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
        },
        '@storybook/addon-a11y',
    ],
    // GitHub Pages serves from /<repo>/; set STORYBOOK_BASE=/ui/ when building for it.
    viteFinal: (config) =>
        mergeConfig(config, {
            base: process.env.STORYBOOK_BASE ?? config.base,
            resolve: {
                alias: [
                    { find: /^@bradydallama\/ui\/motion$/, replacement: `${uiSrc}/motion/index.ts` },
                    { find: /^@bradydallama\/ui\/styles\.css$/, replacement: `${uiSrc}/styles.css` },
                    { find: /^@bradydallama\/ui$/, replacement: `${uiSrc}/index.ts` },
                ],
            },
        }),
};

export default config;
