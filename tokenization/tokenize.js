import { isValidName } from "../helpers/token-checks.js";
import { keywords } from "../environment/environment.js";


let code = "global const a = 'hello world'";

let i = 0;
let tokens = []
let char = ""
let isQuotationOpened = false;

while (i < code.length){
    if (code[i] !== "=" && code[i] !== "'" && code[i] !== " " ){
        char = char + code[i]; 
    }
    else if (code[i] === " "){
        if (isQuotationOpened){
            char = char + code[i]
        }
        if (keywords.includes(char) && !isQuotationOpened){
            tokens.push({
                type:"declarative_keyword",
                value:char
            })
            char = ""
        }
    }
    else{
        if (code[i] === "=" ){
            if (!isValidName(char)){
                throw new Error("Not a valid Idenrifer Name! ")
            }
            tokens.push({
                type:"identifier",
                value:char
            })
            tokens.push({
                type:"assignment_operator",
                value:"="
            })
            char = ""
        }else if (code[i] === "'"){
            if (isQuotationOpened){
                tokens.push({
                    type:"string",
                    value:char
                })
                tokens.push({
                    type:"closing_quotation",
                    value:"'"
                })
                char = ""
            }
            else{
                tokens.push({
                    type:"opening_quotation",
                    value:"'"
                })
            }
            isQuotationOpened = !isQuotationOpened;
        }
    }
    i++;
}


console.log(tokens)
