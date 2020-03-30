import { ValidationError } from '../validation_error';
import listIsAlphabetical from '../util/listIsAlphabetical';

export function EnumValuesSortedAlphabetically(context) {
  return {
    EnumTypeDefinition(node, key, parent, path, ancestors) {
      const enumValues = node.values.map(val => {
        return val.name.value;
      });

      const { isSorted, sortedList } = listIsAlphabetical(enumValues);

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            'enum-values-sorted-alphabetically',
            `The enum \`${node.name.value}\` should be sorted alphabetically. ` +
              `Expected sorting: ${sortedList.join(', ')}`,
            [node]
          )
        );
      }
    },
  };
}
