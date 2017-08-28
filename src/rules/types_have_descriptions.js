import { getDescription } from 'graphql/utilities/buildASTSchema';
import { GraphQLError } from 'graphql/error';

export function TypesHaveDescriptions(context) {
  return {
    TypeExtensionDefinition(node) {
      return false;
    },

    InterfaceTypeDefinition(node) {
      if (getDescription(node)) {
        return;
      }

      const interfaceTypeName = node.name.value;

      context.reportError(
        new GraphQLError(
          `The interface type \`${interfaceTypeName}\` is missing a description.`,
          [node]
        )
      );
    },

    ObjectTypeDefinition(node) {
      if (getDescription(node)) {
        return;
      }

      const objectTypeName = node.name.value;

      context.reportError(
        new GraphQLError(
          `The object type \`${objectTypeName}\` is missing a description.`,
          [node]
        )
      );
    },
  };
}
