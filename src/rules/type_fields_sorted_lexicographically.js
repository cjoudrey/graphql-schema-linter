import { ValidationError } from '../validation_error';
import listIsLexicographical from '../util/listIsLexicographical';

export function TypeFieldsSortedLexicographically(context) {
  return {
    ObjectTypeDefinition(node) {
      const fieldList = (node.fields || []).map((field) => field.name.value);
      const { isSorted, sortedList } = listIsLexicographical(fieldList);

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            'type-fields-sorted-lexicographically',
            `The fields of object type \`${node.name.value}\` should be sorted lexicographically. ` +
              `Expected sorting: ${sortedList.join(', ')}`,
            [node]
          )
        );
      }
    },
  };
}
