import { ValidationError } from '../validation_error';
import { print } from 'graphql/language/printer';

export function RelayPageInfoSpec(context) {
  return {
    Document: {
      leave: function (node) {
        const pageInfoType = context.getSchema().getType('PageInfo');

        if (!pageInfoType) {
          return context.reportError(
            new ValidationError(
              'relay-page-info-spec',
              'A `PageInfo` object type is required as per the Relay spec.',
              [node]
            )
          );
        }

        const pageInfoFields = pageInfoType.getFields();

        const hasPreviousPageField = pageInfoFields['hasPreviousPage'];

        if (!hasPreviousPageField) {
          context.reportError(
            new ValidationError(
              'relay-page-info-spec',
              'The `PageInfo` object type must have a `hasPreviousPage` field that returns a non-null Boolean as per the Relay spec.',
              [pageInfoType.astNode]
            )
          );
        } else if (hasPreviousPageField.type != 'Boolean!') {
          context.reportError(
            new ValidationError(
              'relay-page-info-spec',
              'The `PageInfo` object type must have a `hasPreviousPage` field that returns a non-null Boolean as per the Relay spec.',
              [hasPreviousPageField.astNode]
            )
          );
        }

        const hasNextPageField = pageInfoFields['hasNextPage'];

        if (!hasNextPageField) {
          context.reportError(
            new ValidationError(
              'relay-page-info-spec',
              'The `PageInfo` object type must have a `hasNextPage` field that returns a non-null Boolean as per the Relay spec.',
              [pageInfoType.astNode]
            )
          );
        } else if (hasNextPageField.type != 'Boolean!') {
          context.reportError(
            new ValidationError(
              'relay-page-info-spec',
              'The `PageInfo` object type must have a `hasNextPage` field that returns a non-null Boolean as per the Relay spec.',
              [hasNextPageField.astNode]
            )
          );
        }
      },
    },
  };
}
