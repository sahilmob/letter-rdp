const { Tokenizer } = require("./Tokenizer");

const DefaultFactory = {
  Program(body) {
    return {
      type: "Program",
      body,
    };
  },
  EmptyStatement() {
    return {
      type: "EmptyStatement",
    };
  },
  BlockStatement(body) {
    return { type: "BlockStatement", body };
  },
  ExpressionStatement(expression) {
    return {
      type: "ExpressionStatement",
      expression,
    };
  },
  StringLiteral(token) {
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1),
    };
  },
  NumericLiteral(token) {
    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  },
};

const AST_MODE = "default";

const factory = AST_MODE === "default" ? DefaultFactory : null; // could s-expression ast;

class Parser {
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  parse(string) {
    this._string = string;
    this._tokenizer.init(string);

    this._lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  Program() {
    return factory.Program(this.StatementList());
  }

  StatementList(stopLookahead = null) {
    const statementList = [this.Statement()];

    while (this._lookahead !== null && this._lookahead.type !== stopLookahead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  Statement() {
    switch (this._lookahead.type) {
      case ";":
        return this.EmptyStatement();
      case "{":
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  EmptyStatement() {
    this._eat(";");
    return factory.EmptyStatement();
  }

  BlockStatement() {
    this._eat("{");

    const body = this._lookahead.type !== "}" ? this.StatementList("}") : [];

    this._eat("}");

    return factory.BlockStatement(body);
  }

  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");
    return factory.ExpressionStatement(expression);
  }

  Expression() {
    return this.AdditiveExpression();
  }

  AdditiveExpression() {
    let left = this.MultiplicativeExpression();

    while (this._lookahead.type === "ADDITIVE_OPERATOR") {
      const operator = this._eat("ADDITIVE_OPERATOR").value;

      const right = this.MultiplicativeExpression();

      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  MultiplicativeExpression() {
    let left = this.PrimaryExpression();

    while (this._lookahead.type === "MULTIPLICATIVE_OPERATOR") {
      const operator = this._eat("MULTIPLICATIVE_OPERATOR").value;

      const right = this.PrimaryExpression();

      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  PrimaryExpression() {
    switch (this._lookahead.type) {
      case "(":
        return this.ParenthesizedExpression();
      default:
        return this.Literal();
    }
  }

  ParenthesizedExpression() {
    this._eat("(");
    const expression = this.Expression();
    this._eat(")");
    return expression;
  }

  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
    throw new SyntaxError(`Literal: unexpected literal production`);
  }

  StringLiteral() {
    const token = this._eat("STRING");
    return factory.StringLiteral(token);
  }

  NumericLiteral() {
    const token = this._eat("NUMBER");
    return factory.NumericLiteral(token);
  }

  _eat(tokenType) {
    const token = this._lookahead;

    if (token === null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.value}", expected: "${tokenType}"`
      );
    }

    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}

module.exports = { Parser };
