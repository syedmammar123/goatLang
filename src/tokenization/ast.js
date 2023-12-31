import generate from '@babel/generator'
import fs from 'fs'
import {
    AssignmentExpression,
    ReturnStatement,
    IfStatement,
    ArrayExpression,
    BlockStatement,
    FunctionDeclaration,
    Program,
    VariableDeclaration,
    VariableDeclarator,
    Identifier,
    ExpressionStatement,
} from './Classes.js'
import { tokenize } from './tokenize.js'
import { parseLogicalExpression } from './BinaryExpressionParsing.js'
import { getNode } from '../helpers/getNode.js'
import { keywords } from '../environment/environment.js'

const code = fs.readFileSync('./code', { encoding: 'utf8' })

function parseVariables(tokens, i, scope) {
    let declarator1 = new VariableDeclarator()
    let id1 = new Identifier(tokens[i].value)
    declarator1.setId(id1)
    i++
    if (tokens[i]?.value !== '=') {
        throw new Error('expected =')
    }
    i++
    let init
    if (tokens[i].value === '[') {
        init = new ArrayExpression()
        scope.push(init)
        declarator1.setInit(init)
    }
    //    else if (tokens[i]?.type === 'string') {
    //        init = new StringLiteral(tokens[i].value)
    //    declarator1.setInit(init)
    //    } else if (tokens[i]?.type === 'Number') {
    //        init = new NumericLiteral(tokens[i].value)
    //    declarator1.setInit(init)
    //    }
    else if (tokens[i]?.type === 'keyword' && tokens[i]?.value === 'fun') {
        i = parseFunction(tokens, i, declarator1, scope, true, 'setInit')
        i++
    } else {
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
                tokens.length <= i
            ) {
                break
            }
            expTokens.push(tokens[i])
            i++
        }
        if (expTokens.length === 1) {
            declarator1.setInit(getNode(expTokens[0]))
        } else {
            declarator1.setInit(parseLogicalExpression(expTokens))
        }
        i--
    }

    return [declarator1, i]
}

function parseFunction(tokens, i, destScope, scope, isAssigned, setter) {
    const fun = new FunctionDeclaration()
    if (isAssigned) {
        destScope[setter](fun)
    } else {
        destScope.push(fun) // ye wo scope hai jahan function declare hoga
    }
    i++
    const id = new Identifier(tokens[i].value)
    fun.setId(id)
    i++
    if (tokens[i].value !== '(') {
        throw new Error('( expected')
    }
    i++
    let paramCount = 0
    while (tokens[i].value !== ')') {
        if (tokens[i].type === 'identifier') {
            fun.pushParams(new Identifier(tokens[i].value))
        }
        if (paramCount > 1000000) {
            throw new Error(') missing!')
        }
        i++
        paramCount++
    }

    i++
    if (tokens[i].type === 'openening_blockscope' && tokens[i].value === '{') {
        let blockStatement = new BlockStatement()
        blockStatement.params = fun.params.map((param) => param?.name ?? param.name)
        fun.setScope(blockStatement)
        scope.push(blockStatement) // ye is function ka apna scope hai
    }
    return i
}

function getCurrentIf(parentIf) {
    if (!parentIf?.alternate) {
        return parentIf
    }

    return getCurrentIf(parentIf.alternate)
}

function parseIfStatements(tokens, i, currScope, scope, elf, isElse) {
    if (isElse) {
        i++
        let blockStatement = new BlockStatement()
        let currIf = getCurrentIf(currScope.body[currScope.body.length - 1])
        currIf.setAlternate(blockStatement)
        scope.push(currIf.alternate)
        return i
    }
    let ifStat = new IfStatement()
    if (elf) {
        let currIf = getCurrentIf(currScope.body[currScope.body.length - 1])
        currIf.setAlternate(ifStat)
    } else {
        currScope.push(ifStat) // ye wo scope hai jahan if declare hoga
    }
    i++
    if (tokens[i]?.value !== '(') {
        throw new Error('Expected (')
    }
    i++
    let testTokens = []
    while (tokens[i].value !== '{') {
        testTokens.push(tokens[i])
        i++
    }
    testTokens.pop()
    ifStat.setTest(parseLogicalExpression(testTokens))

    if (tokens[i].type === 'openening_blockscope' && tokens[i].value === '{') {
        let blockStatement = new BlockStatement()
        ifStat.setConsequent(blockStatement)
        scope.push(ifStat.consequent) // ye is if ka apna scope hai
    }
    return i
}

function parseAssignmentExpressions(tokens, i, scope, setter, parent) {
    const assignmentExp = new AssignmentExpression()
    parent[setter](assignmentExp)
    assignmentExp.setLeft(getNode(tokens[i]))
    i++
    if (tokens[i]?.value !== '=') {
        throw new Error('= exprected.')
    }
    i++
    if (tokens[i].value === '[') {
        // agr assigned value array ho to
        let arr = new ArrayExpression()
        assignmentExp.setRight(arr) // array ko current scope me add kia
        scope.push(arr) // array ko current scope bnaya so that next sare elements ushi array me add hon
        i++
    } else if (tokens[i]?.type === 'keyword' && tokens[i]?.value === 'fun') {
        i = parseFunction(tokens, i, assignmentExp, scope, true, 'setRight')
        i++
    } else {
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
                tokens.length <= i
            ) {
                break
            }
            expTokens.push(tokens[i])
            i++
        }
        if (expTokens.length === 1) {
            assignmentExp.setRight(getNode(expTokens[0]))
        } else {
            assignmentExp.setRight(parseLogicalExpression(expTokens))
        }
    }

    return i
}

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
                tokens[i].type === 'Number' ||
                tokens[i].type === 'string') &&
                tokens[i + 1].value !== '=') ||
            tokens[i + 1].value === '('
        ) {
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
                !(tokens[i + 1].value === '('))
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
console.log(ast1)

fs.writeFile('E:/HTML/GoatLangTreeReact/GoatLangTree/src/tree.json', JSON.stringify(ast1), err => {
  if (err) {
    console.error(err);
  }
})

console.log('\n\n\n')
console.log('Input')
console.log(code)
console.log('\n')
console.log('Output')
console.log(generate.default(ast1).code)
console.log('\n\n\n')

//fun print(name,date){
//     a = 'Hello world'
//     fun hello(dob){
//        global const b = 329
//        global const v = 329
//        c = 999
//     }
//}
