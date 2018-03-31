import { ValidationError } from '../validation_error';

const camelCaseTest = RegExp('^[a-z][a-zA-Z0-9]*$');

export function FieldsAreCamelCased(context) {
  return {
    FieldDefinition(node, key, parent, path, ancestors) {
      const fieldName = node.name.value;
      if (!camelCaseTest.test(fieldName)) {
        const parentName = ancestors[ancestors.length - 1].name.value;
        context.reportError(
          new ValidationError(
            'fields-are-camel-cased',
            `The field \`${parentName}.${fieldName}\` is not camel cased.`,
            [node]
          )
        );
      }
    },
  };
}
