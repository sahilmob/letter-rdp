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
];
const parser = new Parser();

function exec() {
  const program = `
    def square(x) {
        return x * x;
    }

    // square(2);
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
