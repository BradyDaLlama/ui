import { readFile, writeFile } from 'node:fs/promises';
import { defineConfig } from 'tsup';

// Files that must start with 'use client'. Server components can still render their exports,
// while plain helpers in index.js (cx, stagger) stay callable on the server.
const clientFiles = ['dist/client.js', 'dist/motion/index.js'];

export default defineConfig({
    entry: { index: 'src/index.ts', client: 'src/client.ts', 'motion/index': 'src/motion/index.ts' },
    format: ['esm'],
    dts: true,
    clean: true,
    external: ['react', 'react-dom', 'gsap'],
    esbuildPlugins: [
        {
            // Keep index.js importing the client entry instead of inlining it, so the boundary survives bundling.
            name: 'client-boundary',
            setup(build) {
                build.onResolve({ filter: /^\.\/client$/ }, (args) =>
                    args.importer.endsWith('index.ts') && !args.importer.includes('motion')
                        ? { path: './client.js', external: true }
                        : undefined,
                );
            },
        },
    ],
    async onSuccess() {
        for (const file of clientFiles) {
            const code = await readFile(file, 'utf8');
            if (!code.startsWith("'use client'")) await writeFile(file, `'use client';\n${code}`);
        }
    },
});
