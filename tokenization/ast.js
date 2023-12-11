import generate from "@babel/generator";


class Program {
    constructor(){
        this.type="Program"
        this.body=[]
    }
    push(smth){
        this.body.push(smth)
    }
}

class VariableDeclaration{
    constructor(kind){
        this.type="VariableDeclaration"
        this.declarations=[]
        this.kind=kind
    }
    pushDeclarators(declarator){
        this.declarations.push(declarator)
    }
    setType(type){
        this.kind = type;
    }
}

class VariableDeclarator{
    constructor(){
        this.type="VariableDeclarator";
        this.id=null;
        this.init=null;
    }
    setId(id){
        this.id = id
    }
    setInit(init){
        this.init = init
    }
}

class StringLiteral {
    constructor(val){
        this.type="StringLiteral",
        this.value=val
    }
}

class Identifier {
    constructor(name){
        this.type="Identifier",
        this.name=name
    }
}

class NumericLiteral {
    constructor(value) {
        this.type = 'NumericLiteral';
        this.value = value;
    }
}

class BinaryExpression {
    constructor(operator, left, right) {
        this.type = 'BinaryExpression';
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

class ForLoopStepBinaryExpression {
    static stepParse(l , r , o){
        let left;
        let right;
        let operator;
        if(l != ''){
            left = l;
        }
        right = r;
        operator=o;

        return new BinaryExpression(operator, left, right);
    }
   
}


class BinaryExpressionParser {
    static parse(tokens, i , op , forloopId , forloopStep) {
        let right;
        let operator;

        if (tokens[i].type === 'OPENPAREN') {
            i++;
            right = BinaryExpressionParser.parse(tokens, i);
            i++;
        } else if (tokens[i].type === 'NUMBER' && forloopStep =='' || tokens[i].type === 'IDENTIFIER') {
            right = tokens[i].type === 'NUMBER' ? new NumericLiteral(tokens[i].value) : new Identifier(tokens[i].value);
            i++;
        }
        else if (tokens[i].type === 'NUMBER' && forloopStep != '')
        {
            right = ForLoopStepBinaryExpression.stepParse(forloopId, tokens[i].value, forloopStep);
        }


        if (tokens[i].type === 'OPERATOR') {
            operator = tokens[i].value;
            i++;
        }else if(op!='' ){
            operator= op;
        

        }
         else {
            throw new Error('Expected an operator in the binary expression.');
        }

        let left;


        if (tokens[i].type === 'OPENPAREN') {
            i++;
            left = BinaryExpressionParser.parse(tokens, i);
            i++;
        } else if (tokens[i].type === 'NUMBER' && forloopStep=='' || tokens[i].type === 'IDENTIFIER' ) {
            left = tokens[i].type === 'NUMBER' ? new NumericLiteral(tokens[i].value) : new Identifier(tokens[i].value);
            i++;
            
        }
       
        else if ( (tokens[i].value === "by" && forloopId!='') || (tokens[i].type === 'NUMBER' && forloopStep!='')){
            left=forloopId;
          
        }
         else {
            throw new Error('Unexpected token in expression.');
        }

        return new BinaryExpression(operator, left, right);
    }
}

class ForLoop {
    constructor() {
        this.type = 'ForLoop';
        this.init = null;
        this.condition = null;
        this.update = null;
        this.body = null;
    }

    setInit(init) {
        this.init = init;
    }

    setCondition(condition) {
        this.condition = condition;
    }

    setUpdate(update) {
        this.update = update;
    }

    setBody(body) {
        this.body = body;
    }
}

let tokens = [
    { type: 'KEYWORD', value: 'for' },    
    { type: 'IDENTIFIER', value: 'i' },   
    { type: 'KEYWORD', value: 'from' },   
    { type: 'NUMBER', value: 10 },
    { type: 'KEYWORD', value: 'to' },     
    { type: 'NUMBER', value: 1 },        
    { type: 'KEYWORD', value: 'by' },     
    { type: 'NUMBER', value: -2 },
    { type: 'DELIMITER', value: '<' },    
    { type: 'KEYWORD', value: 'display' },
    { type: 'OPENPAREN', value: '(' },
    { type: 'IDENTIFIER', value: 'i' },
    { type: 'CLOSEPAREN', value: ')' },
    { type: 'SEMICOLN', value: ';' },
    { type: 'DELIMITER', value: '>' }
  ]


  export const generateAst = (tokens) => {
    let i = 0;
    let ast = new Program();

    while (i < tokens.length) {
        if (tokens[i].value === 'for') {
            let forLoop = new ForLoop();
            i++;

            // Parse initialization with binary expression support
            if (tokens[i].type === 'IDENTIFIER') {
                let init = new VariableDeclaration('let');
                let declarator = new VariableDeclarator();
           
                let id = new Identifier(tokens[i].value);
                declarator.setId(id);
                let val;
                if(tokens[i+1].value != 'from'){
                    throw new Error('expected "from" after loop initialization.');
                }
                else{
                    if(tokens[i+2].type == 'NUMBER')
                    {
                         val = tokens[i+2].value;
                    }
                    else{
                        throw new Error('expected a number after "from"')
                    }
                }
                declarator.setInit(val);
                init.pushDeclarators(declarator);
                forLoop.setInit(init);
                console.log(forLoop.init , "forloop init...");
                console.log("\n\n\n");

            } else {
                throw new Error('Expected an identifier for loop initialization.');
            }

            i++;
            if (tokens[i].value !== 'from') {
                throw new Error('Expected "from" after loop initialization.');
            }

            i=i+2;
           
            if (tokens[i].value !== 'to') {
                throw new Error('Expected "to" after loop initialization value.');
            }

            // Parse condition with binary expression support
            i++;
         
           let cond = checkCond(forLoop.init.declarations[0].init , tokens[i].value);
           let _oper = cond?'<':'>';
            let conditionValue = BinaryExpressionParser.parse(tokens, i , _oper , forLoop.init.declarations[0].id ,'');
            forLoop.setCondition(conditionValue);
            console.log(forLoop.condition , "forloop condition...");
            console.log("\n\n\n");

            i++;
            if (tokens[i].value !== 'by') {
                throw new Error('Expected "by" after loop condition.');
            }

            // Parse update with binary expression support
            i++;
    
            let step= checkStep(tokens[i].value);
            let updateValue = BinaryExpressionParser.parse(tokens, i , '=' , forLoop.init.declarations[0].id , step );
            forLoop.setUpdate(updateValue);
            console.log(forLoop.update , "forloop update...");
            console.log("\n\n\n");
          

            i++;
            if (tokens[i].type === 'DELIMITER' && tokens[i].value === '<') {
                i++;
                let body = new Program();
                while (!(tokens[i].type === 'DELIMITER' && tokens[i].value === '>')) {
                    let statement = generateStatement(tokens, i);
                    body.push(statement);
                    i++;  // Move to the next token
                }
                forLoop.setBody(body);
                console.log(forLoop.body , "forloop body...");
                console.log("\n\n\n");
            } else {
                throw new Error('Expected "<" to start the loop body.');
            }

            ast.push(forLoop);
        }

        i++;
    }

    return ast;
};

function checkCond(startval , endval)
{
    return (startval<endval);
}
function checkStep(_step){
    if(_step>0)
    {
        return '+';
    }
    else{
        return '-';
    }
}

function generateStatement(tokens, i) {
    const statement = [];

    // Assuming your statements are of the form '<KEYWORD> ( ... ) ;'
    // Modify this part according to your language's syntax
    while (!(tokens[i].type === 'DELIMITER' && tokens[i].value === '>')) {
        statement.push(tokens[i]);
        i++;  // Move to the next token
    }

    return statement;
}


// let ast2 = 
// {
//     type: 'CallExpression',
//         name: 'add',
//         arguments: [
//             { type: 'NumericLiteral', value: 2 },
//             { type: 'NumericLiteral', value: 3 },
//         ],
//         callee: { type: 'Identifier', name: 'add' }
// }

let ast1 = generateAst(tokens);
console.log(ast1);

// console.log("\n\n\n")
// console.log("Input")
// console.log("global const a = 'hello world'")
// console.log("\n\n\n")
// console.log("Output")
console.log(generate.default(ast1).code)
console.log("\n\n\n")



