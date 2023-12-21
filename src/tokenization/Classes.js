function insertIntoArray(arr, idx, val) {
  if (idx > arr.length) {
    return;
  }
  for (let i = arr.length; i >= idx; i--) {
    arr[i] = arr[i - 1];
  }
  arr[idx] = val;
}

export class Program {
  constructor() {
    this.type = "Program";
    this.body = [];
  }
  push(smth) {
    this.body.push(smth);
  }
  unshift(smth) {
    this.body.unshift(smth);
  }
  insert(smth, idx) {
    insertIntoArray(this.body, idx, smth);
  }
}

export class VariableDeclaration {
  constructor(kind) {
    this.type = "VariableDeclaration";
    this.declarations = [];
    this.kind = kind;
  }
  pushDeclarators(declarator) {
    this.declarations.push(declarator);
  }
  setType(type) {
    this.kind = type;
  }
}

export class VariableDeclarator {
  constructor() {
    this.type = "VariableDeclarator";
    this.id = null;
    this.init = null;
  }
  setId(id) {
    this.id = id;
  }
  setInit(init) {
    this.init = init;
  }
}

export class StringLiteral {
  constructor(val) {
    (this.type = "StringLiteral"), (this.value = val);
  }
}
export class NumericLiteral {
  constructor(val) {
    (this.type = "NumericLiteral"), (this.value = val);
  }
}

export class Identifier {
  constructor(name) {
    (this.type = "Identifier"), (this.name = name);
  }
}

export class FunctionDeclaration {
  constructor() {
    this.type = "FunctionDeclaration";
    this.id = null;
    this.generator = false;
    this.async = false;
    this.params = [];
    this.body = null;
  }
  setScope(statement) {
    this.body = statement;
  }
  pushParams(param) {
    this.params.push(param);
  }
  setId(id) {
    this.id = id;
  }
}

export class BlockStatement {
  constructor() {
    this.type = "BlockStatement";
    this.body = [];
  }
  push(statement) {
    this.body.push(statement);
  }
}

export class ArrayExpression {
  constructor() {
    this.type = "ArrayExpression";
    this.elements = [];
  }
  push(smth) {
    this.elements.push(smth);
  }
}

export class IfStatement {
  constructor() {
    this.type = "IfStatement";
    this.test = null;
    this.consequent = null;
    this.alternate = null;
  }
  setTest(test) {
    this.test = test;
  }
  setConsequent(consequent) {
    this.consequent = consequent;
  }
  setAlternate(alternate) {
    this.alternate = alternate;
  }
}
export class BinaryExpression {
  constructor() {
    this.type = "BinaryExpression";
    this.left = null;
    this.operator = null;
    this.right = null;
  }
  setLeft(left) {
    this.left = left;
  }
  setRight(right) {
    this.right = right;
  }
  setOperator(operator) {
    this.operator = operator;
  }
}

export class LogicalExpression {
  constructor() {
    this.type = "LogicalExpression";
    this.left = null;
    this.operator = null;
    this.right = null;
  }
  setLeft(left) {
    this.left = left;
  }
  setRight(right) {
    this.right = right;
  }
  setOperator(operator) {
    this.operator = operator;
  }
}


export class ExpressionStatement{
    constructor(){
        this.type="ExpressionStatement";
        this.expression = null;
    }
    setExpression(exp){
        this.expression = exp;
    }
}

export class CallExpression{
    constructor(){
        this.type="CallExpression";
        this.callee=null;
        this.arguments=[];
    }
    setCallee(callee){
        this.callee = callee;
    }
    pushArg(smth){
        this.arguments.push(smth)
    }
}

export class MemberExpression{
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
