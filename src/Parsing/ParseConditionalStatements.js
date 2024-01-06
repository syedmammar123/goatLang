import {
    IfStatement,
    BlockStatement,
} from './Classes.js'
import { parseLogicalExpression } from './BinaryExpressionParsing.js'


function getCurrentIf(parentIf) {
    if (!parentIf?.alternate) {
        return parentIf
    }

    return getCurrentIf(parentIf.alternate)
}

export function parseIfStatements(tokens, i, currScope, scope, elf, isElse) {
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
