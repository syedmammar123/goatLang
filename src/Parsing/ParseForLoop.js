import { AssignmentExpression, Identifier, ForStatement, BinaryExpParserForLoop, BlockStatement } from './Classes.js'
import { getNode } from '../helpers/getNode.js'

export function parseForLoop(tokens, i, scope) {
    let forStatement = new ForStatement()
    scope[scope.length - 1].push(forStatement)
    i++

    if (tokens[i]?.type === 'identifier') {
        let init = new AssignmentExpression()
        let left = new Identifier(tokens[i]?.value)
        let right

        i++ // Move to the next token

        if (tokens[i]?.value !== 'from') {
            throw new Error('Expected "from" after loop initialization.')
        }

        i++ // Move to the numeric value
        if (tokens[i]?.type === 'Number') {
            right = getNode(tokens[i])
            i++
        } else {
            throw new Error('Expected a number after from keyword')
        }

        init.setLeft(left)
        init.setRight(right)
        forStatement.setInit(init)
    } else {
        throw new Error('Expected an identifier for loop initialization.')
    }

    // Parse condition with binary expression support

    if (tokens[i]?.value !== 'to') {
        throw new Error('Expected "to" after loop initialization value.')
    } else {
        i++
        let cond = checkCond(forStatement.init.right.value, tokens[i]?.value)
        let _oper = cond ? '<' : '>'
        let conditionValue = BinaryExpParserForLoop.parse(tokens, i, _oper, forStatement.init.left, '')
        forStatement.setTest(conditionValue)
        i++
    }

    if (tokens[i]?.value !== 'by') {
        throw new Error('Expected "by" after loop condition.')
    }

    // Parse update with binary expression support
    i++
    let updateValue
    if (tokens[i]?.type == 'operator') {
        updateValue = BinaryExpParserForLoop.parse(tokens, i + 1, '=', forStatement.init.left, tokens[i].value)
        i++
    } else if (tokens[i]?.type == 'Number') {
        let step = checkStep(tokens[i]?.value, forStatement.init.right.value, forStatement.test.right.value)

        updateValue = BinaryExpParserForLoop.parse(tokens, i, '=', forStatement.init.left, step)
    }

    forStatement.setUpdate(updateValue)

    i++
    if (tokens[i]?.type === 'openening_blockscope' && tokens[i]?.value === '{') {
        i++
        let body = new BlockStatement()
        forStatement.setBody(body)
        scope.push(body)
    } else {
        throw new Error('Expected "{" to start the loop body.')
    }

    return i
}

function checkCond(startval, endval) {
    return startval < endval
}
function checkStep(_step, start, end) {
    if (_step > 0) {
        if (start < end) {
            return '+'
        } else {
            throw new Error('Starting value must be less than End value')
        }
    } else if (_step < 0) {
        if (start > end) {
            return '-'
        } else {
            throw new Error('Starting value must be greater than End value')
        }
    }
}
