import { getDescription } from 'graphql/utilities/buildASTSchema';
import { ValidationError } from '../validation_error';

export function FieldsHaveDescriptions(configuration, context) {
  return {
    FieldDefinition(node, key, parent, path, ancestors) {
      if (node.description && node.description.value != '') {
        return;
      }

      const fieldName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      context.reportError(
        new ValidationError(
          'fields-have-descriptions',
          `The field \`${parentName}.${fieldName}\` is missing a description.`,
          [node]
        )
      );
    },
  };
}
