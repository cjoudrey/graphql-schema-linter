import { getDescription } from 'graphql/utilities/buildASTSchema';
import { ValidationError } from '../validation_error';

export function DeprecationsHaveAReason(context) {
  return {
    FieldDefinition(node, key, parent, path, ancestors) {
      const deprecatedDirective = getDeprecatedDirective(node);
      if (!deprecatedDirective) {
        return;
      }

      const reasonArgument = getReasonArgument(deprecatedDirective);
      if (reasonArgument) {
        return;
      }

      const fieldName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      context.reportError(
        new ValidationError(
          'deprecations-have-a-reason',
          `The field \`${parentName}.${fieldName}\` is deprecated but has no deprecation reason.`,
          [deprecatedDirective]
        )
      );
    },

    EnumValueDefinition(node, key, parent, path, ancestors) {
      const deprecatedDirective = getDeprecatedDirective(node);
      if (!deprecatedDirective) {
        return;
      }

      const reasonArgument = getReasonArgument(deprecatedDirective);
      if (reasonArgument) {
        return;
      }

      const enumValueName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      context.reportError(
        new ValidationError(
          'deprecations-have-a-reason',
          `The enum value \`${parentName}.${enumValueName}\` is deprecated but has no deprecation reason.`,
          [deprecatedDirective]
        )
      );
    },
  };
}

function getDeprecatedDirective(node) {
  const deprecatedDirective = node.directives.find((directive) => {
    if (directive.name.value != 'deprecated') {
      return false;
    }

    return true;
  });

  return deprecatedDirective;
}

function getReasonArgument(deprecatedDirective) {
  const reasonArgument = deprecatedDirective.arguments.find((arg) => {
    if (arg.name.value == 'reason') {
      return true;
    }

    return false;
  });

  return reasonArgument;
}
