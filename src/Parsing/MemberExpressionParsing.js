import { MemberExpression, CallExpression, ExpressionStatement } from './Classes.js'
import { parseLogicalExpression } from './BinaryExpressionParsing.js'
import generate from '@babel/generator'
import { getNode } from '../helpers/getNode.js'
//
//const tokens = [
//    { type: 'string', value: 'arr' },
//    { type: 'dot_operator', value: '.' },
//    { type: 'identifier', value: 'length' },
//    { type: 'openeing_parenthesis', value: '(' },
//    { type: 'closing_parenthesis', value: ')' },
//]

function parseArguments(tokens, i) {
    let paranCount = 1
    i++
    let args = []
    while (paranCount !== 0) {
        let tempTokens = []
        let paramCount = 0
        while (true) {
            if (tokens[i]?.value === ',' || (tokens[i]?.value === ')' && paramCount === 0)) {
                break
            }
            if (tokens[i]?.value === ')') {
                paramCount++
            }
            if (tokens[i]?.value === '(') {
                paramCount--
            }
            tempTokens.push(tokens[i])
            i++
        }
        if (tokens[i]?.value === ',' || (tokens[i].value === ')' && tempTokens.length)) {
            let node = parseLogicalExpression(tempTokens)
            tempTokens = []
            args.push(node)
        }
        if (tokens[i]?.value === '(') {
            paranCount++
        }
        if (tokens[i]?.value === ')') {
            paranCount--
        }
        i++
    }
    return [args, i]
}

export function parseMemberExpression(tokens, i) {
    if (
        tokens[i].type !== 'identifier' &&
        tokens[i].type !== 'string' &&
        tokens[i].type !== 'Number' &&
        tokens[i].type === 'keyword'
    ) {
        return
    }
    let currExp = new ExpressionStatement()
    let tempToken =
        tokens[i]?.type === 'identifier' || tokens[i].type === 'string' || tokens[i].type === 'Number'
            ? tokens[i]
            : null
    while (i < tokens.length) {
        if (tokens[i].value === '(') {
            let callExp = new CallExpression()
            callExp.setCallee(currExp?.expression ? currExp?.expression : getNode(tempToken))
            let [args, j] = parseArguments(tokens, i)
            i = j
            args.forEach((arg) => callExp.pushArg((arg)))
            currExp.setExpression(callExp)
        }
        if (tokens[i]?.value === '.' || tokens[i]?.value === '->') {
            i++
            if (tokens[i]?.value === '(' && tokens[i]?.type === 'openeing_parenthesis') {
                i++
                let tempTokens = []
                while (tokens[i]?.value !== ')' && tokens[i]?.type !== 'closing_parenthesis') {
                    tempTokens.push(tokens[i])
                    i++
                }
                let memberExp = new MemberExpression()
                memberExp.setObj(currExp?.expression ? currExp?.expression : getNode(tempToken))
                tempTokens.length === 1
                    ? memberExp.setProperty(getNode(tempTokens[0]))
                    : memberExp.setProperty(parseLogicalExpression(tempTokens, 0))
                memberExp.computed = true
                currExp.setExpression(memberExp)
            } else {
                let memberExp = new MemberExpression()
                memberExp.setObj(currExp?.expression ? currExp?.expression : getNode(tempToken))
                memberExp.setProperty(getNode(tokens[i]))
                currExp.setExpression(memberExp)
            }
        }
        i++
    }
    return currExp.expression
}

//const ast = parseMemberExpression(tokens, 0)
//console.log(JSON.stringify(ast,null,2))
//console.log(ast)
//console.log(generate.default(ast).code)
