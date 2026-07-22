const fs = require('fs');

function fixTestFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = `import { describe, it, before } from 'node:test';\nimport assert from 'node:assert';\n` + content;
  content = content.replace(/beforeAll\(/g, 'before(');
  content = content.replace(/expect\((.*?)\)\.toBeDefined\(\)/g, 'assert.ok($1)');
  content = content.replace(/expect\((.*?)\)\.toBe\((.*?)\)/g, 'assert.strictEqual($1, $2)');
  content = content.replace(/expect\((.*?)\)\.rejects\.toThrow\((.*?)\)/g, 'await assert.rejects($1, new Error($2))');
  fs.writeFileSync(filePath, content);
}

fixTestFile('tests/payroll.test.ts');
fixTestFile('tests/leave.test.ts');
