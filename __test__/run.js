const assert = require("assert");
const { Parser } = require("../src/Parser");

const parser = new Parser();
const program = `   
// A comment

/**
 * 
 * 
 * Documentation comment
 * 
 */ 
String
'hello';

// Number
42;
`;
const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2));
