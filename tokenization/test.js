import { parse } from "@babel/parser";
import generate, { CodeGenerator } from "@babel/generator";


let code = "let a = 'hello world'";

const ast = parse(code)
//console.log(ast.program.body)
//console.log(ast.program.body[0].declarations)
console.log("\n\n\n\n")
console.log(generate.default(ast))

//console.log(ast.program.body[0])


const output = new CodeGenerator(
  ast,
  {
  },
  code
)


