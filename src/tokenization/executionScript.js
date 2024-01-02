#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { generateJsCode } from './main.js'

let filePath = path.join(process.cwd(),process.argv[2])

const code = fs.readFileSync(filePath,{encoding:"utf8"})

const jsCode = generateJsCode(code)

fs.writeFileSync('./temp.js', jsCode)


import('../../temp.js')
  .catch((error) => {
    console.error('Error importing temp.js:', error);
  })
  .finally(() => {
    fs.unlinkSync('./temp.js');
  });
