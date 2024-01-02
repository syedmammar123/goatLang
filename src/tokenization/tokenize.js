import { isValidName, isBoolean } from '../helpers/token-checks.js'
import { keywords } from '../environment/environment.js'
import fs from 'fs'

//const code = fs.readFileSync('./code', { encoding: 'utf8' })

export function tokenize(code) {
    let i = 0
    let tokens = []
    let char = ''

    while (i < code.length) {
        if (code[i] === '\r' || code[i] === '\n') {
            i++
        }
        while (/^[a-zA-Z0-9_$@#]$/.test(code[i])) {
            char = char + code[i]
            i++
        }
        while (code[i] === ' ') {
            i++
        }
        if (keywords.includes(char)) {
            tokens.push({
                type: 'keyword',
                value: char,
            })
            char = ''
        } else if (isBoolean(char)) {
            tokens.push({
                type: 'boolean',
                value: char,
            })
            char = ''
        } else if (code[i] !== '=' && char !== '' && !keywords.includes(char)) {
            tokens.push({
                type: 'identifier',
                value: char,
            })
            char = ''
        }
        if (code[i] === ',') {
            tokens.push({
                type: 'comma',
                value: ',',
            })
            i++
        }
        if (code[i] === ']') {
            tokens.push({
                type: 'closing_squarly',
                value: ']',
            })
            i++
        }
        if (code[i] === '[') {
            tokens.push({
                type: 'openening_squarly',
                value: '[',
            })
            i++
        }
        if (code[i] === '-') {
            let temp = ''

            while (code[i] === '-') {
                temp = temp + code[i]
                i++
            }

            if (temp.length === 1) {
                tokens.push({
                    type: 'operator',
                    value: '-',
                })
            }
            if (temp.length === 2) {
                tokens.push({
                    type: 'operator',
                    value: '--',
                })
            }
            if (temp.length > 2) {
                throw new Error('Invalid Operator')
            }
        }
        if (code[i] === '+') {
            let temp = ''

            while (code[i] === '+') {
                temp = temp + code[i]
                i++
            }

            if (temp.length === 1) {
                tokens.push({
                    type: 'operator',
                    value: '+',
                })
            }
            if (temp.length === 2) {
                tokens.push({
                    type: 'operator',
                    value: '++',
                })
            }
            if (temp.length > 2) {
                throw new Error('Invalid Operator')
            }
        }
        if (code[i] === ';') {
            tokens.push({
                type: 'semicolon',
                value: ';',
            })
            i++
        }
        if (code[i] === '.') {
            tokens.push({
                type: 'dot_operator',
                value: '.',
            })
            i++
        }
        if (code[i] === '/') {
            tokens.push({
                type: 'operator',
                value: '/',
            })
            i++
        }
        if (code[i] === '*') {
            tokens.push({
                type: 'operator',
                value: '*',
            })
            i++
        }
        if (code[i] === '<') {
            tokens.push({
                type: 'less_than',
                value: '<',
            })
            i++
        }
        if (code[i] === '>') {
            tokens.push({
                type: 'greater_than',
                value: '<',
            })
            i++
        }
        if (code[i] === '{') {
            tokens.push({
                type: 'openening_blockscope',
                value: '{',
            })
            i++
        }
        if (code[i] === '}') {
            tokens.push({
                type: 'closing_blockscope',
                value: '}',
            })
            i++
        }
        if (code[i] === '(') {
            tokens.push({
                type: 'openeing_parenthesis',
                value: '(',
            })
            i++
        }
        if (code[i] === ')') {
            tokens.push({
                type: 'closing_parenthesis',
                value: ')',
            })
            i++
        }

        if (code[i] === '|') {
            let temp = code[i]
            i++
            if (code[i] === '|') {
                temp = temp + '|'
                i++
            }
            if (temp.length === 1) {
                tokens.push({
                    type: 'unary_operator',
                    value: temp,
                })
            }
            if (temp.length === 2) {
                tokens.push({
                    type: 'logical_operator',
                    value: temp,
                })
            }
            char = ''
            temp = ''
        }

        if (code[i] === '&') {
            let temp = code[i]
            i++
            if (code[i] === '&') {
                temp = temp + '&'
                i++
            }
            if (temp.length === 1) {
                tokens.push({
                    type: 'unary_operator',
                    value: temp,
                })
            }
            if (temp.length === 2) {
                tokens.push({
                    type: 'logical_operator',
                    value: temp,
                })
            }
            char = ''
            temp = ''
        }

        if (code[i] === '=') {
            let temp = ''
            while (code[i] === '=') {
                temp = temp + code[i]
                i++
            }
            if (temp.length === 1) {
                tokens.push({
                    type: 'identifier',
                    value: char,
                })
                tokens.push({
                    type: 'equality',
                    value: '=',
                })
            }
            if (temp.length === 2) {
                tokens.push({
                    type: 'identifier',
                    value: char,
                })
                tokens.push({
                    type: 'double_equality',
                    value: '==',
                })
            }
            if (temp.length === 3) {
                if (char) {
                    tokens.push({
                        type: 'identifier',
                        value: char,
                    })
                }
                tokens.push({
                    type: 'triple_equality',
                    value: '===',
                })
            }
            char = ''
            temp = ''
        }
        if (code[i] === "'" || code[i] === `"`) {
            let usedStringSymbol = code[i]
            i++
            while (code[i] !== usedStringSymbol) {
                char = char + code[i]
                i++
            }
            i++
            tokens.push({
                type: 'string',
                value: char,
            })
            char = ''
        }

        if (!isNaN(parseInt(code[i])) && char === '') {
            let decimalCount = 0
            let num = ''
            while (!isNaN(parseInt(code[i])) || code[i] === '.') {
                if (code[i] === '.') {
                    decimalCount++
                }
                if (decimalCount > 1) {
                    throw new Error('Invalid number')
                }
                num = num + code[i]
                i++
            }
            tokens.push({
                type: 'Number',
                value: parseInt(num),
            })
        }
    }
    return tokens
}

//console.log(tokenize(code))
