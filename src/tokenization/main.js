import { tokenize } from "./tokenize.js";
import { generateAst } from "./ast.js";
import generate from "@babel/generator";


export function generateJsCode(goatCode){
    try {
    let tokens = tokenize(goatCode)
    let ast = generateAst(tokens)
    let code = generate.default(ast).code
        return code
    }catch(e){
        console.log(e.message)
    }
}
