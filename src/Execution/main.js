import { tokenize } from '../tokenization/tokenize.js'
import { generateAst } from '../Parsing/ast.js'
import generate from '@babel/generator'

export function generateJsCode(goatCode) {
    try {
        let tokens = tokenize(goatCode)
        let ast = generateAst(tokens)

        let code = generate.default(ast).code
        return code
    } catch (e) {
        console.log(e.message)
    }
}
