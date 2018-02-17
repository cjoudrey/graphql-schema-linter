import { ValidationError } from '../validation_error';

export function DefinedTypesAreUsed(context) {
  var ignoredTypes = ['Query', 'Mutatation', 'Subscription'];
  var definedTypes = [];
  var referencedTypes = new Set();
  var isFixable = false;

  var recordDefinedType = node => {
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

    NamedType: node => {
      referencedTypes.add(node.name.value);
    },

    Document: {
      leave: node => {
        definedTypes.forEach(node => {
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
