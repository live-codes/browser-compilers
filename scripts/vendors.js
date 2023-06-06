var fs = require('fs');
var path = require('path');

const esbuild = require('esbuild');
const NodeModulesPolyfills = require('@esbuild-plugins/node-modules-polyfill').default;
const GlobalsPolyfills = require('@esbuild-plugins/node-globals-polyfill').default;

const { patch, externalCjsToEsmPlugin } = require('./utils');

const nodePolyfills = [
  NodeModulesPolyfills(),
  GlobalsPolyfills({
    process: true,
    buffer: true,
    define: { global: 'window', 'process.env.NODE_ENV': '"production"' },
  }),
];

function mkdirp(dir) {
  if (!fs.existsSync(path.resolve(dir))) {
    fs.mkdirSync(path.resolve(dir));
  }
}

var vendor_modules_src = path.resolve(__dirname + '/../vendor_modules/src');
var targetDir = path.resolve(__dirname + '/../dist');

/** @type {Partial<esbuild.BuildOptions>} */
const baseOptions = {
  bundle: true,
  minify: true,
  format: 'iife',
  define: { global: 'window', 'process.env.NODE_ENV': '"production"' },
  logLevel: 'error',
};

// sass
patch('node_modules/sass/sass.dart.js', {
  'var self = Object.create(dartNodePreambleSelf);': 'var self = window;',
}).then(() => {
  esbuild.build({
    ...baseOptions,
    entryPoints: ['vendor_modules/imports/sass.ts'],
    outfile: 'dist/sass/sass.js',
    globalName: 'sass',
    plugins: nodePolyfills,
  });
});

// Eslint
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/eslint.js'],
  outfile: 'dist/eslint/eslint.js',
  globalName: 'eslint',
  plugins: nodePolyfills,
});

// Less
esbuild.buildSync({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/less.js'],
  outfile: 'dist/less/less.js',
  globalName: 'less',
});

// asciidoctor.css
mkdirp(targetDir + '/asciidoctor.css');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/asciidoctor.css/asciidoctor.css'),
  path.resolve(targetDir + '/asciidoctor.css/asciidoctor.css'),
);

// stylus
mkdirp(targetDir + '/stylus');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/stylus/stylus.min.js'),
  path.resolve(targetDir + '/stylus/stylus.min.js'),
);

// pug
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/pug.js'],
  outfile: 'dist/pug/pug.min.js',
  globalName: 'pug',
  plugins: nodePolyfills,
});

// postcss
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/postcss.ts'],
  outfile: 'dist/postcss/postcss.js',
  globalName: 'postcss',
  plugins: nodePolyfills,
});

// autoprefixer
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/autoprefixer.ts'],
  outfile: 'dist/autoprefixer/autoprefixer.js',
  globalName: 'autoprefixer',
  plugins: nodePolyfills,
});

// postcss-preset-env
patch('node_modules/postcss-custom-properties/dist/index.mjs', {
  'import{pathToFileURL as r}from"url";': 'const r = (path) => new URL(path, "file:");',
  'import{promises as s}from"fs";':
    'const s = { writeFile: async () => {}, readFile: async () => "" };',
}).then(() => {
  esbuild.build({
    ...baseOptions,
    entryPoints: ['vendor_modules/imports/postcss-preset-env.ts'],
    outfile: 'dist/postcss-preset-env/postcss-preset-env.js',
    globalName: 'postcssPresetEnv',
    plugins: nodePolyfills,
  });
});

// @prettier/plugin-pug
esbuild.buildSync({
  ...baseOptions,
  entryPoints: ['node_modules/@prettier/plugin-pug/dist/index.js'],
  outfile: 'dist/prettier/parser-pug.js',
  globalName: 'pluginPug',
});

// svelte
esbuild.buildSync({
  ...baseOptions,
  entryPoints: ['node_modules/svelte/compiler.js'],
  outfile: 'dist/svelte/svelte-compiler.min.js',
  globalName: 'svelte',
});

// clientside-haml-js
mkdirp(targetDir + '/clientside-haml-js');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/clientside-haml-js/haml.js'),
  path.resolve(targetDir + '/clientside-haml-js/haml.js'),
);

// MDX
patch('node_modules/@mdx-js/mdx/lib/plugin/recma-document.js', {
  "import {URL} from 'url'": '',
}).then(() => {
  esbuild.build({
    ...baseOptions,
    entryPoints: ['vendor_modules/imports/mdx.ts'],
    outfile: 'dist/mdx/mdx.js',
    format: 'esm',
    define: { window: 'globalThis' },
    plugins: nodePolyfills,
  });
});

// remark-gfm
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/remark-gfm.js'],
  outfile: 'dist/remark-gfm/remark-gfm.js',
  format: 'esm',
});

// livescript
mkdirp(targetDir + '/livescript');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/livescript/livescript-min.js'),
  path.resolve(targetDir + '/livescript/livescript-min.js'),
);
// prelude.ls (livescript base library)
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/livescript/prelude-browser-min.js'),
  path.resolve(targetDir + '/livescript/prelude-browser-min.js'),
);

// perlito
esbuild.buildSync({
  minify: true,
  entryPoints: ['vendor_modules/src/perlito/perlito5.js'],
  outfile: 'dist/perlito/perlito5.min.js',
  format: 'esm',
  logLevel: 'error',
});

// wast-refmt
esbuild.buildSync({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/wast-refmt.ts'],
  outfile: 'dist/wast-refmt/wast-refmt.js',
  globalName: 'wastRefmt',
});

// react-native-web
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/react-native-web.js'],
  outfile: 'dist/react-native-web/react-native-web.js',
  format: 'esm',
});

// Windi CSS
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/windicss.ts'],
  outfile: 'dist/windicss/windicss.js',
  globalName: 'windicss',
});

// JSCPP
mkdirp(targetDir + '/jscpp');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/jscpp/JSCPP.es5.min.js'),
  path.resolve(targetDir + '/jscpp/JSCPP.es5.min.js'),
);

// wacl
mkdirp(targetDir + '/wacl');
mkdirp(targetDir + '/wacl/tcl');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/wacl/tcl/wacl.js'),
  path.resolve(targetDir + '/wacl/tcl/wacl.js'),
);
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/wacl/tcl/wacl.wasm'),
  path.resolve(targetDir + '/wacl/tcl/wacl.wasm'),
);
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/wacl/tcl/wacl-custom.data'),
  path.resolve(targetDir + '/wacl/tcl/wacl-custom.data'),
);
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/wacl/tcl/wacl-library.data'),
  path.resolve(targetDir + '/wacl/tcl/wacl-library.data'),
);

// turbopascal
mkdirp(targetDir + '/turbopascal');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/turbopascal/turbopascal.js'),
  path.resolve(targetDir + '/turbopascal/turbopascal.js'),
);

// gnuplot
mkdirp(targetDir + '/gnuplot');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/gnuplot-JS/www/gnuplot.js'),
  path.resolve(targetDir + '/gnuplot/gnuplot.js'),
);
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/gnuplot-JS/www/gnuplot_api.js'),
  path.resolve(targetDir + '/gnuplot/gnuplot_api.js'),
);

// svgbob-wasm
mkdirp(targetDir + '/svgbob-wasm');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/svgbob-wasm/svgbob-wasm.js'),
  path.resolve(targetDir + '/svgbob-wasm/svgbob-wasm.js'),
);

// @testing-library
['dom.js', 'jest-dom.js', 'react.js'].forEach(
  // entryPoints did not work properly!
  (mod) => {
    esbuild
      .build({
        ...baseOptions,
        entryPoints: ['vendor_modules/imports/@testing-library/' + mod],
        outdir: 'dist/@testing-library/',
        format: 'esm',
        plugins: [externalCjsToEsmPlugin(['react'])],
      })
      .then(() => {
        if (mod !== 'jest-dom.js') return;
        patch('dist/@testing-library/jest-dom.js', {
          'expect.extend': 'window.jestLite?.core.expect.extend',
        });
      });
  },
);

// lua-fmt
mkdirp(targetDir + '/lua-fmt');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/lua-fmt/lua-fmt.js'),
  path.resolve(targetDir + '/lua-fmt/lua-fmt.js'),
);

// elkjs-svg
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/elkjs-svg.js'],
  outfile: 'dist/elkjs-svg/elkjs-svg.js',
  globalName: 'elksvg',
  define: { 'require.main': 'undefined' },
});

// lightningcss
mkdirp(targetDir + '/lightningcss');
fs.copyFileSync(
  path.resolve('node_modules/lightningcss-wasm/lightningcss_node_bg.wasm'),
  path.resolve(targetDir + '/lightningcss/lightningcss_node_bg.wasm'),
);
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/lightningcss.js'],
  outfile: 'dist/lightningcss/lightningcss.js',
  globalName: 'lightningcss',
  define: { 'import.meta.url': 'location' },
});

// unocss
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/unocss.js'],
  outfile: 'dist/unocss/unocss.js',
  globalName: 'unocss',
  plugins: nodePolyfills,
});

// tokencss
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/tokencss.js'],
  outfile: 'dist/tokencss/tokencss.js',
  globalName: 'tokencss',
  plugins: nodePolyfills,
});

// cssnano
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/cssnano.js'],
  outfile: 'dist/cssnano/cssnano.js',
  globalName: 'cssnano',
  plugins: nodePolyfills,
  define: { __dirname: '""' },
});

// purgecss
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/purgecss.js'],
  outfile: 'dist/purgecss/purgecss.js',
  globalName: 'purgecss',
  plugins: nodePolyfills,
});

// postcss-modules
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/postcss-modules.js'],
  outfile: 'dist/postcss-modules/postcss-modules.js',
  globalName: 'postcssModules',
  plugins: nodePolyfills,
});

// Civet
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/civet.js'],
  outfile: 'dist/civet/civet.js',
  globalName: 'civet',
  plugins: nodePolyfills,
});

// fennel
mkdirp(targetDir + '/fennel');
fs.copyFileSync(
  path.resolve(vendor_modules_src + '/fennel/fennel.lua'),
  path.resolve(targetDir + '/fennel/fennel.lua'),
);

// flow-remove-types
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/flow-remove-types.js'],
  outfile: 'dist/flow-remove-types/flow-remove-types.js',
  globalName: 'flowRemoveTypes',
  plugins: nodePolyfills,
});

// sucrase
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/sucrase.js'],
  outfile: 'dist/sucrase/sucrase.js',
  globalName: 'sucrase',
});
