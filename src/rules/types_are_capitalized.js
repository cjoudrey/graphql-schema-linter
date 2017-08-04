import { GraphQLError } from 'graphql/error';

export function TypesAreCapitalized(context) {
  return {
    ObjectTypeDefinition(node) {
      const typeName = node.name.value;
      if (typeName[0] == typeName[0].toLowerCase()) {
        context.reportError(
          new GraphQLError(
            `The object type \`${typeName}\` should start with a capital letter.`,
            [node],
          )
        )
      }
    },

    InterfaceTypeDefinition(node) {
      const typeName = node.name.value;
      if (typeName[0] == typeName[0].toLowerCase()) {
        context.reportError(
          new GraphQLError(
            `The interface type \`${typeName}\` should start with a capital letter.`,
            [node],
          )
        )
      }
    }
  };
}
