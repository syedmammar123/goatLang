import {
    ArrayExpression,
    VariableDeclarator,
    Identifier,
} from './Classes.js'
import { parseLogicalExpression } from './BinaryExpressionParsing.js'
import { getNode } from '../helpers/getNode.js'
import { keywords } from '../environment/environment.js'
import { parseObject } from './object.js'

export function parseVariables(tokens, i, scope) {
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
    } else if (tokens[i].value === '{' || tokens[i].type === 'objectStart') {
        let tempTokens = [
            { type: 'identifier', value: 'temp' },
            { type: 'equals', value: '=' },
        ]
        tempTokens.push(tokens[i])
        i++
        let objCount = 1
        while (objCount !== 0) {
            console.log(tokens[i])
            if (tokens[i]?.value === '{' && tokens[i].type === 'objectStart') {
                objCount++
            } else if (tokens[i]?.value === '}' && tokens[i].type === 'objectEnd') {
                objCount--
            }
            tempTokens.push(tokens[i])
            i++
        }
        declarator1.setInit(parseObject(tempTokens))
        i--
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
                tokens.length <= i ||
                tokens[i].value === '}'
            ) {
                break
            }
            expTokens.push(tokens[i])
            i++
        }
    console.log(expTokens,"exppppppppp")
        if (expTokens.length === 1) {
            declarator1.setInit(getNode(expTokens[0]))
        } else {
            declarator1.setInit(parseLogicalExpression(expTokens))
        }
        i--
    console.log(tokens[i])
    }

    return [declarator1, i]
}
