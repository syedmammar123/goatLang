//import { parse } from "@babel/parser";
//import generate, { CodeGenerator } from "@babel/generator";
//
//let code = "let a = 'hello world'";
//
//const ast = parse("for (let i = 0 ; i < 10 ; i=i+2) { console.log(i)}");
//console.log(ast.program.body);
////console.log(ast.program.body[0].declarations)
//console.log("\n\n\n\n");
//console.log(generate.default(ast).code);
//
////console.log(ast.program.body[0])
//
//const output = new CodeGenerator(ast, {}, code);

function insertIntoArray(arr, idx, val) {
  if (idx > arr.length) {
    return;
  }
  for (let i = arr.length; i >= idx; i--) {
    arr[i] = arr[i - 1];
  }
  arr[idx] = val;
}

let a = [];
insertIntoArray(a, 0, 69);
insertIntoArray(a, 0, 69);
insertIntoArray(a, 0, 69);
insertIntoArray(a, 0, 69);
insertIntoArray(a, 0, 69);
insertIntoArray(a, 0, 69);

console.log(a);
