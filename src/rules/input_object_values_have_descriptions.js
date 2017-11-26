import { getDescription } from 'graphql/utilities/buildASTSchema';
import { ValidationError } from '../validation_error';

export function InputObjectValuesHaveDescriptions(context) {
  return {
    InputValueDefinition(node, key, parent, path, ancestors) {
      if (getDescription(node)) {
        return;
      }

      const inputValueName = node.name.value;
      const parentNode = ancestors[ancestors.length - 1];

      if (parentNode.kind != 'InputObjectTypeDefinition') {
        return;
      }

      const inputObjectName = parentNode.name.value;

      context.reportError(
        new ValidationError(
          'input-object-values-have-descriptions',
          `The input value \`${inputObjectName}.${inputValueName}\` is missing a description.`,
          [node]
        )
      );
    },
  };
}
