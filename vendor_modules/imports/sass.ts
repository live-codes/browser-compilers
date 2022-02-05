import sass from 'sass';

window.process = {
  ...window.process,
  stdout: {
    write: (...data) => console.log(...data),
    isTTY: false,
  },
  stderr: {
    write: (...data) => console.warn(...data),
  },
  env: {},
};

export const compileString = sass.compileString;
export const compileStringAsync = sass.compileStringAsync;
