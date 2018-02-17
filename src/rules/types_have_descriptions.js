import { getDescription } from 'graphql/utilities/buildASTSchema';
import { ValidationError } from '../validation_error';

function validateTypeHasDescription(context, node, typeKind) {
  var isFixable = false;

  if (getDescription(node)) {
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

export function TypesHaveDescriptions(context) {
  return {
    TypeExtensionDefinition(node) {
      return false;
    },

    ScalarTypeDefinition(node) {
      validateTypeHasDescription(context, node, 'scalar');
    },

    ObjectTypeDefinition(node) {
      validateTypeHasDescription(context, node, 'object');
    },

    InterfaceTypeDefinition(node) {
      validateTypeHasDescription(context, node, 'interface');
    },

    UnionTypeDefinition(node) {
      validateTypeHasDescription(context, node, 'union');
    },

    EnumTypeDefinition(node) {
      validateTypeHasDescription(context, node, 'enum');
    },

    InputObjectTypeDefinition(node) {
      validateTypeHasDescription(context, node, 'input object');
    },
  };
}
