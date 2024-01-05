#!/usr/bin/env node

import inquirer from "inquirer";
import functions from './REPLFunctions.js'
import chalk from "chalk";
import { tokenize } from "../tokenization/tokenize.js";
import { generateAst } from "../tokenization/ast.js";
import generate from "@babel/generator";
import { Program } from "../tokenization/Classes.js";

const {prompt} = inquirer

const askQuestions = () => {
  const questions = [
    { name: 'COMMAND', type: 'input', message: chalk.blue('->') },
  ];

  return prompt(questions);
};

let js = functions

const repl = async () => {
  try {
    const answers = await askQuestions();
    const { COMMAND } = answers;

    let tokens = tokenize(COMMAND)
    let ast = generateAst(tokens)

      let dataAst = new Program()

      ast.body.forEach(( elem ) => {
          if (elem?.type === "VariableDeclaration" || elem?.type === "ExpressionStatement" || elem?.type === "AssignmentExpression"){
              dataAst.push(elem)
          }
      })

    let code = generate.default(ast).code

    let dataCode = generate.default(dataAst).code

    if (COMMAND.trim()) {
        let temp = js  + "\n" + code
        console.log(chalk.yellow(eval(temp)));
        js = js + "\n" + dataCode
    }
  } catch (error) {
    console.error(error.message);
  }

  repl();
};
console.log(chalk.green("Welcome to "), chalk.bgRedBright.underline.italic.bold(" GoatLang "), chalk.green(" programming Language."))
repl()
