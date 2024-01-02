import inquirer from "inquirer";
import chalk from "chalk";
import { generateJsCode } from "../tokenization/main.js";

const {prompt} = inquirer

const askQuestions = () => {
  const questions = [
    { name: 'COMMAND', type: 'input', message: chalk.blue('>') },
  ];

  return prompt(questions);
};

let executionContext = {}

const repl = async () => {
  try {
    const answers = await askQuestions();
    const { COMMAND } = answers;

    if (COMMAND.trim()) {
        let js = generateJsCode(COMMAND)
      console.log(chalk.yellow(eval(js)));
    }
  } catch (error) {
    console.error(error.message);
  }

  repl();
};
console.log(chalk.green("Welcome to "), chalk.bgRedBright.underline.italic.bold(" GoatLang "), chalk.green(" programming Language."))
repl()
