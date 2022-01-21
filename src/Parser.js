class Parser {
  parse(string) {
    this._string = string;

    return this.Program();
  }

  /*
 Main entry point
 Program
    : NumericLiteral
    ;


*/

  Program() {
    return this.NumericLiteral();
  }

  NumericLiteral() {
    return {
      type: "NumericLiteral",
      value: Number(this._string),
    };
  }
}

module.exports = { Parser };
