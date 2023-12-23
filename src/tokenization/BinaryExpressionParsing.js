import { BinaryExpression, LogicalExpression } from './Classes.js'
import { parse } from '@babel/parser'
import generate, { CodeGenerator } from '@babel/generator'
import { getNode } from '../helpers/getNode.js'
import { parseMemberExpression } from './MemberExpressionParsing.js'

//const tokens =
//
//[
//  { type: 'openeing_parenthesis', value: '(' },
//  { type: 'identifier', value: 'k' },
//  { type: 'less_than', value: '<' },
//  { type: 'identifier', value: 'j' },
//  { type: 'logical_operator', value: '&&' },
//  { type: 'identifier', value: 'i' },
//  { type: 'triple_equality', value: '===' },
//  { type: 'identifier', value: 'l' },
//  { type: 'closing_parenthesis', value: ')' }
//]
//

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

function isItExpressionStatement(tokens) {
    let isExpLogical = false
    tokens.forEach((token) => {
        if (
            token.value === '||' ||
            token.value === '&&' ||
            token.value === '==' ||
            token.value === '===' ||
            token.value === '!' ||
            token.value === '+' ||
            token.value === '-' ||
            token.value === '/' ||
            token.value === '*' ||
            token.value === '%'
        ) {
            isExpLogical = true
        }
    })
    return isExpLogical
}

export function parseLogicalExpression(tokens) {
    if (!isItExpressionStatement(tokens)) {
        if (tokens.length === 1) {
            console.log(tokens)
            return getNode(tokens.pop())
        } else {
            console.log(tokens, 'turrrrr')
            return parseMemberExpression(tokens, 0)
        }
    }

    if (tokens[0]?.value === '(' && tokens[tokens.length - 1]?.value === ')') {
        tokens.pop()
        tokens.shift()
    }

    let token = tokens.pop()

    let expression = []

    let idx = null
    let paramCount = 0

    for (let i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].value === ')') {
            paramCount++
        }
        if (tokens[i].value === '(') {
            paramCount--
        }
        if ((tokens[i].value === '&&' || tokens[i].value === '||' || tokens[i].value === '===') && paramCount <= 0) {
            if (!idx) {
                idx = i
            } else if (tokens[idx].value === '&&' && tokens[i].value === '||') {
                idx = i
            }
        }
    }

    if (token?.value === ')' && !idx) {
        let paranCount = 0
        paranCount++
        while (paranCount !== 0) {
            token = tokens.pop()
            if (token.value === ')') {
                paranCount++
            } else if (token.value === '(') {
                paranCount--
            }
            expression.unshift(token)
        }
        expression.shift()
    }

    let exp = new BinaryExpression()
    if (idx) {
        exp = new LogicalExpression()
        let left = tokens.slice(0, idx)
        let right = [...tokens.slice(idx + 1, tokens.length + 1), token]

        exp.setLeft(parseLogicalExpression(left))
        exp.setOperator(tokens[idx].value)
        exp.setRight(parseLogicalExpression(right))
    } else if (expression.length) {
        if (!tokens.length) {
            exp = parseLogicalExpression(expression)
        } else {
            exp.setRight(parseLogicalExpression(expression))
            exp.setOperator(tokens?.pop()?.value)
            exp.setLeft(parseLogicalExpression(tokens))
        }
    } else {
        exp.setRight(getNode(token))
        exp.setOperator(tokens?.pop()?.value)
        exp.setLeft(parseLogicalExpression(tokens))
    }
    console.log(exp.right)
    return exp
}

//let ast  = parseLogicalExpression(tokens)
//console.log(ast)
