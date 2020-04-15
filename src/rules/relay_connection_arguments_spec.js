import { ValidationError } from '../validation_error';

function unwrapType(type) {
  if (type.kind == 'NonNullType') {
    return type.type;
  } else {
    return type;
  }
}

export function RelayConnectionArgumentsSpec(context) {
  return {
    FieldDefinition(node) {
      const fieldType = unwrapType(node.type);
      if (
        fieldType.kind != 'NamedType' ||
        !fieldType.name.value.endsWith('Connection')
      ) {
        return;
      }

      const firstArgument = node.arguments.find((argument) => {
        return argument.name.value == 'first';
      });
      const afterArgument = node.arguments.find((argument) => {
        return argument.name.value == 'after';
      });
      const hasForwardPagination = firstArgument && afterArgument;

      const lastArgument = node.arguments.find((argument) => {
        return argument.name.value == 'last';
      });
      const beforeArgument = node.arguments.find((argument) => {
        return argument.name.value == 'before';
      });
      const hasBackwardPagination = lastArgument && beforeArgument;

      if (!hasForwardPagination && !hasBackwardPagination) {
        return context.reportError(
          new ValidationError(
            'relay-connection-arguments-spec',
            'A field that returns a Connection Type must include forward pagination arguments (`first` and `after`), backward pagination arguments (`last` and `before`), or both as per the Relay spec.',
            [node]
          )
        );
      }

      if (firstArgument) {
        if (hasBackwardPagination) {
          // first and last must be nullable if both forward and backward pagination are supported.
          if (
            firstArgument.type.kind != 'NamedType' ||
            firstArgument.type.name.value != 'Int'
          ) {
            return context.reportError(
              new ValidationError(
                'relay-connection-arguments-spec',
                'Fields that support forward and backward pagination must include a `first` argument that takes a nullable non-negative integer as per the Relay spec.',
                [firstArgument]
              )
            );
          }
        } else {
          // first can be non-nullable if only forward pagination is supported.
          const type = unwrapType(firstArgument.type);
          if (type.kind != 'NamedType' || type.name.value != 'Int') {
            return context.reportError(
              new ValidationError(
                'relay-connection-arguments-spec',
                'Fields that support forward pagination must include a `first` argument that takes a non-negative integer as per the Relay spec.',
                [firstArgument]
              )
            );
          }
        }
      }

      if (lastArgument) {
        if (hasForwardPagination) {
          // first and last must be nullable if both forward and backward pagination are supported.
          if (
            lastArgument.type.kind != 'NamedType' ||
            lastArgument.type.name.value != 'Int'
          ) {
            return context.reportError(
              new ValidationError(
                'relay-connection-arguments-spec',
                'Fields that support forward and backward pagination must include a `last` argument that takes a nullable non-negative integer as per the Relay spec.',
                [lastArgument]
              )
            );
          }
        } else {
          // last can be non-nullable if only backward pagination is supported.
          const type = unwrapType(lastArgument.type);
          if (type.kind != 'NamedType' || type.name.value != 'Int') {
            return context.reportError(
              new ValidationError(
                'relay-connection-arguments-spec',
                'Fields that support backward pagination must include a `last` argument that takes a non-negative integer as per the Relay spec.',
                [lastArgument]
              )
            );
          }
        }
      }
    },
  };
}
