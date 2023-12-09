import { isValidName } from "../helpers/token-checks.js";
import { keywords } from "../environment/environment.js";
import fs from 'fs'

const code  = fs.readFileSync("./code", {encoding:"utf8"})

function tokenize (code ){
    let i = 0;
    let tokens = []
    let char=""

 
    while (i<code.length){
        if (code[i] === "\r" || code[i] === "\n"){
            i++
        }
        while (/^[a-zA-Z0-9_$@#]$/.test(code[i])){
            char = char + code[i]
            i++
        }
            while (code[i] === " "){
                i++
            }
        if (keywords.includes(char)){
            tokens.push({
                type:'keyword',
                value:char
            })
            char  = ""
        }else if((code[i] !== "=") && char !== "" && (!keywords.includes(char))){
            tokens.push({
                type:'identifier',
                value:char
            })
            char  = ""

        }
        if (code[i] === "<"){
                tokens.push({
                    type:"less_than",
                    value:"<"
                })
        i++
        }
        if (code[i] === ">"){
                tokens.push({
                    type:"greater_than",
                    value:"<"
                })
        i++
        }
        if (code[i] === "{"){
                tokens.push({
                    type:"openening_blockscope",
                    value:"{"
                })
        i++
        }
        if (code[i] === "}"){
                tokens.push({
                    type:"closing_blockscope",
                    value:"}"
                })
        i++
        }
        if (code[i] === "("){
            tokens.push({
                type:"openeing_parenthesis",
                value:"("
            })
            i++
        }
        if (code[i] === ")"){
            tokens.push({
                type:"closing_parenthesis",
                value:")"
            })
            i++
        }
        if (code[i] === "="){
            let temp =""
            while (code[i] === "="){
                temp = temp + code[i]
                i++
            }
            if (temp.length === 1){
                tokens.push({
                    type:'identifier',
                    value:char
                })
                tokens.push({
                    type:'equality',
                    value: "="
                })
            }
            if (temp.length === 2){
                tokens.push({
                    type:'identifier',
                    value:char
                })
                tokens.push({
                    type:'double_equality',
                    value: "=="
                })
            }
            if (temp.length === 3){
                tokens.push({
                    type:'identifier',
                    value:char
                })
                tokens.push({
                    type:'triple_equality',
                    value:"==="
                })
            }
            char = ""
            temp=""
        }
        if (code[i] === "'"){
            i++;
            while (code[i] !== "'" ){
                char = char + code[i];
                i++
            }
            i++;
            tokens.push({
                type:"string",
                value:char
            })
        char =""
        }
        
        if (!isNaN(parseInt(code[i])) && char === ""){

            let decimalCount = 0;
            let num = ""
            while ((!isNaN(parseInt(code[i])) || code[i] === ".")){
                if (code[i] === "."){
                    decimalCount++
                }
                if (decimalCount > 1){
                    throw new Error("Invalid number")
                }
                num = num + code[i]
                i++
            }
            tokens.push({
                type:'Number',
                value:parseInt(num)
            })
        }
    }
    return tokens;
}

console.log(tokenize(code))







let i = 0;
let tokens = []
let char = ""
let isQuotationOpened = false;
/*
while (i < tokens.length){
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
*/

//console.log(tokens)
