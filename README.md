# bradydallama/ui

The bradydallama design system: outlined, pill-shaped React components with double-ring accents.

| Package                                   | What                                                            |
| ----------------------------------------- | --------------------------------------------------------------- |
| [`@bradydallama/tokens`](packages/tokens) | Colors, type, radii, motion → CSS vars, Tailwind v4 theme, JSON |
| [`@bradydallama/ui`](packages/ui)         | React components, icons, and styles                             |

Published to GitHub Packages (private for now). See [`packages/ui/README.md`](packages/ui/README.md) for usage.

## Develop

```bash
npm install
npm run build
npm run typecheck
```

## Release

```bash
npx changeset          # describe the change and bump type
npx changeset version  # apply version bumps + changelogs
npm run release        # build and publish changed packages
```

Publishing needs `NPM_TOKEN` set to a GitHub token with `write:packages`.
