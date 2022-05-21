import { ValidationError } from '../validation_error';

export function DefinedTypesAreUsed(context) {
  var defaultRootNames = {
    Query: 'query',
    Mutation: 'mutation',
    Subscription: 'subscription',
  };
  var definedTypes = [];
  var referencedTypes = new Set();
  var specifiedRoots = new Set();

  var recordDefinedType = (node) => {
    definedTypes.push(node);
  };

  return {
    SchemaDefinition: (node) => {
      node.operationTypes.forEach((operationType) =>
        specifiedRoots.add(operationType.operation)
      );
    },
    SchemaExtension: (node) => {
      node.operationTypes.forEach((operationType) =>
        specifiedRoots.add(operationType.operation)
      );
    },
    ScalarTypeDefinition: recordDefinedType,
    ObjectTypeDefinition: recordDefinedType,
    InterfaceTypeDefinition: recordDefinedType,
    UnionTypeDefinition: recordDefinedType,
    EnumTypeDefinition: recordDefinedType,
    InputObjectTypeDefinition: recordDefinedType,

    NamedType: (node) => {
      referencedTypes.add(node.name.value);
    },

    Document: {
      leave: (node) => {
        definedTypes.forEach((node) => {
          // If a schema root operation type is undefined, we can assume the object type that is named after the operation type is used (https://spec.graphql.org/draft/#sec-Root-Operation-Types.Default-Root-Operation-Type-Names)
          //
          // For example, if no mutation root is specified, we treat the Mutation object type (if any) as referenced.

          let isDefaultRootName =
            Object.keys(defaultRootNames).indexOf(node.name.value) > -1;

          if (
            isDefaultRootName &&
            !specifiedRoots.has(defaultRootNames[node.name.value])
          ) {
            referencedTypes.add(node.name.value);
          }

          if (node.kind == 'ObjectTypeDefinition') {
            let implementedInterfaces = node.interfaces.map((node) => {
              return node.name.value;
            });

            let anyReferencedInterfaces = implementedInterfaces.some(
              (interfaceName) => {
                return referencedTypes.has(interfaceName);
              }
            );

            if (anyReferencedInterfaces) {
              return;
            }
          }

          if (!referencedTypes.has(node.name.value)) {
            context.reportError(
              new ValidationError(
                'defined-types-are-used',
                `The type \`${node.name.value}\` is defined in the ` +
                  `schema but not used anywhere.`,
                [node]
              )
            );
          }
        });
      },
    },
  };
}
