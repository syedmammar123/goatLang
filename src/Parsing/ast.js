import generate from '@babel/generator'
import fs from 'fs'
import { parseForLoop } from './ParseForLoop.js'
import { parseFunction } from './ParseFunctions.js'
import { parseAssignmentExpressions } from './ParseAssignmentExpressions.js'
import { parseVariables } from './ParseVariables.js'
import { parseIfStatements } from './ParseConditionalStatements.js'
import { tokenize } from '../tokenization/tokenize.js'
import { parseLogicalExpression } from './BinaryExpressionParsing.js'
import { getNode } from '../helpers/getNode.js'
import { keywords } from '../environment/environment.js'
import {
    ReturnStatement,
    ArrayExpression,
    Program,
    VariableDeclaration,
    ExpressionStatement,
} from './Classes.js'
import { parseUntilLoop } from './ParseUntilLoop.js'

const code = fs.readFileSync('D:/codes/lang/src/code.goat', { encoding: 'utf8' })

export const generateAst = (tokens) => {
    let i = 0
    let ast = new Program()
    let variables = []
    let scope = [ast]
    while (i < tokens.length) {
        if (tokens[i].value === '[') {
            // agr nested array ho to ...
            let arr = new ArrayExpression()
            scope[scope.length - 1].push(arr) // array ko current scope me add kia
            scope.push(arr) // array ko current scope bnaya so that next sare elements ushi array me add hon
            i++
        }
        if (
            tokens[i].value === ',' &&
            tokens[i].type === 'comma' &&
            scope[scope.length - 1] instanceof ArrayExpression // comma ( seperator ) ko array me ignore krengy
        ) {
            i++
        }
        if (
            (tokens[i].type === 'identifier' ||
                (tokens[i].type === 'keyword' && (tokens[i].value === 'global' || tokens[i].value === 'const'))) &&
            !variables.includes(tokens[i].value) &&
            scope[scope.length - 1] instanceof ArrayExpression
        ) {
            throw new Error(`${tokens[i].value} is not declared`)
        }

        if (
            (((tokens[i].type === 'identifier' && variables.includes(tokens[i].value)) || // array values ya ksi non declarative ya non assignment statements k lie
                tokens[i]?.type === 'Number' ||
                tokens[i]?.type === 'string') &&
                tokens[i + 1]?.value !== '=') ||
            (tokens[i + 1]?.value === '(' && tokens[i]?.type !== 'keyword')
        ) {
            console.log(tokens[i], 'invoked')
            let expTokens = []
            while (true) {
                if (
                    ((expTokens[expTokens.length - 1]?.type === 'identifier' ||
                        expTokens[expTokens.length - 1]?.type === 'string' ||
                        expTokens[expTokens.length - 1]?.type === 'Number') &&
                        (tokens[i]?.type === 'identifier' ||
                            tokens[i]?.type === 'string' ||
                            tokens[i]?.type === 'Number' ||
                            keywords?.includes(tokens[i]?.value))) ||
                    tokens.length <= i ||
                    tokens[i].value === ']' ||
                    tokens[i].value === ','
                ) {
                    break
                }
                expTokens.push(tokens[i])
                i++
            }
            console.log(expTokens, 'tokenss', tokens[i])

            if (expTokens.length === 1) {
                scope[scope.length - 1].push(getNode(expTokens[0]))
            } else {
                scope[scope.length - 1].push(parseLogicalExpression(expTokens))
            }
        }

        if (tokens[i]?.type === 'identifier' && variables.includes(tokens[i]?.value) && tokens[i + 1]?.value === '=') {
            // assignment expression k lie
            const expressionExp = new ExpressionStatement()
            scope[scope.length - 1].push(expressionExp)
            i = parseAssignmentExpressions(tokens, i, scope, 'setExpression', expressionExp)
        }

        if (
            tokens[i]?.value === 'global' ||
            tokens[i]?.value === 'const' ||
            (tokens[i]?.type === 'identifier' &&
                !variables.includes(tokens[i].value) && // its not already declared
                !(scope[scope.length - 1] instanceof ArrayExpression) && // checking that current scope array to ni bcs array me initialization nai hoskti
                !(tokens[i + 1]?.value === '('))
        ) {
            let targetScope = scope[scope.length - 1]
            let var1 = new VariableDeclaration()
            if (tokens[i].value === 'global') {
                targetScope = scope[0] // agr global variable hai to targetscope Program hoga (scope[0]) jo stack (scope) k bottom pe hai
                i++
            }
            if (tokens[i].value === 'const') {
                var1.setType('const')
                i++
            } else if (tokens[i].type === 'identifier') {
                var1.setType('let')
            }
            const [declarator, j] = parseVariables(tokens, i, scope) // ye function keyword k baad ki value evaluate krke variable declarator return krta hai
            i = j
            variables.push(declarator.id.name)
            var1.pushDeclarators(declarator)
            if (
                targetScope instanceof Program &&
                scope.length > 1 &&
                !(scope[scope.length - 1] instanceof ArrayExpression) // agr taget scope main program hai And scope stack me 1 se zyada scopes hen means ksi function body me hen And jo current scope hai wo array nai hai
            ) {
                targetScope.insert(var1, targetScope.body.length - 1) // ...to variable ko push krdia target scope se just left me ( file me just upar ) (global scope)
            } else {
                targetScope.push(var1) // agr global variable nai to just current scope me add
            }
            i++
        }
        if (tokens[i]?.type === "keyword" && tokens[i]?.value === "until") {
            i = parseUntilLoop(tokens, i, scope[scope.length - 1], scope);
            i++;
        }
        if (tokens[i]?.type === 'keyword' && tokens[i]?.value === 'fun') {
            i = parseFunction(tokens, i, scope[scope.length - 1], scope)
            i++
        }
        if (tokens[i]?.type === 'keyword' && tokens[i]?.value === 'if') {
            i = parseIfStatements(tokens, i, scope[scope.length - 1], scope, false, false)
            i++
        }
        if (tokens[i]?.type === 'keyword' && tokens[i]?.value === 'elf') {
            i = parseIfStatements(tokens, i, scope[scope.length - 1], scope, true, false)
            i++
        }
        if (tokens[i]?.type === 'keyword' && tokens[i]?.value === 'else') {
            i = parseIfStatements(tokens, i, scope[scope.length - 1], scope, false, true)
            i++
        }
        if (tokens[i]?.type === 'keyword' && tokens[i]?.value === 'display') {
            i++
            if (tokens[i]?.type !== 'opening_paran' && tokens[i]?.value !== '(') {
                throw new Error('Expected arguments after display statement. ')
            }

            let tempTokens = [
                { type: 'identifier', value: 'console' },
                { type: 'dot_operator', value: '.' },
                { type: 'identifier', value: 'log' },
                { type: 'openeing_parenthesis', value: '(' },
            ]
            let paranCount = 1
            i++
            while (tokens[i].value !== ')' && paranCount !== 0) {
                if (tokens[i].value === ')') {
                    paranCount--
                } else if (tokens[i].value === '(') {
                    paranCount++
                } else if (tokens[i].value === ',') {
                    i++
                }
                tempTokens.push(tokens[i])
                i++
            }
            tempTokens.push(tokens[i])
            i++
            scope[scope.length - 1].push(parseLogicalExpression(tempTokens))
        }
        if (tokens[i]?.type === 'keyword' && tokens[i]?.value === 'return') {
            const returnStat = new ReturnStatement()
            scope[scope.length - 1].push(returnStat)
            i++
            if (tokens[i].value === '}') {
                // void statements
                returnStat.setArgument(null)
            }
            //            if (
            //                (tokens[i].type === 'identifier' ||
            //                    (tokens[i].type === 'keyword' && (tokens[i].value === 'global' || tokens[i].value === 'const'))) &&
            //                !variables.includes(tokens[i].value) &&
            //                !scope[scope.length - 1].params?.includes(tokens[i]?.value)
            //            ) {
            //                throw new Error('Can not declare variable in return Statement! ')
            //            }
            // For assignment expression in return statements
            if (tokens[i].type === 'identifier' && variables.includes(tokens[i].value) && tokens[i + 1].value === '=') {
                i = parseAssignmentExpressions(tokens, i, scope, 'setArgument', returnStat)
            }
            // for expression statements in return statements
            if (tokens[i].type === 'Number' || tokens[i].type === 'string' || tokens[i].type === 'identifier') {
                let expTokens = []
                while (true) {
                    if (
                        ((expTokens[expTokens.length - 1]?.type === 'identifier' ||
                            expTokens[expTokens.length - 1]?.type === 'string' ||
                            expTokens[expTokens.length - 1]?.type === 'Number') &&
                            (tokens[i]?.type === 'identifier' ||
                                tokens[i]?.type === 'string' ||
                                tokens[i]?.type === 'Number' ||
                                keywords?.includes(tokens[i]?.value))) ||
                        tokens.length <= i ||
                        tokens[i].value === '}'
                    ) {
                        break
                    }
                    expTokens.push(tokens[i])
                    i++
                }

                if (expTokens.length === 1) {
                    returnStat.setArgument(getNode(expTokens[0]))
                } else {
                    returnStat.setArgument(parseLogicalExpression(expTokens))
                }
            }
            
            if (tokens[i]?.type === 'keyword' && tokens[i]?.value === 'fun') {
                i = parseFunction(tokens, i, returnStat, scope, true, 'setArgument')
                i++
            }
            if (tokens[i].value === '[') {
                // agr nested array ho to ...
                let arr = new ArrayExpression()
                returnStat.setArgument(arr) // array ko current scope me add kia
                scope.push(arr) // array ko current scope bnaya so that next sare elements ushi array me add hon
                i++
            }
        }

        if (tokens[i]?.value === 'for') {
            i = parseForLoop(tokens, i ,scope)
        }

        if (tokens[i]?.value === '}' && tokens[i]?.type === 'closing_blockscope') {
            scope.pop() // block statement khatam hoti hai to just scope se current scope pop krdo
            i++
        }
        if (tokens[i]?.value === ']' && tokens[i]?.type === 'closing_squarly') {
            scope.pop() // same for arrays
            i++
        }
    }
    return ast
}

const generatedTokens = tokenize(code)
console.log(generatedTokens)
let ast1 = generateAst(generatedTokens)
console.log(JSON.stringify(ast1.body, null, 2))
//fs.writeFile('E:/HTML/GoatLangTreeReact/GoatLangTree/src/tree.json', JSON.stringify(ast1), (err) => {
//    if (err) {
//        console.error(err)
//    }
//})

console.log('Input')
console.log(code)
console.log('\n')
console.log('Output')
console.log(generate.default(ast1).code)
