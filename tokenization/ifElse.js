function tokenize(code) {
    const tokens = [];
    let index = 0;

    while (index < code.length) {
        let char = code[index];

        // Skip whitespaces
        if (/\s/.test(char)) {
            index++;
            continue;
        }

        // Check for keywords
        if (startsWithKeyword(code, index, 'if')) {
            tokens.push({ type: 'IF', value: 'if' });
            index += 2; // Skip 'if'
        } else if (startsWithKeyword(code, index, 'else')) {
            tokens.push({ type: 'ELSE', value: 'else' });
            index += 4; // Skip 'else'
        } else if (startsWithKeyword(code, index, 'print')) {
            tokens.push({ type: 'PRINT', value: 'print' });
            index += 5; // Skip 'print'
        }

        // Check for other symbols
        else if (char === '(') {
            tokens.push({ type: 'OPEN_PAREN', value: char });
            index++;
        } else if (char === ')') {
            tokens.push({ type: 'CLOSE_PAREN', value: char });
            index++;
        } else if (startsWithKeyword(code, index, '===', true)) {
            tokens.push({ type: 'EQUALS', value: '===' });
            index += 3; // Skip '==='
        } else if (char === '"') {
            // Handle strings
            const endQuoteIndex = code.indexOf('"', index + 1);
            if (endQuoteIndex !== -1) {
                const stringValue = code.slice(index, endQuoteIndex + 1);
                tokens.push({ type: 'STRING', value: stringValue });
                index = endQuoteIndex + 1;
            } else {
                // Handle unterminated string (error case)
                index++;
            }
        } else if (/[a-zA-Z_]/.test(char)) {
            // Handle identifiers
            let identifier = char;
            while (/[a-zA-Z0-9_]/.test(code[index + 1])) {
                identifier += code[index + 1];
                index++;
            }
            tokens.push({ type: 'IDENTIFIER', value: identifier });
            index++;
        } else if (startsWithKeyword(code, index, '<>')) {
            tokens.push({ type: 'DELIMITER', value: '<>' });
            index += 2; // Skip '<>'
        } else {
            // Handle unexpected characters (error case)
            index++;
        }
    }

    return tokens;
}

function startsWithKeyword(str, index, keyword, caseSensitive = false) {
    const substring = str.slice(index, index + keyword.length);
    return caseSensitive ? substring === keyword : substring.toLowerCase() === keyword.toLowerCase();
}

const code = 'IF(x===3)<>prinT("x is 3")<> else<>print("x is 2")<>';
const tokens = tokenize(code);

// Print the resulting tokens
tokens.forEach(token => {
    console.log(token);
});
