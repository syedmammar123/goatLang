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
    } else if (token.type === "colon") {
      if (tokens[current + 1].type == "arrayStart") {
        current += 2;
        let property = {
          type: "Property",
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
            property.value.elements.push({
              type: tokens[current].type,
              value: tokens[current].value,
              raw: tokens[current].value,
            });
            current++;
          }
        }
        current++
        stack[0].right.properties.push(property);
      } else if (tokens[current + 1].type == "objectStart") {
        current += 2;
  
        let property = {
          type: "Property",
          key: stack.pop(),
          value: {
            type: "ObjectExpression", 
            properties: [],
          },
        };
        
        while (tokens[current].type !== "objectEnd") {
          if (tokens[current].type === "comma" || tokens[current].type === "colon") {
            current++;
          } else {
            property.value.properties.push({
              type: "Property",
              key: {
                type: tokens[current].type,
                name: tokens[current].value,
              },
              value: {
                type: tokens[current + 2].type,
                value: tokens[current + 2].value,
                raw: tokens[current + 2].value,
              },
              kind: "init",
            });
            current += 3;
          }
        }
       
        stack[0].right.properties.push(property);
      } else {
        let property = {
          type: "Property",
          key: stack.pop(),
          value: {
            type: tokens[current + 1].type,
            value: tokens[current + 1].value,
            raw: tokens[current + 1].value,
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
    }
    else {
      throw new Error(`(last else) Unexpected token: ${current} ${token.type}`);
    }

    current++;
  }

  // if (stack.length !== 1) {
  //   throw new Error("Invalid expression");
  // }

  const ast = {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: stack[0],
      },
    ],
  };

  console.log(JSON.stringify(ast.body[0], null, 2));

  // return ast;
}

// Example usage:
const tokens = [
  { type: "identifier", value: "object" },
  { type: "equals", value: "=" },
  { type: "objectStart", value: "{" },
  { type: "identifier", value: "name" },
  { type: "colon", value: ":" },
  { type: "Literal", value: "hassan" },
  { type: "comma", value: "," },
  { type: "identifier", value: "age" },
  { type: "colon", value: ":" },
  { type: "Literal", value: "21" },
  { type: "comma", value: "," },
  { type: "identifier", value: "friends" },
  { type: "colon", value: ":" },
  { type: "Literal", value: "null" },
  { type: "comma", value: "," },
  { type: "identifier", value: "achievements" },
  { type: "colon", value: ":" },
  { type: "identifier", value: "undefined" },
  { type: "comma", value: "," },
  { type: "identifier", value: "hobbies" },
  { type: "colon", value: ":" },
  { type: "arrayStart", value: "[" },
  { type: "Literal", value: "coding" },
  { type: "comma", value: "," },
  { type: "Literal", value: "failing" },
  { type: "comma", value: "," },
  { type: "Literal", value: "succeeding" },
  { type: "arrayEnd", value: "]" },
  { type: "comma", value: "," },
  { type: "identifier", value: "address" },
  { type: "colon", value: ":" },
  { type: "objectStart", value: "{" },
  { type: "identifier", value: "country" },
  { type: "colon", value: ":" },
  { type: "identifier", value: "Pakistan" },
  { type: "comma", value: "," },
  { type: "identifier", value: "city" },
  { type: "colon", value: ":" },
  { type: "identifier", value: "Karachi" },
  { type: "objectEnd", value: "}" },
  { type: "objectEnd", value: "}" },
];

try {
  const ast = createAST(tokens);
  // console.log(JSON.stringify(ast, null, 2));
} catch (error) {
  console.error(error.message);
}

