import generate from '@babel/generator'

function createAST(tokens) {
  const stack = [];
  let current = 0;

  while (current < tokens.length) {
    const token = tokens[current];

    if (token.type === "Identifier") {
      stack.push({
        type: "Identifier",
        name: token.value,
      });
      
    }else if(token.type === "NumericLiteral"){
      stack.push({
        type: "NumericLiteral",
        name: token.value,
      });
    } 
    else if (token.type === "colon") {
      if (tokens[current + 1].type == "arrayStart") {
        current += 2;
        let property = {
          type: "ObjectProperty",
          key: stack.pop(),
          value: {
            type: "ArrayExpression",
            elements: [],
          },
        };

        while (tokens[current].type !== "arrayEnd") {
          if (tokens[current].type === "comma") {
            current++;
          } else {
            tokens[current].type === "Identifier"
              ? property.value.elements.push({
                  type: tokens[current].type,
                  name: tokens[current].value,
                })
              : property.value.elements.push({
                  type: tokens[current].type,
                  value: tokens[current].value,
                });
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
            property.value.properties.push({
              type: "ObjectProperty",
              key: {
                type: tokens[current].type,
                name: tokens[current].value,
              },
              value:
                tokens[current].type === "Identifier"
                  ? {
                      type: tokens[current + 2].type,
                      name: tokens[current + 2].value,
                    }
                  : {
                      type: tokens[current + 2].type,
                      value: tokens[current + 2].value,
                    },
            });
            current += 3;
          }
        }
        current++
        stack[0].right.properties.push(property);
      } else {
        let property = {
          type: "ObjectProperty",
          key: stack.pop(),
          value:
            tokens[current+1].type == "Identifier"
              ? {
                  type: tokens[current + 1].type,
                  name: tokens[current + 1].value,
                }
              : {
                  type: tokens[current + 1].type,
                  value: tokens[current + 1].value,
                },
        };
        stack[0].right.properties.push(property);
        current += 2;
      }
    } else if (token.type === "equals") {
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
      throw new Error(`(last else) Unexpected token: ${current} ${token.type}`);
    }

    current++;
  }

  // if (stack.length !== 1) {
  //   throw new Error("Invalid expression");
  // }

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

console.log(generate.default(ast).code)

  // return ast;
}

// Example usage:
const tokens = [
  { type: "Identifier", value: "object" },
  { type: "equals", value: "=" },
  { type: "objectStart", value: "{" },
  { type: "Identifier", value: "name" },
  { type: "colon", value: ":" },
  { type: "StringLiteral", value: "hassan" },
  { type: "comma", value: "," },
  { type: "Identifier", value: "age" },
  { type: "colon", value: ":" },
  { type: "NumericLiteral", value: 21 },
  { type: "comma", value: "," },
  { type: "Identifier", value: "friends" },
  { type: "colon", value: ":" },
  { type: "NullLiteral", value: "null" },
  { type: "comma", value: "," },
  { type: "Identifier", value: "achievements" },
  { type: "colon", value: ":" },
  { type: "Identifier", value: "undefined" },
  { type: "comma", value: "," },
  { type: "Identifier", value: "hobbies" },
  { type: "colon", value: ":" },
  { type: "arrayStart", value: "[" },
  { type: "StringLiteral", value: "coding" },
  { type: "comma", value: "," },
  { type: "NumericLiteral", value: "failing" },
  { type: "comma", value: "," },
  { type: "StringLiteral", value: "succeeding" },
  { type: "arrayEnd", value: "]" },
  { type: "comma", value: "," },
  { type: "Identifier", value: "address" },
  { type: "colon", value: ":" },
  { type: "objectStart", value: "{" },
  { type: "Identifier", value: "country" },
  { type: "colon", value: ":" },
  { type: "StringLiteral", value: "Pakistan" },
  { type: "comma", value: "," },
  { type: "Identifier", value: "city" },
  { type: "colon", value: ":" },
  { type: "StringLiteral", value: "Karachi" },
  { type: "objectEnd", value: "}" },
  { type: "comma", value: "," },
  { type: "NumericLiteral", value: 123 },
  { type: "colon", value: ":" },
  { type: "StringLiteral", value: "numbers" },
  { type: "comma", value: "," },
  { type: "Identifier", value: "cool" },
  { type: "colon", value: ":" },
  { type: "BooleanLiteral", value: false },
  { type: "objectEnd", value: "}" },
];

try {
  const ast = createAST(tokens);
  // console.log(JSON.stringify(ast, null, 2));
} catch (error) {
  console.error(error.message);
}
