import { ValidationError } from '../validation_error';
import alphabetizeNodes from '../util/alphabetizeNodes';

export function TypeFieldsSortedAlphabetically(context) {
  return {
    ObjectTypeDefinition(node) {
      const { isSorted, sortedNames, fix } = alphabetizeNodes(
        node.fields || [],
        (field) => field.name.value
      );

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            'type-fields-sorted-alphabetically',
            `The fields of object type \`${node.name.value}\` should be sorted alphabetically. ` +
              `Expected sorting: ${sortedNames.join(', ')}`,
            [node],
            fix
          )
        );
      }
    },
  };
}
