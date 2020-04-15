import { ValidationError } from '../validation_error';
import { print } from 'graphql/language/printer';

const MANDATORY_FIELDS = ['pageInfo', 'edges'];

export function RelayConnectionTypesSpec(context) {
  var ensureNameDoesNotEndWithConnection = (node) => {
    if (node.name.value.match(/Connection$/)) {
      context.reportError(
        new ValidationError(
          'relay-connection-types-spec',
          `Types that end in \`Connection\` must be an object type as per the relay spec. \`${node.name.value}\` is not an object type.`,
          [node]
        )
      );
    }
  };

  return {
    ScalarTypeDefinition: ensureNameDoesNotEndWithConnection,
    InterfaceTypeDefinition: ensureNameDoesNotEndWithConnection,
    UnionTypeDefinition: ensureNameDoesNotEndWithConnection,
    EnumTypeDefinition: ensureNameDoesNotEndWithConnection,
    InputObjectTypeDefinition: ensureNameDoesNotEndWithConnection,
    ObjectTypeDefinition(node) {
      const typeName = node.name.value;
      if (!typeName.endsWith('Connection')) {
        return;
      }
      const fieldNames = node.fields.map((field) => field.name.value);
      const missingFields = MANDATORY_FIELDS.filter(
        (requiredField) => fieldNames.indexOf(requiredField) === -1
      );

      if (missingFields.length) {
        context.reportError(
          new ValidationError(
            'relay-connection-types-spec',
            `Connection \`${typeName}\` is missing the following field${
              missingFields.length > 1 ? 's' : ''
            }: ${missingFields.join(', ')}.`,
            [node]
          )
        );
        return;
      }

      const edgesField = node.fields.find(
        (field) => field.name.value == 'edges'
      );
      var edgesFieldType = edgesField.type;

      if (edgesFieldType.kind == 'NonNullType') {
        edgesFieldType = edgesFieldType.type;
      }

      if (edgesFieldType.kind != 'ListType') {
        context.reportError(
          new ValidationError(
            'relay-connection-types-spec',
            `The \`${typeName}.edges\` field must return a list of edges not \`${print(
              edgesFieldType
            )}\`.`,
            [node]
          )
        );
      }

      const pageInfoField = node.fields.find(
        (field) => field.name.value == 'pageInfo'
      );
      const printedPageInfoFieldType = print(pageInfoField.type);

      if (printedPageInfoFieldType != 'PageInfo!') {
        context.reportError(
          new ValidationError(
            'relay-connection-types-spec',
            `The \`${typeName}.pageInfo\` field must return a non-null \`PageInfo\` object not \`${printedPageInfoFieldType}\``,
            [node]
          )
        );
      }
    },
  };
}
