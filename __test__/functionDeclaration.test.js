module.exports = (test) => {
  test(
    `
  def square(x) {
      return x * x;
  }

  // square(2);  
  `,
    {
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: {
            type: "Identifier",
            name: "square",
          },
          params: [
            {
              type: "Identifier",
              name: "x",
            },
          ],
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ReturnStatement",
                argument: {
                  type: "BinaryExpression",
                  operator: "*",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  right: {
                    type: "Identifier",
                    name: "x",
                  },
                },
              },
            ],
          },
        },
      ],
    }
  );

  test(
    `
  def empty() {
      return;
  }
  `,
    {
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: {
            type: "Identifier",
            name: "empty",
          },
          params: [],
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ReturnStatement",
                argument: null,
              },
            ],
          },
        },
      ],
    }
  );

  test(
    `
  def emptyBody() {
  }
  `,
    {
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: {
            type: "Identifier",
            name: "emptyBody",
          },
          params: [],
          body: {
            type: "BlockStatement",
            body: [],
          },
        },
      ],
    }
  );

  test(
    `
  def multiParams(x, y) {
      return x * x;
  }

  `,
    {
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: {
            type: "Identifier",
            name: "multiParams",
          },
          params: [
            {
              type: "Identifier",
              name: "x",
            },
            {
              type: "Identifier",
              name: "y",
            },
          ],
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ReturnStatement",
                argument: {
                  type: "BinaryExpression",
                  operator: "*",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  right: {
                    type: "Identifier",
                    name: "x",
                  },
                },
              },
            ],
          },
        },
      ],
    }
  );
};
