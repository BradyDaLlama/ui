import { create } from 'storybook/theming';
import { colors, palette } from '@bradydallama/tokens';

// The Storybook UI itself, dressed in the design system's colors.
export const theme = create({
    base: 'dark',
    brandTitle: 'bradydallama/ui',
    brandUrl: 'https://github.com/BradyDaLlama/ui',
    brandTarget: '_blank',
    fontBase: "'Zen Maru Gothic', ui-rounded, system-ui, sans-serif",
    colorPrimary: colors.secondary,
    colorSecondary: palette.rose,
    appBg: palette.navy900,
    appContentBg: palette.navy900,
    appPreviewBg: palette.navy900,
    appBorderColor: palette.navy700,
    appBorderRadius: 12,
    barBg: palette.navy800,
    barTextColor: palette.cloud,
    barSelectedColor: colors.secondary,
    textColor: palette.cloud,
    textMutedColor: '#a9b6c0',
    inputBg: palette.navy800,
    inputBorder: palette.navy600,
    inputTextColor: palette.cloud,
    inputBorderRadius: 999,
});
