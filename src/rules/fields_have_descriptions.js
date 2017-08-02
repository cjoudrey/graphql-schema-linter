import { getDescription } from 'graphql/utilities/buildASTSchema';
import { GraphQLError } from 'graphql/error';

export default function(context) {
  return {
    FieldDefinition(node, key, parent, path, ancestors) {
      if (getDescription(node)) {
        return;
      }

      const fieldName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      context.reportError(
        new GraphQLError(
          `The field \`${parentName}.${fieldName}\` is missing a description.`,
          [node],
        )
      )
    }
  };
};
