// based on https://github.com/MikeRalphson/turbopascal/blob/master/tpc.js
const turbopascal = {
  compiler: new Promise((resolve) => {
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
      'PascalError',
      'Compiler',
      'Machine',
      'SymbolTable',
    ], function (
      Stream,
      Lexer,
      CommentStripper,
      Parser,
      PascalError,
      Compiler,
      Machine,
      SymbolTable,
    ) {
      function compile(source, run, DEBUG_TRACE) {
        let self = this;

        if (!source) {
          return;
        }

        let stream = new Stream(source);
        let lexer = new CommentStripper(new Lexer(stream));
        let parser = new Parser(lexer);

        let result = { parsed: false, compiled: false };

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
              console.log(line);
            });
            machine.setOutChCallback(function (line) {
              console.log(line);
            });
            machine.setInputCallback(function (callback) {
              self.screen.addCursor();
              self._setInputMode(INPUT_STRING, function (line) {
                self._setInputMode(INPUT_RUNNING);
                callback(line);
              });
            });
            machine.run();
          }
        } catch (e) {
          console.warn(e.message);
          // Print parsing errors.
          if (e instanceof PascalError) {
            console.warn(e.getMessage());
          }
          console.warn(e.stack);
        }
        return result;
      }
      resolve(compile);
    });
  }),
};
