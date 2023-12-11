function tokenizeCode(code) {
  const tokens = [];
  const regex =
    /\b\w+\b|"[^"]*"|'[^']*'|\{|\}|\:|\,|\=|[-]?\d*\.\d+|\d+|true|false|null|undefined|\[|\]/g;

  let match;
  while ((match = regex.exec(code)) !== null) {
    tokens.push({
      type: determineType(match[0]),
      value: determineValue(match[0]),
    });
  }

  

  return tokens;
}

function determineType(token) {
  if (token === "{") {
    return "objectStart";
  } else if (token === "}") {
    return "objectEnd";
  } else if (/\:/.test(token)) {
    return "colon";
  } else if (/\,/.test(token)) {
    return "comma";
  } else if (/\=/.test(token)) {
    return "equals";
  } else if (/^\d+$/.test(token)) {
    return "number";
  } else if (/^\b\w+\b$/.test(token)) {
    return "identifier";
  } else if (/^"[^"]*"$|^'[^']*'$/.test(token)) {
    return "string";
  } else if (/^true|false$/.test(token)) {
    return "boolean";
  } else if (/^null$/.test(token)) {
    return "null";
  } else if (/^undefined$/.test(token)) {
    return "undefined";
  } else if (/^\[$/.test(token)) {
    return "arrayStart";
  } else if (/^\]$/.test(token)) {
    return "arrayEnd";
  } else {
    return "unknown";
  }
}

function determineValue(token) {
  if (/^\b\w+\b$/.test(token)) {
    return token;
  } else if (/^"[^"]*"$|^'[^']*'$/.test(token)) {
    return token.slice(1, -1); // Remove quotes for string values
  } else if (/^-?\d*\.\d+$/.test(token)) {
    return parseFloat(token);
  } else if (/^\d+$/.test(token)) {
    return parseInt(token, 10);
  } else if (/^true$/.test(token)) {
    return true;
  } else if (/^false$/.test(token)) {
    return false;
  } else if (/^null$/.test(token)) {
    return null;
  } else if (/^undefined$/.test(token)) {
    return undefined;
  } else if (/^\[$/.test(token)) {
    return "[";
  } else if (/^\]$/.test(token)) {
    return "]";
  } else {
    return token;
  }
}

// Example usage:
const code =
  'object = { name: "hassan", age: 21, friends:null, achievements:undefined, hobbies:["coding", "failing", "succeeding"], address: {country: "Pakistan", city:"Karachi"}, 123:"numbers" }';
const tokens = tokenizeCode(code);
console.log(tokens);
