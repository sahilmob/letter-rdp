class Parser {
  parse(string) {
    this._string = string;
    return this.Program();
  }

  // Program
  //   :NumericLiteral
  //   ;

  Program() {
    return this.NumericLiteral();
  }

  // NumericLiteral
  //   :NUMBER
  //   ;
  NumericLiteral() {
    return {
      type: "NumericLiteral",
      value: Number(this._string),
    };
  }
}

module.exports = {
  Parser,
};
