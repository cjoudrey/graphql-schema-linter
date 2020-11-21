import { GraphQLError } from 'graphql/error';

export class ValidationError extends GraphQLError {
  // fix is {loc: {start: number, end: number}, replacement: string}
  // frequently loc will be `nodes[0].loc` but it need not be.
  constructor(ruleName, message, nodes, fix) {
    super(message, nodes);

    this.ruleName = ruleName;
    if (fix != null) {
      this.fix = fix;
    }
  }
}
