import { ValidationError } from '../validation_error';
import alphabetizeNodes from '../util/alphabetizeNodes';

export function InputObjectFieldsSortedAlphabetically(context) {
  return {
    InputObjectTypeDefinition(node) {
      const { isSorted, sortedNames, fix } = alphabetizeNodes(
        node.fields || [],
        (field) => field.name.value
      );

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            'input-object-fields-sorted-alphabetically',
            `The fields of input type \`${node.name.value}\` should be sorted alphabetically. ` +
              `Expected sorting: ${sortedNames.join(', ')}`,
            [node],
            fix
          )
        );
      }
    },
  };
}
