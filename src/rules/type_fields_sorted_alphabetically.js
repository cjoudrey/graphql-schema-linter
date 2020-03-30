import { ValidationError } from '../validation_error';
import listIsAlphabetical from '../util/listIsAlphabetical';

export function TypeFieldsSortedAlphabetically(context) {
  return {
    ObjectTypeDefinition(node) {
      const fieldList = (node.fields || []).map(field => field.name.value);
      const { isSorted, sortedList } = listIsAlphabetical(fieldList);

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            'type-fields-sorted-alphabetically',
            `The fields of object type \`${node.name.value}\` should be sorted alphabetically. ` +
              `Expected sorting: ${sortedList.join(', ')}`,
            [node]
          )
        );
      }
    },
  };
}
