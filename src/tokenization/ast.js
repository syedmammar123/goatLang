import generate from "@babel/generator";
import fs from "fs";
import {
  BinaryExpression,
  IfStatement,
  ArrayExpression,
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
import { parseLogicalExpression } from "./BinaryExpressionParsing.js";

const code = fs.readFileSync("./code", { encoding: "utf8" });

function parseVariables(tokens, i, scope) {
  let declarator1 = new VariableDeclarator();
  let id1 = new Identifier(tokens[i].value);
  declarator1.setId(id1);
  i++;
  if (tokens[i].value !== "=") {
    throw new Error("expected =");
  }
  i++;
  let init;
  if (tokens[i].value === "[") {
    init = new ArrayExpression();
    scope.push(init);
  } else if (tokens[i]?.type === "string") {
    init = new StringLiteral(tokens[i].value);
  } else if (tokens[i]?.type === "Number") {
    init = new NumericLiteral(tokens[i].value);
  }
  declarator1.setInit(init);
  return [declarator1, i];
}

function parseFunction(tokens, i, destScope, scope) {
  const fun = new FunctionDeclaration();
  destScope.push(fun); // ye wo scope hai jahan function declare hoga
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
  if (tokens[i].type === "openening_blockscope" && tokens[i].value === "{") {
    let blockStatement = new BlockStatement();
    fun.setScope(blockStatement);
    scope.push(blockStatement); // ye is function ka apna scope hai
  }
  return i;
}

function parseIfStatements(tokens, i, currScope, scope) {
  let ifStat = new IfStatement();
  currScope.push(ifStat); // ye wo scope hai jahan if declare hoga
  i++;
  if (tokens[i]?.value !== "(") {
    throw new Error("Expected (");
  }
  i++;
  let testTokens = [];
  while (tokens[i].value !== "{") {
    testTokens.push(tokens[i]);
    i++;
  }
  testTokens.pop();
  console.log(testTokens, "Testtttttttt");
  ifStat.setTest(parseLogicalExpression(testTokens));
  console.log(ifStat.test);
  if (tokens[i].type === "openening_blockscope" && tokens[i].value === "{") {
    let blockStatement = new BlockStatement();
    ifStat.setConsequent(blockStatement);
    scope.push(ifStat.consequent); // ye is if ka apna scope hai
  }

  return i;
}

export const generateAst = (tokens) => {
  let i = 0;
  let ast = new Program();
  let letVariables = [];
  let scope = [ast];
  while (i < tokens.length) {
    if (tokens[i].value === "[") {
      // agr nested array ho to ...
      let arr = new ArrayExpression();
      scope[scope.length - 1].push(arr); // array ko current scope me add kia
      scope.push(arr); // array ko current scope bnaya so that next sare elements ushi array me add hon
      i++;
    }
    if (
      tokens[i].value === "," &&
      tokens[i].type === "comma" &&
      scope[scope.length - 1] instanceof ArrayExpression // comma ( seperator ) ko array me ignore krengy
    ) {
      i++;
    }
    if (
      tokens[i].type === "Number" &&
      scope[scope.length - 1] instanceof ArrayExpression // numbers ko current scope k array me add krengy
    ) {
      let temp = new NumericLiteral(tokens[i].value);
      scope[scope.length - 1].push(temp);
      i++;
    }
    if (
      tokens[i].type === "string" &&
      scope[scope.length - 1] instanceof ArrayExpression // same for strings
    ) {
      let temp = new StringLiteral(tokens[i].value);
      scope[scope.length - 1].push(temp);
      i++;
    }
    if (
      tokens[i].value === "global" ||
      tokens[i].value === "const" ||
      (tokens[i].type === "identifier" &&
        !letVariables.includes(tokens[i].value) && // its not already declared
        !(scope[scope.length - 1] instanceof ArrayExpression)) // checking that current scope array to ni bcs array me initialization nai hoskti
    ) {
      let targetScope = scope[scope.length - 1];
      let var1 = new VariableDeclaration();
      if (tokens[i].value === "global") {
        targetScope = scope[0]; // agr global variable hai to targetscope Program hoga (scope[0]) jo stack (scope) k bottom pe hai
        i++;
      }
      if (tokens[i].value === "const") {
        var1.setType("const");
        i++;
      } else if (tokens[i].type === "identifier") {
        letVariables.push(tokens[i].value);
        var1.setType("let");
      }
      const [declarator, j] = parseVariables(tokens, i, scope); // ye function keyword k baad ki value evaluate krke variable declarator return krta hai
      i = j;
      var1.pushDeclarators(declarator);
      if (
        targetScope instanceof Program &&
        scope.length > 1 &&
        !(scope[scope.length - 1] instanceof ArrayExpression) // agr taget scope main program hai And scope stack me 1 se zyada scopes hen means ksi function body me hen And jo current scope hai wo array nai hai
      ) {
        targetScope.insert(var1, targetScope.body.length - 1); // ...to variable ko push krdia target scope se just left me ( file me just upar ) (global scope)
      } else {
        targetScope.push(var1); // agr global variable nai to just current scope me add
      }
      i++;
    }
    if (tokens[i]?.type === "keyword" && tokens[i]?.value === "fun") {
      i = parseFunction(tokens, i, scope[scope.length - 1], scope);
      i++;
    }
    if (tokens[i]?.type === "keyword" && tokens[i]?.value === "if") {
      i = parseIfStatements(tokens, i, scope[scope.length - 1], scope);
      i++;
    }
    if (tokens[i]?.value === "}" && tokens[i]?.type === "closing_blockscope") {
      scope.pop(); // block statement khatam hoti hai to just scope se current scope pop krdo
      i++;
    }
    if (tokens[i]?.value === "]" && tokens[i]?.type === "closing_squarly") {
      scope.pop(); // same for arrays
      i++;
    }
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
console.log("\n");
console.log("Output");
console.log(generate.default(ast1).code);
console.log("\n\n\n");

//fun print(name,date){
//     a = 'Hello world'
//     fun hello(dob){
//        global const b = 329
//        global const v = 329
//        c = 999
//     }
//}
