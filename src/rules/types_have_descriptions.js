import { getDescription } from 'graphql/utilities/buildASTSchema';
import { GraphQLError } from 'graphql/error';

export default function(context) {
  return {
    InterfaceTypeDefinition(node) {
      if (getDescription(node)) {
        return;
      }

      const interfaceTypeName = node.name.value;

      context.reportError(
        new GraphQLError(
          `The interface type \`${interfaceTypeName}\` is missing a description.`,
          [node],
        )
      )
    },

    ObjectTypeDefinition(node) {
      if (getDescription(node)) {
        return;
      }

      const objectTypeName = node.name.value;

      context.reportError(
        new GraphQLError(
          `The object type \`${objectTypeName}\` is missing a description.`,
          [node],
        )
      )
    }
  };
};
