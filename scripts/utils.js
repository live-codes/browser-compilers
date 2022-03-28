var fs = require('fs');
var path = require('path');

const patch = (
  /** @type {string} */ filePath,
  /** @type {Record<string, string>} */ replacements = {},
) =>
  new Promise((resolve, reject) => {
    fs.readFile(path.resolve(filePath), 'utf8', function (err, data) {
      if (err) return reject(err);

      var result = data;
      for (const key of Object.keys(replacements)) {
        result = result.split(key).join(replacements[key]);
      }

      fs.writeFile(path.resolve(filePath), result, 'utf8', function (err) {
        if (err) return reject(err);

        resolve();
      });
    });
  });

// https://github.com/evanw/esbuild/issues/566#issuecomment-735551834
const externalCjsToEsmPlugin = (external) => ({
  name: 'external',
  setup(build) {
    let escape = (text) => `^${text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`;
    let filter = new RegExp(external.map(escape).join('|'));
    build.onResolve({ filter: /.*/, namespace: 'external' }, (args) => ({
      path: args.path,
      external: true,
    }));
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      namespace: 'external',
    }));
    build.onLoad({ filter: /.*/, namespace: 'external' }, (args) => ({
      contents: `export * from ${JSON.stringify(args.path)}`,
    }));
  },
});

module.exports = { patch, externalCjsToEsmPlugin };
