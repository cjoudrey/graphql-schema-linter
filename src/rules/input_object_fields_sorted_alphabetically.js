import { ValidationError } from '../validation_error';
import listIsAlphabetical from '../util/listIsAlphabetical';

export function InputObjectFieldsSortedAlphabetically(context) {
  return {
    InputObjectTypeDefinition(node) {
      const fieldList = (node.fields || []).map((field) => field.name.value);
      const { isSorted, sortedList } = listIsAlphabetical(fieldList);

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            'input-object-fields-sorted-alphabetically',
            `The fields of input type \`${node.name.value}\` should be sorted alphabetically. ` +
              `Expected sorting: ${sortedList.join(', ')}`,
            [node]
          )
        );
      }
    },
  };
}
