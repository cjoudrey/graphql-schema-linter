import { getDescription } from 'graphql/utilities/buildASTSchema';
import { ValidationError } from '../validation_error';

export function EnumValuesHaveDescriptions(context) {
  return {
    EnumValueDefinition(node, key, parent, path, ancestors) {
      if (getDescription(node)) {
        return;
      }

      const enumValue = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      context.reportError(
        new ValidationError(
          'enum-values-have-descriptions',
          `The enum value \`${parentName}.${enumValue}\` is missing a description.`,
          [node]
        )
      );
    },
  };
}
