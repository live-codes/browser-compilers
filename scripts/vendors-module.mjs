import esbuild from 'esbuild';
// import { cache } from 'esbuild-plugin-cache';

/** @type {Partial<esbuild.BuildOptions>} */
const baseOptions = {
  bundle: true,
  minify: true,
  format: 'iife',
  define: { global: 'window', 'process.env.NODE_ENV': '"production"' },
};

// solid
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/babel-preset-solid.js'],
  outfile: 'dist/babel-preset-solid/babel-preset-solid.js',
  globalName: 'babelPresetSolid',
  define: { global: 'window', 'process.env': '{}' },

  // plugins: [cache({})],
});
