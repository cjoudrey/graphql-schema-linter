import { GraphQLError } from "graphql/error";

export function EnumsSortedAlphabetically(context) {
  return {
    EnumTypeDefinition: function EnumTypeDefinition(node, key, parent, path, ancestors) {
      var enumValues = node.values.map(val => {
        return val.name.value;
      });

      if (!arraysEqual(enumValues, enumValues.slice().sort())) {
        context.reportError(
          new GraphQLError("The enum `" + node.name.value + "` should be sorted alphabetically: " + enumValues, [
            node
          ])
        );
      }
    }
  };
}

function arraysEqual(a, b) {
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
