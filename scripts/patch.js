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

module.exports = { patch };
