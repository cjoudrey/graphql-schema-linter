import { ValidationError } from '../validation_error';
import listIsAlphabetical from '../util/listIsAlphabetical';

export function EnumValuesSortedAlphabetically(configuration, context) {
  const ruleKey = 'enum-values-sorted-alphabetically';
  return {
    EnumTypeDefinition(node, key, parent, path, ancestors) {
      const enumValues = node.values.map((val) => {
        return val.name.value;
      });

      const { sortOrder = 'alphabetical' } =
        configuration.getRulesOptions()[ruleKey] || {};
      const { isSorted, sortedList } = listIsAlphabetical(
        enumValues,
        sortOrder
      );

      if (!isSorted) {
        context.reportError(
          new ValidationError(
            ruleKey,
            `The enum \`${node.name.value}\` should be sorted in ${sortOrder} order. ` +
              `Expected sorting: ${sortedList.join(', ')}`,
            [node]
          )
        );
      }
    },
  };
}
