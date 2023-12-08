const { readFileSync } = require('fs');
const { join } = require('path');
const path = join(process.cwd(), 'mockData.ts');

const data = readFileSync(path, 'utf-8');

console.log(data);
