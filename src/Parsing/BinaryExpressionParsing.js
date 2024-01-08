import { BinaryExpression, LogicalExpression } from './Classes.js'
import generate, { CodeGenerator } from '@babel/generator'
import { getNode } from '../helpers/getNode.js'
import { parseMemberExpression } from './MemberExpressionParsing.js'
import { tokenize } from '../tokenization/tokenize.js'
import fs from 'fs'


const code = fs.readFileSync('D:/codes/lang/src/code.goat', { encoding: 'utf8' })

//const tokens = [
//    { type: 'Number', value: 2 },
//]

//const tokens = [
//      { type: 'identifier', value: 'arr' },
//  { type: 'access_operator', value: '->' },
//  { type: 'openeing_parenthesis', value: '(' },
//  { type: 'identifier', value: 'arr' },
//  { type: 'dot_operator', value: '.' },
//  { type: 'identifier', value: 'length' },
//      { type: 'operator', value: '-' },
//  { type: 'Number', value: 1 },
//  { type: 'closing_parenthesis', value: ')' },
//]

//const tokens = [
//    { type: 'identifier', value: 'n' },
//    { type: 'operator', value: '*' },
//    { type: 'Number', value: 2 },
//    { type: 'operator', value: '+' },
//    { type: 'Number', value: 2 },
//]
//
//const tokens = [
//    { type: 'identifier', value: 'fibonacci' },
//    { type: 'openeing_parenthesis', value: '(' },
//    { type: 'identifier', value: 'n' },
//    { type: 'operator', value: '+' },
//    { type: 'Number', value: 1 },
//    { type: 'closing_parenthesis', value: ')' },
//    { type: 'operator', value: '+' },
//    { type: 'identifier', value: 'fibonacci' },
//    { type: 'openeing_parenthesis', value: '(' },
//    { type: 'identifier', value: 'n' },
//    { type: 'operator', value: '+' },
//    { type: 'Number', value: 2 },
//    { type: 'closing_parenthesis', value: ')' },
//]
//const tokens = [
//  { type: 'identifier', value: 'console' },
//  { type: 'dot_operator', value: '.' },
//  { type: 'identifier', value: 'log' },
//  { type: 'openeing_parenthesis', value: '(' },
//  { type: 'identifier', value: 'k' },
//  {type: "operator" , value : "+"},
//  { type: 'identifier', value: 'j' },
//  {type: "operator" , value : "+"},
//  { type: 'identifier', value: 'k' },
//  {type: "operator" , value : "+"},
//  { type: 'identifier', value: 'j' },
//  { type: 'closing_parenthesis', value: ')' }
//]

//const tokens =
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

// (k < j && i === l )
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
    let isExpLogicalOrBinary = false
    let isInParameter = false
    tokens.forEach((token, idx) => {
        if ((token?.value === '(' && tokens[idx - 1]?.type === 'identifier') || (token?.value === "(" && tokens[idx-1].value === "->")) {
            isInParameter = true
        }
        if (isInParameter && token.value === ')') {
            isInParameter = false
        }
        if (
            (token.value === '||' ||
                token.value === '&&' ||
                token.value === '==' ||
                token.value === '===' ||
                token.value === '!' ||
                token.value === '+' ||
                token.value === '-' ||
                token.value === '**' ||
                token.value === '/' ||
                token.value === '*' ||
                token.value === '%' ||
                token.value === '>' ||
                token.value === '<') &&
            !isInParameter
        ) {
            isExpLogicalOrBinary = true
        }
    })
    return isExpLogicalOrBinary
}

function precedenceOf(opr) {
    switch (opr) {
        case '>':
            return 6
        case '<':
            return 6
        case '-':
            return 5
        case '+':
            return 4
        case '*':
            return 3
        case '%':
            return 2
        case '/':
            return 1
        case '**':
            return 0
    }
}

export function parseLogicalExpression(tokens) {
    if (!isItExpressionStatement(tokens)) {
        if (tokens.length === 1) {
            return getNode(tokens.pop())
        } else {
            return parseMemberExpression(tokens, 0)
        }
    }

    if (tokens[0]?.value === '(' && tokens[tokens.length - 1]?.value === ')') {
        tokens.pop()
        tokens.shift()
    }

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
            } else if (
                (tokens[idx].value === '&&' && tokens[i].value === '||') ||
                ((tokens[i].value === '&&' || tokens[i].value === '||') && tokens[idx].value === '===')
            ) {
                idx = i
            }
        }
    }

    let index = null

    if (!idx) {
        let paranCount = 0
        for (let i = 0; i < tokens?.length - 1; i++) {
            if (tokens[i].value === '(') {
                paranCount++
            } else if (tokens[i].value === ')') {
                paranCount--
            } else if (
                paranCount <= 0 &&
                (tokens[i].value === '+' ||
                    tokens[i].value === '*' ||
                    tokens[i].value === '/' ||
                    tokens[i].value === '-' ||
                    tokens[i].value === '**' ||
                    tokens[i].value === '>' ||
                    tokens[i].value === '%' ||
                    tokens[i].value === '<')
            ) {
                if (!index) {
                    index = i
                } else if (precedenceOf(tokens[index].value) < precedenceOf(tokens[i].value)) {
                    index = i
                }
            }
        }
    }

    let exp = new BinaryExpression()
    if (idx) {
        exp = new LogicalExpression()
        let left = tokens.slice(0, idx)
        let right = [...tokens.slice(idx + 1, tokens.length + 1)]

        exp.setLeft(parseLogicalExpression(left))
        exp.setOperator(tokens[idx].value)
        exp.setRight(parseLogicalExpression(right))
    } else if (index) {
        let left = tokens.slice(0, index)
        let right = [...tokens.slice(index + 1, tokens.length + 1)]

        exp.setLeft(parseLogicalExpression(left))
        exp.setOperator(tokens[index].value)
        exp.setRight(parseLogicalExpression(right))
    }
    return exp
}

const generatedTokens = tokenize(code)
console.log(generatedTokens)
let ast = parseLogicalExpression(generatedTokens)
console.log(ast)
console.log(generate.default(ast).code)
