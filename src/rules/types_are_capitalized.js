import { ValidationError } from '../validation_error';

export function TypesAreCapitalized(context) {
  return {
    ObjectTypeDefinition(node) {
      const typeName = node.name.value;
      if (typeName[0] == typeName[0].toLowerCase()) {
        context.reportError(
          new ValidationError(
            'types-are-capitalized',
            `The object type \`${typeName}\` should start with a capital letter.`,
            [node.name]
          )
        );
      }
    },

    InterfaceTypeDefinition(node) {
      const typeName = node.name.value;
      if (typeName[0] == typeName[0].toLowerCase()) {
        context.reportError(
          new ValidationError(
            'types-are-capitalized',
            `The interface type \`${typeName}\` should start with a capital letter.`,
            [node.name]
          )
        );
      }
    },
  };
}
