import { getDescription } from 'graphql/utilities/buildASTSchema';
import { GraphQLError } from 'graphql/error';

export function DeprecationsHaveAReason(context) {
  return {
    FieldDefinition(node, key, parent, path, ancestors) {
      if (!isDeprecatedWithoutReason(node)) {
        return;
      }

      const fieldName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      context.reportError(
        new GraphQLError(
          `The field \`${parentName}.${fieldName}\` is deprecated but has no deprecation reason.`,
          [node]
        )
      );
    },

    EnumValueDefinition(node, key, parent, path, ancestors) {
      if (!isDeprecatedWithoutReason(node)) {
        return;
      }

      const fieldName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      context.reportError(
        new GraphQLError(
          `The enum value \`${parentName}.${fieldName}\` is deprecated but has no deprecation reason.`,
          [node]
        )
      );
    },
  };
}

function isDeprecatedWithoutReason(node) {
  const deprecatedDirective = node.directives.find(directive => {
    if (directive.name.value != 'deprecated') {
      return false;
    }

    return true;
  });

  if (!deprecatedDirective) {
    return false;
  }

  const reasonArgument = deprecatedDirective.arguments.find(arg => {
    if (arg.name.value == 'reason') {
      return true;
    }

    return false;
  });

  return !reasonArgument;
}
