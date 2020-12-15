import { ValidationError } from '../validation_error';
import listIsAlphabetical from '../util/listIsAlphabetical';

export function TypeFieldsSortedAlphabetically(configuration, context) {
  const ruleKey = 'type-fields-sorted-alphabetically';
  return {
    ObjectTypeDefinition(node) {
      const fieldList = (node.fields || []).map((field) => field.name.value);

      const { sortOrder = 'alphabetical' } =
        configuration.getRulesOptions()[ruleKey] || {};
      const { isSorted, sortedList } = listIsAlphabetical(fieldList, sortOrder);

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            ruleKey,
            `The fields of object type \`${node.name.value}\` should be sorted in ${sortOrder} order. ` +
              `Expected sorting: ${sortedList.join(', ')}`,
            [node]
          )
        );
      }
    },
  };
}
