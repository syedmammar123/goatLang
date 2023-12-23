import { MemberExpression, CallExpression, ExpressionStatement } from "./Classes.js";
import generate from "@babel/generator";
import { getNode } from "../helpers/getNode.js";


const tokens = [
  { type: 'identifier', value: 'arr' },
  { type: 'dot_operator', value: '.' },
  { type: 'identifier', value: 'length' },
  { type: 'openeing_parenthesis', value: '(' },
  { type: 'closing_parenthesis', value: ')' },
  { type: 'dot_operator', value: '.' },
  { type: 'identifier', value: 'sum' }
]

//const tokens = [
//  { type: 'identifier', value: 'print' },
//  { type: 'openeing_parenthesis', value: '(' },
//  { type: 'identifier', value: 'name' },
//  { type: 'closing_parenthesis', value: ')' }
//]
//


function parseArguments(tokens, i){
    let paranCount = 1
    i++
    let args = []
    while (paranCount !== 0){
        if (tokens[i].type === "identifier" || tokens[i].type === "Number" || tokens[i].type === "string"){
            let node = getNode(tokens[i])
            args.push(node)
        }
        else if (tokens[i].value === ","){
            i++
        }else if (tokens[i].value === "("){
            paranCount++
        }
        else if (tokens[i].value === ")"){
            paranCount--
        }
        i++
    }
    return [args , i]
}


function parseMemberExpression(tokens , i ){

    if (tokens[i].type !== "identifier"){
        return
    }
    let currExp = new ExpressionStatement()
    let tempToken = tokens[i]?.type === "identifier"  ? tokens[i] : null
    while (i < tokens.length){
            if (tokens[i].value === "("){
                let callExp = new CallExpression()
                callExp.setCallee(currExp?.expression ? currExp?.expression : tempToken)
                let [args,j ] = parseArguments(tokens,i)
                i = j
                callExp.pushArg(...args)
                currExp.setExpression(callExp)
            }
            if (tokens[i]?.value === "."){
                let memberExp = new MemberExpression()
                memberExp.setObj(currExp?.expression ? currExp?.expression :  getNode(tempToken))
                i++
                memberExp.setProperty(getNode(tokens[i]))
                currExp.setExpression(memberExp)
            }
                i++
        }
    return currExp
    
}


const ast = parseMemberExpression(tokens, 0)
console.log(ast)
console.log(generate.default(ast).code);
