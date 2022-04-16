var dts = require('dts-bundle');

dts.bundle({
  name: '@testing-library/dom',
  main: './node_modules/@testing-library/dom/types/index.d.ts',
  out: '../../../../vendor_modules/types/testing-library-dom.d.ts',
});
