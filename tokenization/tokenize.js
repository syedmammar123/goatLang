import { isValidName } from "../helpers/token-checks.js";
import { keywords } from "../environment/environment.js";


let code = "global const number = 2304";


function tokenize (code ){
    let i = 0;
    let tokens = []
    let char=""
    let isQuotationOpened=false;



    while (i<code.length){
        if (/^[a-zA-Z0-9_$@#]$/.test(code[i])){
            char = char + code[i]
            i++
        }
        console.log(char)
        if (code[i] === " "){
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
                console.log(char,"char")
                tokens.push({
                    type:'identifier',
                    value:char
                })
                char  = ""

            }
        }
        if (code[i] === "="){
                tokens.push({
                    type:'identifier',
                    value:char
                })
                tokens.push({
                    type:'equality',
                    value: "="
                })
            char = ""
            i++

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

        }
        
        if (!isNaN(Number(code[i])) && char === ""){
            let decimalCount = 0;
            let num = ""
            while ((!isNaN(Number(code[i])) || code[i] === ".")){
                console.log(code[i])
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
                value:Number(num)
            })
            i++
        }
    }
    return tokens;
}

console.log(tokenize(code))







let i = 0;
let tokens = []
let char = ""
let isQuotationOpened = false;

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


//console.log(tokens)
