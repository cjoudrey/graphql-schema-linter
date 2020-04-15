import { ValidationError } from '../validation_error';

export function DefinedTypesAreUsed(context) {
  var ignoredTypes = ['Query', 'Mutation', 'Subscription'];
  var definedTypes = [];
  var referencedTypes = new Set();

  var recordDefinedType = (node) => {
    if (ignoredTypes.indexOf(node.name.value) == -1) {
      definedTypes.push(node);
    }
  };

  return {
    ScalarTypeDefinition: recordDefinedType,
    ObjectTypeDefinition: recordDefinedType,
    InterfaceTypeDefinition: recordDefinedType,
    UnionTypeDefinition: recordDefinedType,
    EnumTypeDefinition: recordDefinedType,
    InputObjectTypeDefinition: recordDefinedType,

    NamedType: (node, key, parent, path, ancestors) => {
      referencedTypes.add(node.name.value);
    },

    Document: {
      leave: (node) => {
        definedTypes.forEach((node) => {
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
