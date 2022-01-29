const assert = require("assert");
const { Parser } = require("../src/Parser");

const tests = [
  require("./literals.test"),
  require("./statement-list.test"),
  require("./block.test"),
  require("./emptyStatement.test"),
  require("./math.test"),
];
const parser = new Parser();

function exec() {
  const program = `   
// A comment

/**
 * 
 * 
 * Documentation comment
 * 
 */ 
// String
'hello';

// Number
42;
`;
  const ast = parser.parse(program);

  console.log(JSON.stringify(ast, null, 2));
}

// exec();

function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(ast, expected);
}

tests.forEach((testRun) => testRun(test));
console.log("All assertions passed");
