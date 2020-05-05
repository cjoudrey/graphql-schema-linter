import { getDescription } from 'graphql/utilities/extendSchema';
import { ValidationError } from '../validation_error';

export function ArgumentsHaveDescriptions(configuration, context) {
  return {
    FieldDefinition(node) {
      const fieldName = node.name.value;

      for (const arg of node.arguments || []) {
        const description = getDescription(arg, {
          commentDescriptions: configuration.getCommentDescriptions(),
        });

        if (typeof description !== 'string' || description.length === 0) {
          const argName = arg.name.value;

          context.reportError(
            new ValidationError(
              'arguments-have-descriptions',
              `The \`${argName}\` argument of \`${fieldName}\` is missing a description.`,
              [arg]
            )
          );
        }
      }
    },
  };
}
