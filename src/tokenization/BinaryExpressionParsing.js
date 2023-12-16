const tokens = [
    {type: "Number" , value : "99"},
    {type: "operator" , value : "+"},
    {type: "opening_paran" , value : "("},
    {type: "identifier" , value : "num"},
    {type: "operator" , value : "-"},
    {type: "Number" , value : "3"},
    {type: "closing_paran" , value : ")"},
    {type: "operator" , value : "-"},
    {type: "opening_paran" , value : "("},
    {type: "Number" , value : "1"},
    {type: "operator" , value : "/"},
    {type: "opening_paran" , value : "("},
    {type: "Number" , value : "9"},
    {type: "operator" , value : "*"},
    {type: "Number" , value : "87"},
    {type: "closing_paran" , value : ")"},
    {type: "closing_paran" , value : ")"},
    {type: "operator" , value : "**"},
    {type: "Number" , value : "72"},
]

// 99 + (num - 3) - (1 / (9 * 87)) ** 72

let i = 0



function parseBinaryExpression (tokens){
    if (tokens.length === 1){
        return tokens.pop().value
    }
    let token = tokens.pop()
    let expression = []
    if (token.value === ')'){
        let paranCount = 0
        paranCount ++
        while (paranCount !== 0){
            token = tokens.pop()
            if (token.value ===  ')'){
                paranCount++
            }
            else if (token.value === '('){
                paranCount--
            }
            expression.unshift(token)
            
        }
        expression.shift()
    }
let exp = {
    type : "BinaryExpression",
    left:null,
    operator:null,
    right:null
}
    if (expression.length){
        exp.right = parseBinaryExpression(expression) 
        exp.operator = tokens.pop().value
        exp.left = parseBinaryExpression(tokens)
    }
    else{
        exp.right = token.value
        exp.operator = tokens.pop().value
        exp.left = parseBinaryExpression(tokens)

    }
    return exp
}

console.log(parseBinaryExpression(tokens).left)

