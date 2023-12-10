// Sample code
const code = 'for i from 1 to 10 by 2 < display( i ) ; >';

// Keywords defined in environment.js
const keywords = ['for', 'from', 'to', 'by', 'display'];

// Tokenize function
function tokenize(code) {
  const tokens = [];
  let current = 0;

  while (current < code.length) {
    let char = code[current];

    // Skip whitespaces
    if (/\s/.test(char)) {
      current++;
      continue;
    }

    // Check for numeric literals
    if (/[0-9]/.test(char)) {
      let value = '';
      while (/[0-9]/.test(char)) {
        value += char;
        char = code[++current];
      }
      tokens.push({ type: 'NUMBER', value:parseInt(value) });
      continue;
    }

    // Check for identifiers and keywords
    if (/[a-zA-Z]/.test(char)) {
      let value = '';
      while (/[a-zA-Z]/.test(char) || /\d/.test(char)) {
        value += char;
        char = code[++current];
      }
      if(value.length == 3 && value[0]=='f' )

      if (keywords.includes(value)) {
        tokens.push({ type: 'KEYWORD', value });
       
      } else {
        tokens.push({ type: 'IDENTIFIER', value });
      }

      continue;
    }

    // Check for symbols
    if (/[\;<\>\(\)]/.test(char)) {
        if(char=='<' || char=='>'){
            tokens.push({type:'DELIMITER' , value:char});
            current++;
            continue;
        }
        else if (char == '('){
            tokens.push({type:'OPENPAREN' , value:char});
            current++;
            continue;

        }
        else if (char == ')'){
            tokens.push({type:'CLOSEPAREN' , value:char});
            current++;
            continue;

        }
        else if (char == ';'){
          tokens.push({type:'SEMICOLN' , value:char});
          current++;
          continue;

      }

      tokens.push({ type: char, value: char });
      current++;
      continue;
    }

    // Error if an unexpected character is encountered
    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
}

function startsWithKeyword(str, index, keyword, caseSensitive = false) {
    const substring = str.slice(index, index + keyword.length);
    return caseSensitive ? substring === keyword : substring.toLowerCase() === keyword.toLowerCase();
}

// Test the lexer
try {
  const tokens = tokenize(code);
  console.log(tokens);
} catch (error) {
  console.error(error.message);
}
