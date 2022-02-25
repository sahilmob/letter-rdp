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
  require("./class.test"),
];
const parser = new Parser();

function exec() {
  const program = `
    class Point {
      def constructor(x, y){
        this.x = x;
        this.y = y;
      }

      def calc(){
        return this.x + this.y;
      }
    }

    class Point3D extends Point {
      def constructor(x, y, z){
        super(x,y);
        this.z = z;
      }


      def calc(){
        return super() + this.z;
      }
    }

    let p = new Point3D(10, 20, 30);

    p.calc();
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
