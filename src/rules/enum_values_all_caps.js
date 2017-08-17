import { GraphQLError } from 'graphql/error';

export function EnumValuesAllCaps(context) {
  return {
    EnumValueDefinition(node, key, parent, path, ancestors) {
      const enumValueName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      if (enumValueName !== enumValueName.toUpperCase()) {
        context.reportError(
          new GraphQLError(
            `The enum value \`${parentName}.${enumValueName}\` should be uppercase.`,
            [node]
          )
        );
      }
    },
  };
}
