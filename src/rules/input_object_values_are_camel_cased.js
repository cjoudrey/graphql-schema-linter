import { ValidationError } from '../validation_error';
import { camelCase } from 'lodash';

export function InputObjectValuesAreCamelCased(context) {
  return {
    InputValueDefinition(node, key, parent, path, ancestors) {
      const inputValueName = node.name.value;
      const parentNode = ancestors[ancestors.length - 1];

      const fieldName = node.name.value;
      const camelCased = camelCase(fieldName);
      if (camelCased !== fieldName) {
        const inputObjectName = parentNode.name.value;
        context.reportError(
          new ValidationError(
            'input-object-values-are-camel-cased',
            `The input value \`${inputObjectName}.${inputValueName}\` is not camel cased.`,
            [node]
          )
        );
      }
    },
  };
}
