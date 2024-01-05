import { identifyToken } from "./helper.js";
import { tokenizeCode } from "./tokenize.js";

function createAST(tokens) {
  const stack = [];
  let current = 0;

  while (current < tokens.length) {
    const token = tokens[current];

    if (token.type === "identifier") {
      stack.push({
        type: "Identifier",
        name: token.value,
      });
      
    }else if(token.type === "Number"){
      stack.push({
        type: "NumericLiteral",
        name: token.value,
      });
    } 
    else if (token.type === "colon") {
      if (tokens[current + 1].type == "openening_squarly") {
        current += 2;
        let property = {
          type: "ObjectProperty",
          key: stack.pop(),
          value: {
            type: "ArrayExpression",
            elements: [],
          },
        };

        while (tokens[current].type !== "closing_squarly") {
          if (tokens[current].type === "comma") {
            current++;
          } else {
                let arrayElement = identifyToken(stack,tokens[current])
                property.value.elements.push(arrayElement)

            current++;
          }
        }
        current++;
        stack[0].right.properties.push(property);
      } else if (tokens[current + 1].type == "objectStart") {
        current += 2;

        let property = {
          type: "ObjectProperty",
          key: stack.pop(),
          value: {
            type: "ObjectExpression",
            properties: [],
          },
        };

        while (tokens[current].type !== "objectEnd") {
          if (
            tokens[current].type === "comma" ||
            tokens[current].type === "colon"
          ) {
            current++;
          } else {
            let objectProperty = {
              type: "Property"

            }
            let objectKey = identifyToken(stack,tokens[current])
            let objectValue = identifyToken(stack,tokens[current + 2])
            objectProperty.key = objectKey
            objectProperty.value = objectValue
            property.value.properties.push(objectProperty)
            current += 3;
          }
        }
        current++
        stack[0].right.properties.push(property);
       
      } else {
        let property = {
          type: "ObjectProperty",
          key: stack.pop(),
          value:{}
        };
         property.value = identifyToken(stack,tokens[current+1])
        stack[0].right.properties.push(property);
        current += 2;
      }
    } 
    else if (token.type === "equals") {
      current++;
      const assignmentExpression = {
        type: "AssignmentExpression",
        operator: "=",
        left: stack.pop(),
        right: {
          type: "ObjectExpression",
          properties: [],
        },
      };
      stack.push(assignmentExpression);
    } else if (token.type === "objectEnd" || token.type === "comma") {
      current++;
    } else {
      throw new Error(`(last else) Unexpected token: ${token.type} at position: ${current} `);
    }

    current++;
  }

  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }

  const ast = {
    type: "File",
    program: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: stack[0],
        },
      ],
    },
  };

  return ast.program.body[0].expression.right

  // console.log(JSON.stringify(ast.program.body[0].expression.right, null, 2));

  // return ast;
}

// Example usage:
// const tokens = [
//   { type: "objectStart", value: "{" },
//   { type: "identifier", value: "name" },
//   { type: "colon", value: ":" },
//   { type: "string", value: "hassan" },
//   { type: "comma", value: "," },
//   { type: "identifier", value: "age" },
//   { type: "colon", value: ":" },
//   { type: "Number", value: 21 },
//   { type: "comma", value: "," },
//   { type: "identifier", value: "friends" },
//   { type: "colon", value: ":" },
//   { type: "NullLiteral", value: "null" },
//   { type: "comma", value: "," },
//   { type: "identifier", value: "achievements" },
//   { type: "colon", value: ":" },
//   { type: "identifier", value: "undefined" },
//   { type: "comma", value: "," },
//   { type: "identifier", value: "hobbies" },
//   { type: "colon", value: ":" },
//   { type: "openening_squarly", value: "[" },
//   { type: "string", value: "coding" },
//   { type: "comma", value: "," },
//   { type: "string", value: "failing" },
//   { type: "comma", value: "," },
//   { type: "string", value: "succeeding" },
//   { type: "closing_squarly", value: "]" },
//   { type: "comma", value: "," },
//   { type: "identifier", value: "address" },
//   { type: "colon", value: ":" },
//   { type: "objectStart", value: "{" },
//   { type: "identifier", value: "country" },
//   { type: "colon", value: ":" },
//   { type: "string", value: "Pakistan" },
//   { type: "comma", value: "," },
//   { type: "identifier", value: "city" },
//   { type: "colon", value: ":" },
//   { type: "string", value: "Karachi" },
//   { type: "objectEnd", value: "}" },
//   { type: "comma", value: "," },
//   { type: "Number", value: 123 },
//   { type: "colon", value: ":" },
//   { type: "string", value: "numbers" },
//   { type: "comma", value: "," },
//   { type: "identifier", value: "cool" },
//   { type: "colon", value: ":" },
//   { type: "boolean", value: false },
//   { type: "objectEnd", value: "}" },
// ];

const tokens = [
  { type: 'objectStart', value: '{' },
  { type: 'identifier', value: 'name' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'usman' },
  { type: 'comma', value: ',' },
  { type: 'identifier', value: 'age' },
  { type: 'colon', value: ':' },
  { type: 'Number', value: 20 },
  { type: 'comma', value: ',' },
  { type: 'identifier', value: 'lol' },
  { type: 'colon', value: ':' },
  { type: 'objectStart', value: '{' },
  { type: 'identifier', value: 'lel' },
  { type: 'colon', value: ':' },
  { type: 'string', value: '8' },
  { type: 'objectEnd', value: '}' },
  { type: 'comma', value: ',' },
  { type: 'identifier', value: 'is' },
  { type: 'colon', value: ':' },
  { type: 'boolean', value: 'false' },
  { type: 'comma', value: ',' },
  { type: 'identifier', value: 'arr' },
  { type: 'colon', value: ':' },
  { type: 'openening_squarly', value: '[' },
  { type: 'Number', value: 2 },
  { type: 'comma', value: ',' },
  { type: 'Number', value: 3 },
  { type: 'comma', value: ',' },
  { type: 'Number', value: 5 },
  { type: 'closing_squarly', value: ']' },
  { type: 'objectEnd', value: '}' }
]

  let declaration =  [
    { type: "identifier", value: "temp" },
    { type: "equals", value: "=" }]

try {
  const ast = createAST([...declaration,...tokens]);
  console.log(JSON.stringify(ast, null, 2));
} catch (error) {
  console.error(error.message);
}
