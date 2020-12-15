import { ValidationError } from '../validation_error';
import listIsAlphabetical from '../util/listIsAlphabetical';

export function InterfaceFieldsSortedAlphabetically(configuration, context) {
  return {
    InterfaceTypeDefinition(node) {
      const ruleKey = 'interface-fields-sorted-alphabetically';
      const fieldList = (node.fields || []).map((field) => field.name.value);

      const { sortOrder = 'alphabetical' } =
        configuration.getRulesOptions()[ruleKey] || {};
      const { isSorted, sortedList } = listIsAlphabetical(fieldList, sortOrder);

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            'interface-fields-sorted-alphabetically',
            `The fields of interface type \`${node.name.value}\` should be sorted in ${sortOrder} order. ` +
              `Expected sorting: ${sortedList.join(', ')}`,
            [node]
          )
        );
      }
    },
  };
}
