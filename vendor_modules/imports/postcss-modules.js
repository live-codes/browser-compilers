import postcssModules from 'postcss-modules';
import posthtml from 'posthtml';
import posthtmlCSSModules from 'posthtml-css-modules';

// based on https://github.com/posthtml/posthtml-class-to-css-module
const cloneClasses = (options = {}) => (tree) =>
  tree.match({ attrs: { class: /.+/ } }, (node) => {
    const className =
      typeof options.cssModules === 'object'
        ? node.attrs.class
            .split(' ')
            .filter(
              (name) =>
                Object.keys(options.cssModules).includes(name) && options.cssModules[name] !== name,
            )
            .join(' ')
        : node.attrs.class;

    if (className.trim()) {
      node.attrs = Object.assign(node.attrs, { 'css-module': className });
    }

    if (options.removeOriginalClasses) {
      delete node.attrs.class;
    }

    return node;
  });

/**
 *
 * @param {string} html
 * @param {Record<String, any>} cssModules
 * @param {boolean} removeOriginalClasses
 * @returns {string}
 */
const addClassesToHtml = (html, cssModules, removeOriginalClasses = false) =>
  posthtml()
    // @ts-ignore
    .use(cloneClasses({ cssModules, removeOriginalClasses }), posthtmlCSSModules(cssModules))
    // @ts-ignore
    .process(html, { sync: true }).html;

export { postcssModules, addClassesToHtml };
