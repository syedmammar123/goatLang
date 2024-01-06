import { parseLogicalExpression } from "./BinaryExpressionParsing.js";
import { BlockStatement, WhileStatement } from "./Classes.js";

export function parseUntilLoop(tokens, i, currentScope, scope){

  let whileVar = new WhileStatement();
  currentScope.push(whileVar); // ye wo scope hai jahan until loop declare hoga
  i++;
  if(tokens[i].value !== "("){
      throw new Error("expected (")
  }
  i++

  let testTokens = [];
  while (tokens[i].value !== "{") {
    testTokens.push(tokens[i]);
    i++;
  }

  if(testTokens[testTokens.length - 1].value !== ")"){
    throw new Error("expected ) to end until Loop condition")
  }
  testTokens.pop();
  whileVar.setTest(parseLogicalExpression(testTokens))

  if(tokens[i].value !== "{"){
       throw new Error("expected { for starting blockscope of while loop")
  }

  if (tokens[i].type === "openening_blockscope" && tokens[i].value === "{") {
    let blockStatement = new BlockStatement();
    whileVar.setBody(blockStatement);
    scope.push(whileVar.body); // ye is if ka apna scope hai
  }
  console.log("yasdakdjkjfisjdfiilf")
  return i;
 

}