#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { generateJsCode } from './main.js'


function filePathToUrl(filePath) {
  const forwardSlashPath = filePath.replace(/\\/g, '/');

  const fileUrl = new URL(`file://${forwardSlashPath}`);

  return fileUrl.href;
}




let filePath = path.join(process.cwd(),process.argv[2])

const code = fs.readFileSync(filePath,{encoding:"utf8"})

const jsCode = generateJsCode(code)

fs.writeFileSync('./temp.js', jsCode)

const destPath = path.join(process.cwd(),'./temp.js')
import(filePathToUrl(destPath))
  .catch((error) => {
    console.error('Error importing temp.js:', error);
  })
  .finally(() => {
    fs.unlinkSync('./temp.js');
  });
