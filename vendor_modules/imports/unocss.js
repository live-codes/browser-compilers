// from https://cdn.jsdelivr.net/npm/unocss@0.45.21/dist/index.mjs

export * from '@unocss/core';
export { default as presetUno } from '@unocss/preset-uno';
export { default as presetAttributify } from '@unocss/preset-attributify';
export { default as presetTagify } from '@unocss/preset-tagify';
// @ts-ignore
export { default as presetIcons } from '@unocss/preset-icons/browser';
export { default as presetWebFonts } from '@unocss/preset-web-fonts';
export { default as presetTypography } from '@unocss/preset-typography';
export { default as presetMini } from '@unocss/preset-mini';
export { default as presetWind } from '@unocss/preset-wind';
export { default as transformerDirectives } from '@unocss/transformer-directives';
export { default as transformerVariantGroup } from '@unocss/transformer-variant-group';
export { default as transformerCompileClass } from '@unocss/transformer-compile-class';
export { default as transformerAttributifyJsx } from '@unocss/transformer-attributify-jsx';

function defineConfig(config) {
  return config;
}

export { defineConfig };
