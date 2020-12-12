import { Kind } from 'graphql';
import { ValidationError } from '../validation_error';

// Removes any NonNull or List wrapping
function unwrapType(typeAst) {
  let type = typeAst;
  while (type.type) {
    type = type.type;
  }
  return type;
}

export function DefinedTypesAreUsed(context) {
  const typeMap = new Map();
  const topLevelTypes = new Set();

  let seenSchemaDefinition = false;
  let currentType = null;

  const visitType = {
    enter(node) {
      currentType = node.name.value;

      if (!typeMap.has(currentType)) {
        typeMap.set(currentType, {
          node,
          interfaces: new Set(),
          referencedTypes: new Set(),
        });
      }

      if (node.interfaces) {
        for (const interfaceType of node.interfaces) {
          typeMap.get(currentType).interfaces.add(interfaceType.name.value);
        }
      }

      if (
        node.kind === Kind.UNION_TYPE_DEFINITION ||
        node.kind === Kind.UNION_TYPE_EXTENSION
      ) {
        for (const type of node.types) {
          typeMap.get(node.name.value).referencedTypes.add(type.name.value);
        }
      }
    },
    leave() {
      currentType = null;
    },
  };

  return {
    SchemaDefinition() {
      seenSchemaDefinition = true;
    },
    ScalarTypeDefinition: visitType,
    ObjectTypeDefinition: visitType,
    ObjectTypeExtension: visitType,
    InterfaceTypeDefinition: visitType,
    InterfaceTypeExtension: visitType,
    EnumTypeDefinition: visitType,
    EnumTypeExtension: visitType,
    InputObjectTypeDefinition: visitType,
    InputObjectExtension: visitType,
    UnionTypeDefinition: visitType,
    UnionTypeExtension: visitType,

    OperationTypeDefinition(node) {
      // Used as a root type in the schema definition
      topLevelTypes.add(node.type.name.value);
    },

    InputValueDefinition(node) {
      if (currentType) {
        // Used as an input
        typeMap
          .get(currentType)
          .referencedTypes.add(unwrapType(node.type).name.value);
      } else {
        // Used in a directive's arguments - this doesn't check whether the directive itself is used
        topLevelTypes.add(unwrapType(node.type).name.value);
      }
    },

    FieldDefinition(node) {
      // Used as the result of a field
      typeMap
        .get(currentType)
        .referencedTypes.add(unwrapType(node.type).name.value);
    },

    Document: {
      leave() {
        if (!seenSchemaDefinition) {
          // If we haven't seen a schema definition these types are used if they exist.
          topLevelTypes.add('Query');
          topLevelTypes.add('Mutation');
          topLevelTypes.add('Subscription');
        }

        // Interfaces are inverted dependencies, so we have to un-invert them here.
        for (const [typeName, { interfaces }] of typeMap.entries()) {
          for (const interfaceName of interfaces.values()) {
            typeMap.get(interfaceName).referencedTypes.add(typeName);
          }
        }

        // BFS of types to find the used ones
        const referencedTypes = new Set(topLevelTypes);
        const typeQueue = [...topLevelTypes];
        for (const typeName of typeQueue) {
          if (typeMap.has(typeName)) {
            for (const childType of typeMap
              .get(typeName)
              .referencedTypes.values()) {
              if (!referencedTypes.has(childType)) {
                referencedTypes.add(childType);
                typeQueue.push(childType);
              }
            }
          }
        }

        // For every type in the document, check if it is used.
        for (const [name, { node }] of typeMap.entries()) {
          if (!referencedTypes.has(name)) {
            context.reportError(
              new ValidationError(
                'defined-types-are-used',
                `The type \`${name}\` is defined in the ` +
                  `schema but not used anywhere.`,
                [node]
              )
            );
          }
        }
      },
    },
  };
}
