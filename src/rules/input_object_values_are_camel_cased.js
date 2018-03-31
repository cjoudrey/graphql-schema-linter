import { ValidationError } from '../validation_error';

const camelCaseTest = RegExp('^[a-z][a-zA-Z0-9]*$');

export function InputObjectValuesAreCamelCased(context) {
  return {
    InputValueDefinition(node, key, parent, path, ancestors) {
      const inputValueName = node.name.value;
      const parentNode = ancestors[ancestors.length - 1];

      const fieldName = node.name.value;
      if (!camelCaseTest.test(fieldName)) {
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
