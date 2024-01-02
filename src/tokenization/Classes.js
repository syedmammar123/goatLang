function insertIntoArray(arr, idx, val) {
    if (idx > arr.length) {
        return
    }
    for (let i = arr.length; i >= idx; i--) {
        arr[i] = arr[i - 1]
    }
    arr[idx] = val
}

export class Program {
    constructor() {
        this.type = 'Program'
        this.body = []
    }
    push(smth) {
        this.body.push(smth)
    }
    unshift(smth) {
        this.body.unshift(smth)
    }
    insert(smth, idx) {
        insertIntoArray(this.body, idx, smth)
    }
}

export class VariableDeclaration {
    constructor(kind) {
        this.type = 'VariableDeclaration'
        this.declarations = []
        this.kind = kind
    }
    pushDeclarators(declarator) {
        this.declarations.push(declarator)
    }
    setType(type) {
        this.kind = type
    }
}

export class VariableDeclarator {
    constructor() {
        this.type = 'VariableDeclarator'
        this.id = null
        this.init = null
    }
    setId(id) {
        this.id = id
    }
    setInit(init) {
        this.init = init
    }
}

export class StringLiteral {
    constructor(val) {
        ;(this.type = 'StringLiteral'), (this.value = val)
    }
}
export class NumericLiteral {
    constructor(val) {
        ;(this.type = 'NumericLiteral'), (this.value = val)
    }
}

export class Identifier {
    constructor(name) {
        ;(this.type = 'Identifier'), (this.name = name)
    }
}

export class FunctionDeclaration {
    constructor() {
        this.type = 'FunctionDeclaration'
        this.id = null
        this.generator = false
        this.async = false
        this.params = []
        this.body = null
    }
    setScope(statement) {
        this.body = statement
    }
    pushParams(param) {
        this.params.push(param)
    }
    setId(id) {
        this.id = id
    }
}

export class BlockStatement {
    constructor() {
        this.type = 'BlockStatement'
        this.body = []
    }
    push(statement) {
        this.body.push(statement)
    }
}

export class ArrayExpression {
    constructor() {
        this.type = 'ArrayExpression'
        this.elements = []
    }
    push(smth) {
        this.elements.push(smth)
    }
}

export class IfStatement {
    constructor() {
        this.type = 'IfStatement'
        this.test = null
        this.consequent = null
        this.alternate = null
    }
    setTest(test) {
        this.test = test
    }
    setConsequent(consequent) {
        this.consequent = consequent
    }
    setAlternate(alternate) {
        this.alternate = alternate
    }
}
export class BinaryExpression {
    constructor(operator, left, right) {
        this.type = 'BinaryExpression'
        this.left = left ?? null
        this.operator = operator ?? null
        this.right = right ?? null
    }
    setLeft(left) {
        this.left = left
    }
    setRight(right) {
        this.right = right
    }
    setOperator(operator) {
        this.operator = operator
    }
}

export class LogicalExpression {
    constructor() {
        this.type = 'LogicalExpression'
        this.left = null
        this.operator = null
        this.right = null
    }
    setLeft(left) {
        this.left = left
    }
    setRight(right) {
        this.right = right
    }
    setOperator(operator) {
        this.operator = operator
    }
}

export class ExpressionStatement {
    constructor() {
        this.type = 'ExpressionStatement'
        this.expression = null
    }
    setExpression(exp) {
        this.expression = exp
    }
}

export class CallExpression {
    constructor() {
        this.type = 'CallExpression'
        this.callee = null
        this.arguments = []
    }
    setCallee(callee) {
        this.callee = callee
    }
    pushArg(smth) {
        this.arguments.push(smth)
    }
}

export class MemberExpression {
    constructor() {
        this.type = 'MemberExpression'
        this.object
        this.property
    }
    setObj(obj) {
        this.object = obj
    }
    setProperty(prop) {
        this.property = prop
    }
}

export class AssignmentExpression {
    constructor(left, right) {
        this.type = 'AssignmentExpression'
        this.operator = '='
        this.left = left ?? null
        this.right = right ?? null
    }
    setRight(smth) {
        this.right = smth
    }
    setLeft(smth) {
        this.left = smth
    }
}

export class ReturnStatement {
    constructor() {
        this.type = 'ReturnStatement'
        this.argument = null
    }
    setArgument(arg) {
        this.argument = arg
    }
}

export class BooleanLiteral {
    constructor(val) {
        this.type = 'BooleanLiteral'
        this.value = val
    }
}

export class ObjectExpression {
    constructor() {
        this.type = 'ObjectExpression'
        this.properties = []
    }
    push(smth) {
        this.properties.push(smth)
    }
}

export class ObjectProperty {
    constructor() {
        this.type = 'ObjectProperty'
        this.method = false
        this.computed = false
        this.shorthand = false
        this.key = null
        this.value = null
    }
    setKey(smth) {
        this.key = smth
    }
    setValue(smth) {
        this.value = smth
    }
}

export class ForLoopStepBinaryExpression {
    static stepParse(l, r, o) {
        let left
        let right
        let operator
        if (l != '') {
            left = l
        }
        right = r
        operator = o

        return new BinaryExpression(operator, left, right)
    }
}

export class BinaryExpParserForLoop {
    static parse(tokens, i, op, forloopId, forloopStep) {
        let right
        let operator
        let left
        if (tokens[i].type === 'openeing_parenthesis') {
            i++
            left = BinaryExpParserForLoop.parse(tokens, i)
            i++
        } else if ((tokens[i].type === 'Number' && forloopStep == '') || tokens[i].type === 'identifier') {
            left = tokens[i].type === 'Number' ? forloopId : new Identifier(tokens[i].value)
        } else if (
            (tokens[i].value === 'by' && forloopId != '') ||
            (tokens[i].type === 'Number' && forloopStep != '')
        ) {
            left = forloopId
        } else {
            throw new Error('Unexpected token in expression.')
        }

        if (tokens[i].type === 'openeing_parenthesis') {
            i++
            right = BinaryExpParserForLoop.parse(tokens, i)
            i++
        } else if ((tokens[i].type === 'Number' && forloopStep == '') || tokens[i].type === 'identifier') {
            right = tokens[i].type === 'Number' ? new NumericLiteral(tokens[i].value) : new Identifier(tokens[i].value)
            i++
        } else if (tokens[i].type === 'Number' && forloopStep != '') {
            if (tokens[i].value < 0) {
                tokens[i].value = Math.abs(tokens[i].value)
            }

            right = ForLoopStepBinaryExpression.stepParse(forloopId, new NumericLiteral(tokens[i].value), forloopStep)
        }
        operator = op

        return new BinaryExpression(operator, left, right)
    }
}

export class ForStatement {
    constructor() {
        this.type = 'ForStatement'
        this.init = null
        this.test = null
        this.update = null
        this.body = null
    }

    setInit(init) {
        this.init = init
    }

    setTest(test) {
        this.test = test
    }

    setUpdate(update) {
        this.update = update
    }

    setBody(body) {
        this.body = body
    }
}
