import { ValidationError } from '../validation_error';
import listIsAlphabetical from '../util/listIsAlphabetical';

export function InputObjectFieldsSortedAlphabetically(configuration, context) {
  const ruleKey = 'input-object-fields-sorted-alphabetically';
  return {
    InputObjectTypeDefinition(node) {
      const fieldList = (node.fields || []).map((field) => field.name.value);

      const { sortOrder = 'alphabetical' } =
        configuration.getRulesOptions()[ruleKey] || {};
      const { isSorted, sortedList } = listIsAlphabetical(fieldList, sortOrder);

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            ruleKey,
            `The fields of input type \`${node.name.value}\` should be sorted in ${sortOrder} order. ` +
              `Expected sorting: ${sortedList.join(', ')}`,
            [node]
          )
        );
      }
    },
  };
}
