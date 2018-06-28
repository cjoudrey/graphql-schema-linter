import { ValidationError } from '../validation_error';
import { print } from 'graphql/language/printer';

const MANDATORY_FIELDS = ['pageInfo', 'edges'];
const RULE_NAME = 'relay-connection-types-spec';

export function RelayConnectionTypesSpec(context) {
  const ensureNameDoesNotEndWithConnection = node => {
    if (node.name.value.match(/Connection$/)) {
      context.reportError(
        new ValidationError(
          RULE_NAME,
          `Types that end in \`Connection\` must be an object type as per the relay spec. \`${
            node.name.value
          }\` is not an object type.`,
          [node]
        )
      );
    }
  };

  const ensureValidObjectOrInterface = node => {
    const typeName = node.name.value;
    if (!typeName.endsWith('Connection')) {
      return;
    }
    const fieldNames = node.fields.map(field => field.name.value);
    const missingFields = MANDATORY_FIELDS.filter(
      requiredField => fieldNames.indexOf(requiredField) === -1
    );

    if (missingFields.length) {
      context.reportError(
        new ValidationError(
          RULE_NAME,
          `Connection \`${typeName}\` is missing the following field${
            missingFields.length > 1 ? 's' : ''
          }: ${missingFields.join(', ')}.`,
          [node]
        )
      );
      return;
    }

    const edgesField = node.fields.find(field => field.name.value == 'edges');
    let edgesFieldType = edgesField.type;

    if (edgesFieldType.kind == 'NonNullType') {
      edgesFieldType = edgesFieldType.type;
    }

    if (edgesFieldType.kind != 'ListType') {
      context.reportError(
        new ValidationError(
          RULE_NAME,
          `The \`${typeName}.edges\` field must return a list of edges not \`${print(
            edgesFieldType
          )}\`.`,
          [node]
        )
      );
    }

    const pageInfoField = node.fields.find(
      field => field.name.value == 'pageInfo'
    );
    const printedPageInfoFieldType = print(pageInfoField.type);

    if (printedPageInfoFieldType != 'PageInfo!') {
      context.reportError(
        new ValidationError(
          RULE_NAME,
          `The \`${typeName}.pageInfo\` field must return a non-null \`PageInfo\` object not \`${printedPageInfoFieldType}\``,
          [node]
        )
      );
    }
  };

  return {
    ScalarTypeDefinition: ensureNameDoesNotEndWithConnection,
    InterfaceTypeDefinition: ensureValidObjectOrInterface,
    UnionTypeDefinition: ensureNameDoesNotEndWithConnection,
    EnumTypeDefinition: ensureNameDoesNotEndWithConnection,
    InputObjectTypeDefinition: ensureNameDoesNotEndWithConnection,
    ObjectTypeDefinition: ensureValidObjectOrInterface,
  };
}
