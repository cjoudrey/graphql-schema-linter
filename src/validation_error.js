import { GraphQLError } from 'graphql/error';

export class ValidationError extends GraphQLError {
  constructor(ruleName, message, nodes) {
    super(message, nodes);

    this.ruleName = ruleName;
  }
}
