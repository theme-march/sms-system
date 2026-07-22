const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

function removeDuplicateModel(modelName) {
  const modelRegex = new RegExp(`model ${modelName} \\{[\\s\\S]*?\\n\\}`, 'g');
  let matchCount = 0;
  content = content.replace(modelRegex, (match) => {
    matchCount++;
    if (matchCount > 1) {
      console.log(`Removing duplicate ${modelName}`);
      return ''; // Remove the duplicate
    }
    return match; // Keep the first one
  });
}

removeDuplicateModel('FeeStructure');
removeDuplicateModel('Payment');

fs.writeFileSync('prisma/schema.prisma', content);
