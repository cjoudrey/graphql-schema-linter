import { ValidationError } from '../validation_error';
const MANDATORY_FIELDS = ['pageInfo', 'edges'];

export function RelayConnectionsHaveFields(context) {
  return {
    ObjectTypeDefinition(node) {
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
            'relay-connections-have-fields',
            `Connection \`${typeName}\` is missing the following field${missingFields.length >
            1
              ? 's'
              : ''}: ${missingFields.join(', ')}.`,
            [node]
          )
        );
      }
    },
  };
}
