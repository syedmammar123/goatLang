export class Program {
  constructor() {
    this.type = "Program";
    this.body = [];
  }
  push(smth) {
    this.body.push(smth);
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
