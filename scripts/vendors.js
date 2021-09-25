var fs = require('fs');
var path = require('path');

const esbuild = require('esbuild');
const NodeModulesPolyfills = require('@esbuild-plugins/node-modules-polyfill').default;
const GlobalsPolyfills = require('@esbuild-plugins/node-globals-polyfill').default;
const Bundler = require('parcel-bundler');

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

function deleteContent(file, content) {
  var data = fs.readFileSync(file, 'utf-8');
  var newValue = data.replace(content, '');
  fs.writeFileSync(file, newValue, 'utf-8');
}

var node_modules = path.resolve(__dirname + '/../node_modules');
var vendor_modules = path.resolve(__dirname + '/../vendor_modules/src');
var targetDir = path.resolve(__dirname + '/../dist');

/** @type {Partial<esbuild.BuildOptions>} */
const baseOptions = {
  bundle: true,
  minify: true,
  format: 'iife',
  define: { global: 'window', 'process.env.NODE_ENV': '"production"' },
};

// Monaco editor
esbuild.buildSync({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/monaco-editor.ts'],
  outfile: 'dist/monaco-editor/monaco-editor.js',
  loader: { '.ttf': 'file' },
  format: 'esm',
});

// Monaco editor workers
const entryFiles = [
  'node_modules/monaco-editor/esm/vs/language/json/json.worker.js',
  'node_modules/monaco-editor/esm/vs/language/css/css.worker.js',
  'node_modules/monaco-editor/esm/vs/language/html/html.worker.js',
  'node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js',
  'node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
];

/** @type {Bundler.ParcelOptions} */
const options = {
  outDir: './dist/monaco-editor',
  minify: true,
  target: 'browser',
  sourceMaps: false,
  watch: false,
};

entryFiles.forEach(async (file) => {
  const parcelBundler = new Bundler([file], options);
  await parcelBundler.bundle();
});

// Patch and build Typescript
var tsOutDir = path.resolve(__dirname + '/../vendor_modules/src/typescript');
if (!fs.existsSync(tsOutDir)) {
  fs.mkdirSync(tsOutDir);
}
fs.copyFileSync(
  path.resolve(
    __dirname +
      '/../node_modules/monaco-editor/esm/vs/language/typescript/lib/typescriptServices.js',
  ),
  path.resolve(tsOutDir + '/typescriptServices.js'),
);
fs.appendFileSync(
  path.resolve(tsOutDir + '/typescriptServices.js'),
  'export var transpile = ts.transpile;\n',
);
esbuild.buildSync({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/typescript.js'],
  outfile: 'dist/typescript/typescript.min.js',
  globalName: 'typescript',
});

// Marked
mkdirp(targetDir + '/marked');
fs.copyFileSync(
  path.resolve(node_modules + '/marked/marked.min.js'),
  path.resolve(targetDir + '/marked/marked.min.js'),
);

// Sass
mkdirp(targetDir + '/sass.js');
fs.copyFileSync(
  path.resolve(node_modules + '/sass.js/dist/sass.sync.js'),
  path.resolve(targetDir + '/sass.js/sass.sync.js'),
);

// Less
esbuild.buildSync({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/less.js'],
  outfile: 'dist/less/less.js',
  globalName: 'less',
});

// github-markdown-css
mkdirp(targetDir + '/github-markdown-css');
fs.copyFileSync(
  path.resolve(node_modules + '/github-markdown-css/github-markdown.css'),
  path.resolve(targetDir + '/github-markdown-css/github-markdown.css'),
);

// asciidoctor.css
mkdirp(targetDir + '/asciidoctor.css');
fs.copyFileSync(
  path.resolve(vendor_modules + '/asciidoctor.css/asciidoctor.css'),
  path.resolve(targetDir + '/asciidoctor.css/asciidoctor.css'),
);

// normalize.css
mkdirp(targetDir + '/normalize.css');
fs.copyFileSync(
  path.resolve(node_modules + '/normalize.css/normalize.css'),
  path.resolve(targetDir + '/normalize.css/normalize.css'),
);

// reset-css
mkdirp(targetDir + '/reset-css');
fs.copyFileSync(
  path.resolve(node_modules + '/reset-css/reset.css'),
  path.resolve(targetDir + '/reset-css/reset.css'),
);

// stylus
mkdirp(targetDir + '/stylus');
fs.copyFileSync(
  path.resolve(vendor_modules + '/stylus/stylus.min.js'),
  path.resolve(targetDir + '/stylus/stylus.min.js'),
);

// pug
mkdirp(targetDir + '/pug');
fs.copyFileSync(
  path.resolve(vendor_modules + '/pug/pug.min.js'),
  path.resolve(targetDir + '/pug/pug.min.js'),
);

// asciidoctor
mkdirp(targetDir + '/asciidoctor');
fs.copyFileSync(
  path.resolve(node_modules + '/@asciidoctor/core/dist/browser/asciidoctor.min.js'),
  path.resolve(targetDir + '/asciidoctor/asciidoctor.min.js'),
);

// coffeescript
mkdirp(targetDir + '/coffeescript');
fs.copyFileSync(
  path.resolve(vendor_modules + '/coffeescript/coffeescript.js'),
  path.resolve(targetDir + '/coffeescript/coffeescript.js'),
);

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
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/postcss-preset-env.ts'],
  outfile: 'dist/postcss-preset-env/postcss-preset-env.js',
  globalName: 'postcssPresetEnv',
  plugins: nodePolyfills,
});

// tailwindcss
mkdirp(targetDir + '/tailwindcss');
fs.copyFileSync(
  path.resolve(node_modules + '/tailwindcss-browser-plugin/dist/tailwindcss.umd.min.js'),
  path.resolve(targetDir + '/tailwindcss/tailwindcss.js'),
);

// prettier
mkdirp(targetDir + '/prettier');
fs.copyFileSync(
  path.resolve(node_modules + '/prettier/standalone.js'),
  path.resolve(targetDir + '/prettier/standalone.js'),
);
esbuild.buildSync({
  ...baseOptions,
  entryPoints: ['node_modules/@prettier/plugin-pug/dist/index.js'],
  outfile: 'dist/prettier/parser-pug.js',
  globalName: 'pluginPug',
});

// babel
mkdirp(targetDir + '/babel');
fs.copyFileSync(
  path.resolve(node_modules + '/@babel/standalone/babel.min.js'),
  path.resolve(targetDir + '/babel/babel.min.js'),
);

// solid
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/babel-preset-solid.js'],
  outfile: 'dist/babel-preset-solid/babel-preset-solid.js',
  globalName: 'babelPresetSolid',
  plugins: nodePolyfills,
});

// svelte
esbuild.buildSync({
  ...baseOptions,
  entryPoints: ['vendor_modules/src/svelte/compiler.js'],
  outfile: 'dist/svelte/svelte-compiler.3.42.4.min.js',
  globalName: 'svelte',
});

// clientside-haml-js
mkdirp(targetDir + '/clientside-haml-js');
fs.copyFileSync(
  path.resolve(vendor_modules + '/clientside-haml-js/haml.js'),
  path.resolve(targetDir + '/clientside-haml-js/haml.js'),
);

// MDX
esbuild.build({
  ...baseOptions,
  entryPoints: ['vendor_modules/imports/mdx.ts'],
  outfile: 'dist/mdx/mdx.js',
  globalName: 'MDX',
  plugins: nodePolyfills,
});

// livescript
mkdirp(targetDir + '/livescript');
fs.copyFileSync(
  path.resolve(vendor_modules + '/livescript/livescript-min.js'),
  path.resolve(targetDir + '/livescript/livescript-min.js'),
);
// prelude.ls (livescript base library)
fs.copyFileSync(
  path.resolve(vendor_modules + '/livescript/prelude-browser-min.js'),
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

// es-module-shims
mkdirp(targetDir + '/es-module-shims');
fs.copyFileSync(
  path.resolve(node_modules + '/es-module-shims/dist/es-module-shims.min.js'),
  path.resolve(targetDir + '/es-module-shims/es-module-shims.min.js'),
);
fs.copyFileSync(
  path.resolve(node_modules + '/es-module-shims/dist/es-module-shims.min.js.map'),
  path.resolve(targetDir + '/es-module-shims/es-module-shims.min.js.map'),
);

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
