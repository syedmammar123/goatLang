import { BinaryExpression ,LogicalExpression , StringLiteral, Identifier} from "./Classes.js";
import { parse } from "@babel/parser";
import generate, { CodeGenerator } from "@babel/generator";

const tokens = [
  { type: "openeing_parenthesis", value: "(" },
  { type: "identifier", value: "k" },
  { type: "less_than", value: "<" },
  { type: "identifier", value: "j" },
  { type: "closing_parenthesis", value: ")" },
  { type: "logical_operator", value: "&&" },
  { type: "identifier", value: "i" },
  { type: "triple_equality", value: "===" },
  { type: "identifier", value: "l" },
  { type: "logical_operator", value: "&&" },
  { type: "identifier", value: "i" },
  { type: "double_equality", value: "==" },
  { type: "identifier", value: "u" },
  { type: "logical_operator", value: "||" },
  { type: "identifier", value: "t" },
  { type: "less_than", value: "<" },
  { type: "identifier", value: "p" },
  { type: "logical_operator", value: "&&" },
  { type: "identifier", value: "w" },
  { type: "triple_equality", value: "===" },
  { type: "identifier", value: "o" },
];



//const tokens = [
//    {type: "Number" , value : "99"},
//    {type: "operator" , value : "+"},
//    {type: "opening_paran" , value : "("},
//    {type: "identifier" , value : "num"},
//    {type: "operator" , value : "-"},
//    {type: "Number" , value : "3"},
//    {type: "closing_paran" , value : ")"},
//    {type: "operator" , value : "-"},
//    {type: "opening_paran" , value : "("},
//    {type: "Number" , value : "1"},
//    {type: "operator" , value : "/"},
//    {type: "opening_paran" , value : "("},
//    {type: "Number" , value : "9"},
//    {type: "operator" , value : "*"},
//    {type: "Number" , value : "87"},
//    {type: "closing_paran" , value : ")"},
//    {type: "closing_paran" , value : ")"},
//    {type: "operator" , value : "**"},
//    {type: "Number" , value : "72"},
//]

 //99 + (num - 3) - (1 / (9 * 87)) ** 72


export function parseLogicalExpression(tokens) {
  if (tokens.length === 1) {
    return tokens.pop().value;
  }

  let token = tokens.pop();

  let expression = [];

  if (token?.value === ")") {
    let paranCount = 0;
    paranCount++;
    while (paranCount !== 0) {
      token = tokens.pop();
      if (token.value === ")") {
        paranCount++;
      } else if (token.value === "(") {
        paranCount--;
      }
      expression.unshift(token);
    }
    expression.shift();
  }

  let idx = null;
  let paramCount = 0;

  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].value === ")") {
      paramCount++;
    }
    if (tokens[i].value === "(") {
      paramCount--;
    }
    if (
      tokens[i].value === "&&" ||
      (tokens[i].value === "||" && paramCount === 0)
    ) {
      if (!idx) {
        idx = i;
      } else if (tokens[idx].value === "&&" && tokens[i].value === "||") {
        idx = i;
      }
    }
  }

  let exp = new BinaryExpression()
    if (idx) {
        exp = new LogicalExpression()
    let left = tokens.slice(0, idx);
    let right = [...tokens.slice(idx + 1, tokens.length + 1), token];
    if (left[0].value === "(") {
      left.shift();
    }
    if (left[left.length - 1].value === ")") {
      left.pop();
    }
    if (right[0].value === "(") {
      left.shift();
    }
    if (left[right.length - 1].value === ")") {
      left.pop();
    }
    exp.setLeft(parseLogicalExpression(left))
    exp.setOperator(tokens[idx].value)
    exp.setRight(parseLogicalExpression(right))
  } else if (expression.length) {
    exp.setRight(parseLogicalExpression(expression))
    exp.setOperator(tokens?.pop()?.value)
    exp.setLeft(parseLogicalExpression(tokens))
  } else {
    exp.setRight(token?.value) 
    exp.setOperator(tokens?.pop()?.value)
    exp.setLeft(parseLogicalExpression(tokens))
  }
  return exp;
}

function parseBinaryExpression(tokens) {
  if (tokens.length === 1) {
    return tokens.pop().value;
  }
  let token = tokens.pop();
  let expression = [];
  if (token.value === ")") {
    let paranCount = 0;
    paranCount++;
    while (paranCount !== 0) {
      token = tokens.pop();
      if (token.value === ")") {
        paranCount++;
      } else if (token.value === "(") {
        paranCount--;
      }
      expression.unshift(token);
    }
    expression.shift();
  }
  let exp = {
    type: "BinaryExpression",
    left: null,
    operator: null,
    right: null,
  };
  if (expression.length) {
    exp.right = parseBinaryExpression(expression);
    exp.operator = tokens.pop().value;
    exp.left = parseBinaryExpression(tokens);
  } else {
    exp.right = token.value;
    exp.operator = tokens.pop().value;
    exp.left = parseBinaryExpression(tokens);
  }
  return exp;
}

let ast  = parseLogicalExpression(tokens)
console.log(ast)
//
//let code = "let a = 'hello world'";
//
//const ast = parse("for (let i = 0 ; i < 10 ; i=i+2) { console.log(i)}");
//console.log(ast.program.body);
////console.log(ast.program.body[0].declarations)
//console.log("\n\n\n\n");
console.log(generate.default(ast).code);
//
////console.log(ast.program.body[0])
//
//const output = new CodeGenerator(ast, {}, code);
