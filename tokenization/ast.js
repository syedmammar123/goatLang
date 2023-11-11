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

let tokens = [
  { type: 'declarative_keyword', value: 'global' },
  { type: 'declarative_keyword', value: 'const' },
  { type: 'identifier', value: 'a' },
  { type: 'assignment_operator', value: '=' },
  { type: 'opening_quotation', value: "'" },
  { type: 'string', value: 'hello world' },
  { type: 'closing_quotation', value: "'" }
]


export const generateAst = (tokens) => {
    let i = 0;
    let ast = new Program()
    while (i < tokens.length){
        if (tokens[i].value === "global"){
            let var1 = new VariableDeclaration()
            i++;
            if(tokens[i].value === "const"){
                var1.setType("const");
                
            }
            let declarator1 = new VariableDeclarator();
            i++;
            let id1 = new Identifier(tokens[i].value)
            declarator1.setId(id1)
            i++;
            if (tokens[i].value !== "="){
                throw new Error("expected =")
            }
            i++;
            let init;
            if (tokens[i].type === "opening_quotation"){
                i++;
                init = new StringLiteral(tokens[i].value)
                i++;
                if (tokens[i].type !== 'closing_quotation' ){
                    throw new Error("expected a quotation.")
                }
                declarator1.setInit(init)
                
            } 
            var1.pushDeclarators(declarator1);
            ast.push(var1)
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


console.log("\n\n\n")
console.log("Input")
console.log("global const a = 'hello world'")
console.log("\n\n\n")
console.log("Output")
console.log(generate.default(ast1).code)
console.log("\n\n\n")



