import { getDescription } from 'graphql/utilities/extendSchema';
import { ValidationError } from '../validation_error';

function validateTypeHasDescription(configuration, context, node, typeKind) {
  if (
    getDescription(node, {
      commentDescriptions: configuration.getCommentDescriptions(),
    })
  ) {
    return;
  }

  const interfaceTypeName = node.name.value;

  context.reportError(
    new ValidationError(
      'types-have-descriptions',
      `The ${typeKind} type \`${interfaceTypeName}\` is missing a description.`,
      [node]
    )
  );
}

export function TypesHaveDescriptions(configuration, context) {
  return {
    TypeExtensionDefinition(node) {
      return false;
    },

    ScalarTypeDefinition(node) {
      validateTypeHasDescription(configuration, context, node, 'scalar');
    },

    ObjectTypeDefinition(node) {
      validateTypeHasDescription(configuration, context, node, 'object');
    },

    InterfaceTypeDefinition(node) {
      validateTypeHasDescription(configuration, context, node, 'interface');
    },

    UnionTypeDefinition(node) {
      validateTypeHasDescription(configuration, context, node, 'union');
    },

    EnumTypeDefinition(node) {
      validateTypeHasDescription(configuration, context, node, 'enum');
    },

    InputObjectTypeDefinition(node) {
      validateTypeHasDescription(configuration, context, node, 'input object');
    },
  };
}
