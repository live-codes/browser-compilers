const PLUGIN_NAME = 'minizinc';

// Parser
const parser = {
  parse(text, parsers, options) {
    return {
      type: 'minizinc-root',
      body: text,
      loc: {
        start: { line: 1, column: 0 },
        end: { line: text.split('\n').length, column: 0 },
      },
    };
  },
  astFormat: PLUGIN_NAME,
  locStart: (node) => node.loc?.start ?? { line: 1, column: 0 },
  locEnd: (node) => node.loc?.end ?? { line: 1, column: 0 },
};

// Printer
const printer = {
  print(path, options, print) {
    const node = path.getValue();

    if (node.type === 'minizinc-root') {
      return formatMiniZinc(node.body, options);
    }

    return node.body;
  },
};

function formatMiniZinc(text, options) {
  const printWidth = options.printWidth || 80;
  const tabSize = options.tabWidth || 2;

  // First, split multiple statements on same line
  const normalizedText = splitMultipleStatements(text);

  // Then, join continuation lines into complete statements
  const statements = joinContinuationLines(normalizedText);

  const formatted = [];

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip empty lines but preserve single line breaks
    if (statement.trim() === '') {
      formatted.push('');
      continue;
    }

    // Format the statement
    const formattedStatement = formatStatement(statement, printWidth, tabSize);
    formatted.push(formattedStatement);
  }

  return formatted.join('\n');
}

function normalizeComment(comment) {
  // Ensure there's a space after %
  if (comment.startsWith('%') && comment.length > 1 && comment[1] !== ' ') {
    return '% ' + comment.slice(1);
  }
  return comment;
}

function splitMultipleStatements(text) {
  const lines = text.split('\n');
  const result = [];

  for (const line of lines) {
    const splitLines = splitLineByStatements(line);
    result.push(...splitLines);
  }

  return result.join('\n');
}

function splitLineByStatements(line) {
  // Check if line starts with a comment
  const trimmed = line.trim();
  if (trimmed.startsWith('%')) {
    return [normalizeComment(trimmed)];
  }

  // Find where comment starts (if any)
  const commentIndex = findCommentStart(line);

  if (commentIndex !== -1) {
    const codePart = line.slice(0, commentIndex);
    const commentPart = line.slice(commentIndex).trim();

    if (!codePart.trim()) {
      return [normalizeComment(commentPart)];
    }

    // Split the code part by statements
    const codeStatements = splitCodeByStatements(codePart);

    if (codeStatements.length === 0) {
      return [line];
    }

    // Attach comment to the last statement
    const lastIndex = codeStatements.length - 1;
    codeStatements[lastIndex] = codeStatements[lastIndex] + '  ' + normalizeComment(commentPart);

    return codeStatements;
  }

  return splitCodeByStatements(line);
}

function findCommentStart(line) {
  let inString = false;
  let stringChar = null;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i + 1 < line.length ? line[i + 1] : null;

    // Handle escape sequences
    if (char === '\\') {
      if (nextChar !== null) {
        i++; // Skip next character
      }
      continue;
    }

    // Track string boundaries
    if (char === '"' || char === "'") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
      continue;
    }

    // Check for comment start (not in string)
    if (!inString && char === '%') {
      return i;
    }
  }

  return -1;
}

function splitCodeByStatements(code) {
  const statements = [];
  let current = '';
  let inString = false;
  let stringChar = null;
  let depth = 0;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const nextChar = i + 1 < code.length ? code[i + 1] : null;

    // Handle escape sequences
    if (char === '\\') {
      current += char;
      if (nextChar !== null) {
        i++;
        current += code[i];
      }
      continue;
    }

    // Track string boundaries
    if (char === '"' || char === "'") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
      current += char;
      continue;
    }

    // Track nested brackets/parens/braces
    if (!inString) {
      if (char === '[' || char === '(' || char === '{') depth++;
      if (char === ']' || char === ')' || char === '}') depth--;
    }

    current += char;

    // Check if this is the end of a statement (semicolon at depth 0, not in string)
    if (char === ';' && !inString && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) {
        statements.push(trimmed);
      }
      current = '';
    }
  }

  // Add any remaining content
  const trimmed = current.trim();
  if (trimmed) {
    statements.push(trimmed);
  }

  // If no statements were found, return the original code
  return statements.length > 0 ? statements : [code];
}

function endsWithStatement(line) {
  // Remove trailing comment if present
  const commentIndex = findCommentStart(line);
  const codeOnly = commentIndex !== -1 ? line.slice(0, commentIndex) : line;
  const trimmed = codeOnly.trim();

  return (
    trimmed.endsWith(';') ||
    trimmed.endsWith(']') ||
    (trimmed.endsWith(')') && !line.includes('++'))
  );
}

function joinContinuationLines(text) {
  const lines = text.split('\n');
  const statements = [];
  let currentStatement = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      if (currentStatement) {
        statements.push(currentStatement);
        currentStatement = '';
      }
      statements.push('');
      continue;
    }

    // Don't join comment lines
    if (trimmed.startsWith('%')) {
      if (currentStatement) {
        statements.push(currentStatement);
        currentStatement = '';
      }
      statements.push(trimmed);
      continue;
    }

    // Check if this line is a continuation (doesn't end with semicolon or closing bracket)
    const endsStatement = endsWithStatement(trimmed);

    if (currentStatement) {
      currentStatement += ' ' + trimmed;
    } else {
      currentStatement = trimmed;
    }

    if (endsStatement) {
      statements.push(currentStatement);
      currentStatement = '';
    }
  }

  if (currentStatement) {
    statements.push(currentStatement);
  }

  return statements;
}

function formatStatement(statement, printWidth, tabSize) {
  const trimmed = statement.trim();

  // Don't format comment lines (they're already normalized)
  if (trimmed.startsWith('%')) {
    return trimmed;
  }

  // If statement is short enough, return as-is
  if (trimmed.length <= printWidth) {
    return trimmed;
  }

  // Check if statement contains brackets that need formatting
  const bracketMatch = trimmed.match(/^(\w+)\s*\[(.+)\];?\s*$/);
  if (bracketMatch) {
    return formatBracketExpression(trimmed, printWidth, tabSize);
  }

  // Check if statement contains parentheses (function calls)
  const parenMatch = trimmed.match(/^(.+?)\((.+)\);?\s*$/);
  if (parenMatch) {
    return formatParenExpression(trimmed, printWidth, tabSize);
  }

  return trimmed;
}

function formatBracketExpression(line, printWidth, tabSize) {
  // Match the pattern: keyword [content]
  const match = line.match(/^(\w+)\s*\[(.+)\];?\s*$/);

  if (!match) {
    return line;
  }

  const keyword = match[1];
  const content = match[2];
  const hasSemicolon = line.trimEnd().endsWith(';');

  // Split content by commas
  const elements = splitByComma(content);

  // Calculate the length if we keep it on one line
  const oneLine = `${keyword} [${content}]${hasSemicolon ? ';' : ''}`;

  if (oneLine.length <= printWidth) {
    return oneLine;
  }

  // Need to wrap - format with indentation
  const indent = ' '.repeat(keyword.length + 2); // +2 for space and opening bracket
  const formattedElements = [];

  for (let i = 0; i < elements.length; i++) {
    if (i === 0) {
      formattedElements.push(elements[i]);
    } else {
      formattedElements.push(indent + elements[i]);
    }
  }

  return `${keyword} [${formattedElements.join(',\n')}]${hasSemicolon ? ';' : ''}`;
}

function formatParenExpression(line, printWidth, tabSize) {
  const hasSemicolon = line.trimEnd().endsWith(';');
  const lineWithoutSemi = hasSemicolon ? line.slice(0, -1).trimEnd() : line;

  // Find the outermost function call
  let parenDepth = 0;
  let firstOpenParen = -1;

  for (let i = 0; i < lineWithoutSemi.length; i++) {
    if (lineWithoutSemi[i] === '(') {
      if (parenDepth === 0) {
        firstOpenParen = i;
      }
      parenDepth++;
    } else if (lineWithoutSemi[i] === ')') {
      parenDepth--;
    }
  }

  if (firstOpenParen === -1) {
    return line;
  }

  const beforeParen = lineWithoutSemi.slice(0, firstOpenParen);
  const afterParen = lineWithoutSemi.slice(firstOpenParen + 1);

  // Remove trailing closing paren
  const content = afterParen.endsWith(')') ? afterParen.slice(0, -1) : afterParen;

  // Split content by commas at the top level
  const elements = splitByComma(content);

  // Calculate the length if we keep it on one line
  const oneLine = `${beforeParen}(${content})${hasSemicolon ? ';' : ''}`;

  if (oneLine.length <= printWidth) {
    return oneLine;
  }

  // Need to wrap - format with indentation using tabSize
  const indent = ' '.repeat(tabSize);
  const formattedElements = [];

  for (let i = 0; i < elements.length; i++) {
    if (i === 0) {
      formattedElements.push(elements[i]);
    } else {
      formattedElements.push(indent + elements[i]);
    }
  }

  return `${beforeParen}(${formattedElements.join(',\n')})${hasSemicolon ? ';' : ''}`;
}

function splitByComma(str) {
  const elements = [];
  let current = '';
  let inString = false;
  let stringChar = null;
  let depth = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = i + 1 < str.length ? str[i + 1] : null;

    // If we're at a backslash, include it and the next character without interpretation
    if (char === '\\') {
      current += char;
      if (nextChar !== null) {
        i++;
        current += str[i];
      }
      continue;
    }

    // Track string boundaries (only if not escaped)
    if (char === '"' || char === "'") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
      current += char;
      continue;
    }

    // Track nested brackets/parens/braces
    if (!inString) {
      if (char === '[' || char === '(' || char === '{') depth++;
      if (char === ']' || char === ')' || char === '}') depth--;
    }

    // Split on comma only if we're not in a string or nested structure
    if (char === ',' && !inString && depth === 0) {
      elements.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last element
  if (current.trim()) {
    elements.push(current.trim());
  }

  return elements;
}

// Language definition
export const languages = [
  {
    name: 'MiniZinc',
    parsers: [PLUGIN_NAME],
    extensions: ['.mzn', '.dzn'],
    vscodeLanguageIds: ['minizinc'],
  },
];

// Export plugin
export const parsers = {
  [PLUGIN_NAME]: parser,
};

export const printers = {
  [PLUGIN_NAME]: printer,
};

(globalThis.prettierPlugins ??= {})[PLUGIN_NAME] = { languages, parsers, printers };
