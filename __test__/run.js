const assert = require("assert");
const { Parser } = require("../src/Parser");

const tests = [
  require("./literals.test"),
  require("./statement-list.test"),
  require("./block.test"),
  require("./emptyStatement.test"),
  require("./math.test"),
  require("./assignment.test"),
  require("./variable.test"),
  require("./if.test"),
  require("./relational.test"),
  require("./logical.test"),
  require("./unary.test"),
  require("./while.test"),
  require("./doWhile.test"),
  require("./for.test"),
  require("./functionDeclaration.test"),
  require("./member.test"),
  require("./functionCall.test"),
];
const parser = new Parser();

function exec() {
  const program = `
    let s = "hello world";
    let i = 0;

    while (i < s.length){
        s[i];
        console.log(i, s[i]);
        i += 1;
    }
  
    square(2);
    getCallback()();

`;
  const ast = parser.parse(program);

  console.log(JSON.stringify(ast, null, 2));
}

exec();

function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(ast, expected);
}

tests.forEach((testRun) => testRun(test));
console.log("All assertions passed");
