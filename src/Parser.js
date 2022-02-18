const { Tokenizer } = require("./Tokenizer");

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

  // Program
  //   :Literal
  //   ;

  Program() {
    return { type: "Program", body: this.StatementList() };
  }

  // StatementList
  //   : Statement
  //   | StatementList Statement
  //   ;
  StatementList(stopLookahead) {
    const statementList = [this.Statement()];

    while (this._lookahead !== null && this._lookahead.type !== stopLookahead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  // Statement
  // : ExpressionStatement
  // | BlockStatement
  // | EmptyStatement
  // ;
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

  // EmptyStatement
  //   : ";"
  //   ;
  EmptyStatement() {
    this._eat(";");

    return {
      type: "EmptyStatement",
    };
  }

  // BlockStatement
  //   : "{" OptionalStatementList "}"
  //   ;
  BlockStatement() {
    this._eat("{");
    const body = this._lookahead.type !== "}" ? this.StatementList("}") : [];
    this._eat("}");

    return {
      type: "BlockStatement",
      body,
    };
  }

  // ExpressionStatement
  //   : Expression ';'
  //   ;
  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");

    return {
      type: "ExpressionStatement",
      expression,
    };
  }

  // Expression
  //   : AssignmentExpression
  //   ;
  Expression() {
    return this.AssignmentExpression();
  }

  // AssignmentExpression
  // : AdditiveExpression
  // | LeftHandSideExpression AssignmentOperator AssignmentExpression
  // ;
  AssignmentExpression() {
    const left = this.AdditiveExpression();
    if (!this._isAssignmentOperator(this._lookahead.type)) {
      return left;
    }

    return {
      type: "AssignmentExpression",
      operator: this.AssignmentOperator().value,
      left: this._checkValidAssignmentTarget(left),
      right: this.AssignmentExpression(),
    };
  }

  // LeftHandSideExpression
  //   : Identifier
  //   ;
  LeftHandSideExpression() {
    return this.Identifier();
  }

  // Identifier
  //   : IDENTIFIER
  //   ;
  Identifier() {
    const name = this._eat("IDENTIFIER").value;

    return {
      type: "Identifier",
      name,
    };
  }

  _checkValidAssignmentTarget(node) {
    if (node.type === "Identifier") {
      return node;
    }

    throw SyntaxError("Invalid left-hand side in assignment expression");
  }

  _isAssignmentOperator(tokenType) {
    return tokenType === "SIMPLE_ASSIGN" || tokenType === "COMPLEX_ASSIGN";
  }

  // AssignmentOperator
  //   : SIMPLE_ASSIGN
  //   | COMPLEX_ASSIGN
  //   ;
  AssignmentOperator() {
    if (this._lookahead.type === "SIMPLE_ASSIGN") {
      return this._eat("SIMPLE_ASSIGN");
    }

    return this._eat("COMPLEX_ASSIGN");
  }

  // AdditiveExpression
  //   : MultiplicativeExpression
  //   | AdditiveExpression ADDITIVE_OPERATOR Literal
  //   ;
  AdditiveExpression() {
    return this._BinaryExpression(
      "MultiplicativeExpression",
      "ADDITIVE_OPERATOR"
    );
  }

  // MultiplicativeExpression
  //   : PrimaryExpression
  //   | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression ->  PrimaryExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
  //   ;
  MultiplicativeExpression() {
    return this._BinaryExpression(
      "PrimaryExpression",
      "MULTIPLICATIVE_OPERATOR"
    );
  }

  // Generic binary expression
  _BinaryExpression(builderName, operatorToken) {
    let left = this[builderName]();

    while (this._lookahead.type === operatorToken) {
      const operator = this._eat(operatorToken).value;
      const right = this[builderName]();

      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  // PrimaryExpression
  //   : Literal
  //   | ParenthesizedExpression
  //   | LeftHandSideExpression
  //   ;
  PrimaryExpression() {
    if (this._isLiteral(this._lookahead.type)) {
      return this.Literal();
    }
    switch (this._lookahead.type) {
      case "(":
        return this.ParenthesizedExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }

  _isLiteral(tokenType) {
    return tokenType === "NUMBER" || tokenType === "STRING";
  }

  // ParenthesizedExpression
  //   : "(" Expression ")"
  //   ;
  ParenthesizedExpression() {
    this._eat("(");
    const expression = this.Expression();
    this._eat(")");

    return expression;
  }

  // Literal
  //   : NumericLiteral
  //   | StringLiteral
  //   ;
  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
    throw new SyntaxError(`Literal: unexpected literal production`);
  }

  // NumericLiteral
  //   :NUMBER
  //   ;
  NumericLiteral() {
    const token = this._eat("NUMBER");
    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  }

  StringLiteral() {
    const token = this._eat("STRING");
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1),
    };
  }

  _eat(tokenType) {
    const token = this._lookahead;

    if (token === null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }

    if (tokenType !== token.type) {
      throw new SyntaxError(
        `Unexpected token: "${token.type}", expected: "${tokenType}"`
      );
    }

    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }
}

module.exports = {
  Parser,
};
