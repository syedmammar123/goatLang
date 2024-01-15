#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { generateJsCode } from './main.js'


function filePathToUrl(filePath) {
    try {
        const forwardSlashPath = filePath.replace(/\\/g, '/')

        const fileUrl = new URL(`file://${forwardSlashPath}`)

        return fileUrl.href
    } catch (error) {
        console.error(error)
    }
}
try {
    if (process.argv.length < 3) {
        throw new Error('You must provide a file path')
    }
if (path.extname(process.argv[2]) !== '.goat') {
    throw new Error('You must provide a file with .goat extension')
}
let filePath = path.join(process.cwd(), process.argv[2])

const code = fs.readFileSync(filePath, { encoding: 'utf8' })

const jsCode = generateJsCode(code)

fs.writeFileSync('./temp.js', jsCode)

const destPath = path.join(process.cwd(), './temp.js')
import(filePathToUrl(destPath))
    .catch((error) => {
        console.error("Opsss Error! ",error.message)
    })
    .finally(() => {
        fs.unlinkSync('./temp.js')
    })
} catch (error) {
    console.error(error.message)
}

