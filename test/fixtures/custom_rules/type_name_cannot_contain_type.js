import { ValidationError } from '../../../src/validation_error';

export function TypeNameCannotContainType(context) {
  return {
    ObjectTypeDefinition(node) {
      const typeName = node.name.value;

      if (typeName.toUpperCase().indexOf('TYPE') >= 0) {
        context.reportError(
          new ValidationError(
            'type-names-cannot-contain-type',
            `The object type \`${typeName}\` cannot include the word 'type'.`,
            [node.name]
          )
        );
      }
    },
  };
}
