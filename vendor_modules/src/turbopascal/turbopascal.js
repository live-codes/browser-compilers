// @ts-nocheck
// based on https://github.com/MikeRalphson/turbopascal/blob/master/tpc.js
const turbopascal = {
  createCompiler: (options = {}) =>
    new Promise((resolve) => {
      const inputCallback =
        options.inputCallback ||
        ((callback) => {
          const input = window.prompt('please supply the input');
          callback(input);
        });
      const outputCallback = options.outputCallback || console.log;
      const errorCallback = options.errorCallback || console.warn;

      requirejs.config({
        baseUrl: 'https://cdn.jsdelivr.net/npm/turbopascal@1.0.3',
        paths: {
          underscore: 'https://cdn.jsdelivr.net/npm/underscore@1.13.2/underscore-umd.min',
        },
      });

      require([
        'Stream',
        'Lexer',
        'CommentStripper',
        'Parser',
        'Compiler',
        'Machine',
        'SymbolTable',
      ], function (Stream, Lexer, CommentStripper, Parser, Compiler, Machine, SymbolTable) {
        function compile(source, run, DEBUG_TRACE) {
          let result = { parsed: false, compiled: false };
          if (!source) return result;

          let stream = new Stream(source);
          let lexer = new CommentStripper(new Lexer(stream));
          let parser = new Parser(lexer);

          try {
            // Create the symbol table of built-in constants, functions, and procedures.
            let builtinSymbolTable = SymbolTable.makeBuiltinSymbolTable();

            // Parse the program into a parse tree. Create the symbol table as we go.
            let root = parser.parse(builtinSymbolTable);
            result.tree = root.print('');
            result.parsed = true;

            // Compile to bytecode.
            let compiler = new Compiler();
            let bytecode = compiler.compile(root);
            result.compiled = true;
            result.bytecode = bytecode;
            result.pSrc = bytecode.print();

            if (run) {
              // Execute the bytecode.
              let machine = new Machine(bytecode, this.keyboard);
              if (DEBUG_TRACE) {
                machine.setDebugCallback(function (state) {
                  $state.append(state + '\\n');
                });
              }
              machine.setFinishCallback(function (runningTime) {});
              machine.setOutputCallback(function (line) {
                outputCallback(line);
              });
              machine.setOutChCallback(function (line) {
                outputCallback(line);
              });
              machine.setInputCallback(function (callback) {
                inputCallback(callback);
              });
              machine.run();
            }
          } catch (e) {
            // Print errors.
            const msg = e.getMessage() || e.message || e;
            errorCallback(msg);
          }
          return result;
        }
        resolve(compile);
      });
    }),
};
