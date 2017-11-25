import { getDescription } from 'graphql/utilities/buildASTSchema';
import { GraphQLError } from 'graphql/error';

function validateTypeHasDescription(context, node, typeKind) {
  if (getDescription(node)) {
    return;
  }

  const interfaceTypeName = node.name.value;

  context.reportError(
    new GraphQLError(
      `The ${typeKind} type \`${interfaceTypeName}\` is missing a description.`,
      [node]
    )
  );
}

export function TypesHaveDescriptions(context) {
  return {
    TypeExtensionDefinition(node) {
      return false;
    },

    InterfaceTypeDefinition(node) {
      validateTypeHasDescription(context, node, 'interface');
    },

    InputObjectTypeDefinition(node) {
      validateTypeHasDescription(context, node, 'input object');
    },

    UnionTypeDefinition(node) {
      validateTypeHasDescription(context, node, 'union');
    },

    ObjectTypeDefinition(node) {
      validateTypeHasDescription(context, node, 'object');
    },
  };
}
