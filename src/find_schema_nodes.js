import { visit } from 'graphql';

/*
  scopes: (required) string array
  schema: (required) GraphQLSchema

  A scope could be a `Type`, `Type.field`, `Type.field.argument` or `Enum.VALUE`.
*/
export function findSchemaNodes(scopes, schema) {
  const result = new Set();
  const tracer = {
    enter: (node) => {
      result.add(node);
    },
    leave: () => {},
  };
  for (const scope of scopes) {
    const node = findScopeNode(scope, schema);
    node && visit(node, tracer);
  }
  return result;
}

function findScopeNode(scope, schema) {
  const [typeName, fieldName, argumentName] = scope.split('.');
  const type = schema.getType(typeName);
  let astNode = type?.astNode;
  if (fieldName === undefined) {
    return astNode;
  }

  const field =
    astNode?.kind === 'EnumTypeDefinition'
      ? type?.getValue(fieldName)
      : type?.getFields()[fieldName];
  astNode = field?.astNode;
  if (argumentName === undefined) {
    return astNode;
  }

  const argument = field?.args.find((arg) => arg.name === argumentName);
  astNode = argument?.astNode;
  return astNode;
}
