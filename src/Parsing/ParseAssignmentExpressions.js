import { AssignmentExpression, ArrayExpression } from './Classes.js'
import { parseLogicalExpression } from './BinaryExpressionParsing.js'
import { getNode } from '../helpers/getNode.js'
import { keywords } from '../environment/environment.js'

export function parseAssignmentExpressions(tokens, i, scope, setter, parent) {
    const assignmentExp = new AssignmentExpression()
    parent[setter](assignmentExp)
    let leftSide = []
    while (tokens[i]?.value !== "="){
        leftSide.push(tokens[i])
        i++
    }
    console.log(leftSide,"leftside")
    assignmentExp.setLeft(parseLogicalExpression(leftSide))
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
                    expTokens[expTokens.length - 1]?.type === 'closing_parenthesis' ||
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
            assignmentExp.setRight(getNode(expTokens[0]))
        } else {
            assignmentExp.setRight(parseLogicalExpression(expTokens))
        }
    }

    return i
}
