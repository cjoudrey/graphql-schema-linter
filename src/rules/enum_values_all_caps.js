import { GraphQLError } from 'graphql/error';

export function EnumValuesAllCaps(context) {
  return {
    EnumValueDefinition(node, key, parent, path, ancestors) {
      const fieldName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      if(fieldName !== fieldName.toUpperCase()) {
        context.reportError(
          new GraphQLError(
            `The enum value \`${parentName}.${fieldName}\` should be uppercase.`, [node]
          )
        );
      }
    },
  };
}
