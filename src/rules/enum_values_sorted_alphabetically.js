import { ValidationError } from '../validation_error';
import alphabetizeNodes from '../util/alphabetizeNodes';

export function EnumValuesSortedAlphabetically(context) {
  return {
    EnumTypeDefinition(node, key, parent, path, ancestors) {
      const { isSorted, sortedNames, fix } = alphabetizeNodes(
        node.values,
        (val) => val.name.value
      );

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            'enum-values-sorted-alphabetically',
            `The enum \`${node.name.value}\` should be sorted alphabetically. ` +
              `Expected sorting: ${sortedNames.join(', ')}`,
            [node],
            fix
          )
        );
      }
    },
  };
}
