import generate from "@babel/generator";

// const i=1
// until(i>4){
// 	display(i)
//   	i++
// }

class Program {
    constructor(){
        this.type="Program";
        this.body=[];
    }
    push(smth){
        this.body.push(smth);
    }
}

class VariableDeclaration{
    constructor(kind){
        this.type="VariableDeclaration";
        this.declarations=[];
        this.kind=kind;
    }
    pushDeclarators(declarator){
        this.declarations.push(declarator);
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
        this.id = id;
    }
    setInit(init){
        this.init = init;
    }
}

class Identifier {
    constructor(name){
        this.type="Identifier";
        this.name=name;
    }
}

class StringLiteral {
    constructor(val){
        this.type="StringLiteral";
        this.value=val;
    }
}

class NumericLiteral{
    constructor(val){
        this.type="NumericLiteral";
        this.value=val;
    }
}

class WhileStatement{
    constructor(){
        this.type="WhileStatement";
        this.test={};
        this.body={};
    }
    setTest(tst){
        this.test = tst;
    }
    setBody(bd){
        this.body = bd;
    }


}

class BinaryExpression{
     constructor(){
        this.type="BinaryExpression";
        this.left=null;
        this.right=null;
        this.operator=null;
    }
    setLeft(l){
        this.left=l;
    }
    setRight(r){
        this.right=r;
    }
    setOpr(opr){
        this.operator=opr
    }
}

class BlockStatement{
    constructor(){
        this.type="BlockStatement";
        this.body = [];
    }
    push(smth){
        this.body.push(smth)
    }
}
class ExpressionStatement{
    constructor(){
        this.type="ExpressionStatement";
        this.expression = null;
    }
    setExpression(exp){
        this.expression = exp;
    }
}

class CallExpression{
    constructor(){
        this.type="CallExpression";
        this.callee=null;
        this.arguments=[];
    }
    setCallee(cal){
        this.callee = cal;
    }
    pushArg(smth){
        this.arguments.push(smth)
    }
}

class MemberExpression{
    constructor(){
        this.type="MemberExpression";
        this.object;
        this.property;
    }
    setObj(obj){
        this.object = obj
    }
    setProperty(prop){
        this.property = prop
    }
}

class UpdateExpression{
    constructor(){
        this.type="UpdateExpression";
        this.operator=null;
        this.prefix=null;
        this.argument=null;
    }
    setOpr(opr){
        this.operator = opr
    }
    setPrefix(pre){
        this.prefix=false;
    }
    setArg(arg){
        this.argument=arg;
    }
}

let tokens = [
  { type: 'declarative_keyword', value: 'global' },
  { type: 'identifier', value: 'i' },
  { type: 'assignment_operator', value: '=' },
  { type: 'number', value: '1' },
  { type: 'loop_keyword', value: 'until' },
  { type: 'opening_parenthesis', value: '(' },
  { type: 'identifier', value: 'i' },
  { type: 'less_than', value: '<' },
  { type: 'number', value: '4' },
  { type: 'closing_parenthesis', value: ')' },
  { type: 'opening_brace', value: '{' },
  { type: 'keyword', value: 'display' },
  { type: 'opening_parenthesis', value: '(' },
  { type: 'identifier', value: 'i' },
  { type: 'closing_parenthesis', value: ')' },
  { type: 'identifier', value: 'i' },
  { type: 'unary_operator', value: '++' },
  { type: 'closing_brace', value: '}' },
];



export const generateAst = (tokens) => {
    let i = 0;
    let ast = new Program()
    while (i < tokens.length){
        if(tokens[i].value === "global"){
            let var1 = new VariableDeclaration();
            i++;
            if(tokens[i].value === "const"){
                var1.setType("const");
                
            }else{
                var1.setType("var");
            }
            let declarator1 = new VariableDeclarator();
            // i++;
            let id1 = new Identifier(tokens[i].value)
            declarator1.setId(id1)
            i++;
            if (tokens[i].value !== "="){
                throw new Error("expected =")
            }
            i++;
            let init;
            if (tokens[i].type === "number"){
                init = new NumericLiteral(tokens[i].value)
                declarator1.setInit(init)
            } 
            var1.pushDeclarators(declarator1);
            ast.push(var1)


        }
        i++
            


        if(tokens[i].type === "loop_keyword"){
            
            let var2 = new WhileStatement();
            i++;

            if(tokens[i].value !== "("){
                throw new Error("expected (")
            }
            i++
            let test = new BinaryExpression();
            let iden1;
            if(tokens[i].type === "identifier"){
                iden1 = new Identifier(tokens[i].value)
                test.setLeft(iden1);
            }
            i++

            if(tokens[i].type === "less_than"){
                test.setOpr(tokens[i].value)
            }
            i++

            let iden2 = new NumericLiteral(tokens[i].value)

            test.setRight(iden2)


            i++;

            if(tokens[i].value !== ")"){
                throw new Error("expected )")
            }

            i++;

            if(tokens[i].value !== "{"){
                throw new Error("expected {")
            }
            i++
            let whileBody = new BlockStatement();

            if(tokens[i].type !== "keyword"){
                throw new Error("expected display")
            }
            
            let exp1 = new ExpressionStatement()

            let callExp = new CallExpression()

            // let iden3 = new Identifier(tokens[i].value)
            let iden3 = new Identifier("console.log")
            callExp.setCallee(iden3)

            i++
            if(tokens[i].value !== "("){
                throw new Error("expected (")
            }
            i++

            let iden4 = new Identifier(tokens[i].value)
            callExp.pushArg(iden4)

            i++

            if(tokens[i].value !== ")"){
                throw new Error("expected )")
            }

            i++
            exp1.setExpression(callExp)          


            let exp2 = new ExpressionStatement()

            let upExp = new UpdateExpression()

            // if(tokens[i].type !== "unary_operator"){
            //     upExp.setPrefix(false)
            // }

            if(tokens[i].type === "identifier"){
                 let iden5 = new Identifier(tokens[i].value)
                upExp.setArg(iden5)
            }
            i++
            
            if(tokens[i].type === "unary_operator"){
                upExp.setOpr(tokens[i].value)
            }
            i++
            exp2.setExpression(upExp)

            if(tokens[i].value !== "}"){
                throw new Error("expected }")
            }
            whileBody.push(exp1)
            whileBody.push(exp2)

            var2.setTest(test)
          
            var2.setBody(whileBody)

            ast.push(var2)
            // console.log(ast.body[1])
        }

        i++;

    }
    return ast;
}


let ast2 = 
{
    type: 'CallExpression',
        name: 'add',
        arguments: [
            { type: 'NumericLiteral', value: 2 },
            { type: 'NumericLiteral', value: 3 },
        ],
        callee: { type: 'Identifier', name: 'add' }
}

let ast1 = generateAst(tokens)
// console.log(ast1)


// console.log("Input")
// console.log("global const a = 'hello world'")
// console.log("\n")

// console.log("Output")
console.log(generate.default(ast1).code)


