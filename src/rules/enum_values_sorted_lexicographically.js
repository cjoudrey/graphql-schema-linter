import { ValidationError } from '../validation_error';
import listIsLexicographical from '../util/listIsLexicographical';

export function EnumValuesSortedLexicographically(context) {
  return {
    EnumTypeDefinition(node, key, parent, path, ancestors) {
      const enumValues = node.values.map((val) => {
        return val.name.value;
      });

      const { isSorted, sortedList } = listIsLexicographical(enumValues);

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            'enum-values-sorted-lexicographically',
            `The enum \`${node.name.value}\` should be sorted lexicographically. ` +
              `Expected sorting: ${sortedList.join(', ')}`,
            [node]
          )
        );
      }
    },
  };
}
