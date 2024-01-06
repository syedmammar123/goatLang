import { StringLiteral, NumericLiteral, Identifier, BooleanLiteral } from '../Parsing/Classes.js'

export function getNode(token) {
    if (!token) {
        return
    }
    switch (token.type) {
        case 'identifier':
            return new Identifier(token.value)
        case 'string':
            return new StringLiteral(token.value)
        case 'Number':
            return new NumericLiteral(token.value)
        case 'boolean':
            return new BooleanLiteral(token.value)
    }
}
