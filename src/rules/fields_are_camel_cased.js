import { ValidationError } from '../validation_error';
import { camelCase } from 'lodash';

export function FieldsAreCamelCased(context) {
  var isFixable = true;
  return {
    FieldDefinition(node, key, parent, path, ancestors) {
      const fieldName = node.name.value;
      const camelCased = camelCase(fieldName);
      if (camelCased !== fieldName) {
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
