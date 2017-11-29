import { GraphQLError } from 'graphql/error';

export function TypesAreCapitalized(context) {
  var ignoredChars = ['_'];

  return {
    ObjectTypeDefinition(node) {
      const typeName = node.name.value;
      if (
        !ignoredChars.includes(typeName[0]) &&
        typeName[0] == typeName[0].toLowerCase()
      ) {
        context.reportError(
          new GraphQLError(
            `The object type \`${
              typeName
            }\` should start with a capital letter.`,
            [node.name]
          )
        );
      }
    },

    InterfaceTypeDefinition(node) {
      const typeName = node.name.value;
      if (
        !ignoredChars.includes(typeName[0]) &&
        typeName[0] == typeName[0].toLowerCase()
      ) {
        context.reportError(
          new GraphQLError(
            `The interface type \`${
              typeName
            }\` should start with a capital letter.`,
            [node.name]
          )
        );
      }
    },
  };
}
