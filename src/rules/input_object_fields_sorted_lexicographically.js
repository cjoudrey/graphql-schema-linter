import { ValidationError } from '../validation_error';
import listIsLexicographical from '../util/listIsLexicographical';

export function InputObjectFieldsSortedLexicographically(context) {
  return {
    InputObjectTypeDefinition(node) {
      const fieldList = (node.fields || []).map((field) => field.name.value);
      const { isSorted, sortedList } = listIsLexicographical(fieldList);

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            'input-object-fields-sorted-lexicographically',
            `The fields of input type \`${node.name.value}\` should be sorted lexicographically. ` +
              `Expected sorting: ${sortedList.join(', ')}`,
            [node]
          )
        );
      }
    },
  };
}
