import generate from "@babel/generator";
import fs from "fs";
import {
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

const code = fs.readFileSync("./code", { encoding: "utf8" });

function parseVariables(tokens, i,scope) {
  let declarator1 = new VariableDeclarator();
  let id1 = new Identifier(tokens[i].value);
  declarator1.setId(id1);
  i++;
  if (tokens[i].value !== "=") {
    throw new Error("expected =");
  }
  i++;
  let init;
    if (tokens[i].value === '['){
        init = new ArrayExpression()
        scope.push(init)
    }
    
    else if (tokens[i]?.type === "string") {
    init = new StringLiteral(tokens[i].value);
  }
    else if (tokens[i]?.type === "Number") {
    init = new NumericLiteral(tokens[i].value);
  }
    declarator1.setInit(init);
  return [declarator1, i];
}


function parseFunction ( tokens, i , destScope, scope ){
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
      if (
        tokens[i].type === "openening_blockscope" &&
        tokens[i].value === "{"
      ) {
        let blockStatement = new BlockStatement();
        fun.setScope(blockStatement);
        scope.push(blockStatement);  // ye is function ka apna scope hai
      }
        return i
}


//    if (tokens[i].value === '['){
//        init = new ArrayExpression()
//        while (tokens[i].value !== ']'){
//            if (tokens[i].value === ',' && tokens[i].type === 'comma'){
//                i++
//            }
//            if (tokens[i].type === "Number"){
//            let temp = new NumericLiteral(tokens[i].value);
//                init.pushElement(temp)
//            }
//            if (tokens[i].type === "string"){
//            let temp = new StringLiteral(tokens[i].value);
//                init.pushElement(temp)
//            }
//            
//
//            i++
//        }
//        i++
//    }

export const generateAst = (tokens) => {
  let i = 0;
  let ast = new Program();
  let scope = [ast];
  while (i < tokens.length) {
      if (tokens[i].value === '['){
          let arr = new ArrayExpression()
          scope[scope.length - 1].push(arr)
          scope.push(arr)
          i++
      }
            if (tokens[i].value === ',' && tokens[i].type === 'comma' && scope[scope.length  - 1] instanceof ArrayExpression) {
                i++
            }
            if (tokens[i].type === "Number" && scope[scope.length  - 1] instanceof ArrayExpression){
            let temp = new NumericLiteral(tokens[i].value);
                scope[scope.length - 1].push(temp)
                i++
            }
            if (tokens[i].type === "string" && scope[scope.length  - 1] instanceof ArrayExpression){
            let temp = new StringLiteral(tokens[i].value);
               scope[scope.length - 1].push(temp)
                i++
            }
    if (
      tokens[i].value === "global" ||
      tokens[i].value === "const" ||
      tokens[i].type === "identifier"  &&
        !(scope[scope.length  - 1] instanceof ArrayExpression)
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
      const [declarator, j] = parseVariables(tokens, i,scope);
      i = j;
      var1.pushDeclarators(declarator);
      if (targetScope instanceof Program && scope.length > 1 && !(scope[scope.length  - 1] instanceof ArrayExpression) ) {
        targetScope.insert(var1, targetScope.body.length - 1);
      } else {
        targetScope.push(var1);
      }
        i++
    }
    if (tokens[i]?.type === "keyword" && tokens[i]?.value === "fun") {
        i = parseFunction(tokens, i, scope[scope.length - 1 ], scope)
        i++
    }
    if (tokens[i]?.value === "}" && tokens[i]?.type === "closing_blockscope") {
      scope.pop();
      i++;
    }
    if (tokens[i]?.value === "]" && tokens[i]?.type === "closing_squarly") {
      scope.pop();
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
console.log("\n\n\n");
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
