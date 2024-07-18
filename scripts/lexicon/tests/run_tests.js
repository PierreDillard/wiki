const fs = require('fs');
const path = require('path');
const assert = require('assert');

const { preprocessContent } = require('./preprocessContent');

function runTests() {
  const testFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.json'));
  testFiles.forEach(file => {
    const testCase = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
    const result = preprocessContent(testCase.input, testCase.filePath);
    try {
      assert.strictEqual(result, testCase.expected);
      console.log(`✅ Test passed: ${file}`);
    } catch (error) {
      console.error(`❌ Test failed: ${file}`);
      console.error(`Expected: ${testCase.expected}`);
      console.error(`Received: ${result}`);
    }
  });
}

runTests();