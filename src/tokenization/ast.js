import generate from "@babel/generator";
import fs from "fs";
import {
  BlockStatement,
  FunctionDeclaration,
  Program,
  VariableDeclaration,
  VariableDeclarator,
  StringLiteral,
  NumericLiteral,
  Identifier,
} from "./Classes.js";
import { tokenize } from "./tokenize.js";

const code = fs.readFileSync("./code", { encoding: "utf8" });

function parseVariables(tokens, i) {
  let declarator1 = new VariableDeclarator();
  let id1 = new Identifier(tokens[i].value);
  declarator1.setId(id1);
  i++;
  if (tokens[i].value !== "=") {
    throw new Error("expected =");
  }
  i++;
  let init;
  if (tokens[i].type === "string") {
    init = new StringLiteral(tokens[i].value);
    declarator1.setInit(init);
  }
  if (tokens[i].type === "Number") {
    init = new NumericLiteral(tokens[i].value);
    declarator1.setInit(init);
  }
  return [declarator1, i];
}

export const generateAst = (tokens) => {
  let i = 0;
  let ast = new Program();
  let scope = [ast];
  while (i < tokens.length) {
    console.log(tokens[i]);
    if (
      tokens[i].value === "global" ||
      tokens[i].value === "const" ||
      tokens[i].type === "identifier"
    ) {
      let targetScope = scope[scope.length - 1];
      let var1 = new VariableDeclaration();
      if (tokens[i].value === "global") {
        targetScope = scope[0];
        i++;
      }
      if (tokens[i].value === "const") {
        var1.setType("const");
        i++;
      } else if (tokens[i].type === "identifier") {
        var1.setType("let");
      }
      const [declarator, j] = parseVariables(tokens, i);
      i = j;
      var1.pushDeclarators(declarator);
      if (targetScope instanceof Program) {
        targetScope.insert(var1, targetScope.body.length - 1);
      } else {
        targetScope.push(var1);
      }
    }
    if (tokens[i].type === "keyword" && tokens[i].value === "fun") {
      const fun = new FunctionDeclaration();
      scope[scope.length - 1].push(fun);
      i++;
      const id = new Identifier(tokens[i].value);
      fun.setId(id);
      i++;
      if (tokens[i].value !== "(") {
        throw new Error("( expected");
      }
      i++;
      let paramCount = 0;
      while (tokens[i].value !== ")") {
        if (tokens[i].type === "identifier") {
          fun.pushParams(new Identifier(tokens[i].value));
        }
        if (paramCount > 1000000) {
          throw new Error(") missing!");
        }
        i++;
        paramCount++;
      }

      i++;
      if (
        tokens[i].type === "openening_blockscope" &&
        tokens[i].value === "{"
      ) {
        let blockStatement = new BlockStatement();
        fun.setScope(blockStatement);
        scope.push(blockStatement);
      }
    }
    if (tokens[i].value === "}" && tokens[i].type === "closing_blockscope") {
      scope.pop();
      i++;
    }
    i++;
  }
  return ast;
};

let ast2 = {
  type: "CallExpression",
  name: "add",
  arguments: [
    { type: "NumericLiteral", value: 2 },
    { type: "NumericLiteral", value: 3 },
  ],
  callee: { type: "Identifier", name: "add" },
};

const generatedTokens = tokenize(code);
console.log(generatedTokens);

let ast1 = generateAst(generatedTokens);

console.log("\n\n\n");
console.log("Input");
console.log(code);
console.log("\n\n\n");
console.log("Output");
console.log(generate.default(ast1).code);
console.log("\n\n\n");
