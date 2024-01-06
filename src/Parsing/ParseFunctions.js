import {
    BlockStatement,
    FunctionDeclaration,
    Identifier,
} from './Classes.js'


export function parseFunction(tokens, i, destScope, scope, isAssigned, setter) {
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
        console.log(fun.params)

    i++
    if (tokens[i].type === 'openening_blockscope' && tokens[i].value === '{') {
        let blockStatement = new BlockStatement()
        blockStatement.params = fun.params.map((param) => param?.name ?? param.name)
        fun.setScope(blockStatement)
        scope.push(blockStatement) // ye is function ka apna scope hai
    }
    return i
}
