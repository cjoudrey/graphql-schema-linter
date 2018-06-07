import { ValidationError } from '../validation_error';

export function EnumValuesSortedAlphabetically(context) {
  var isFixable = true;
  return {
    EnumTypeDefinition: function EnumTypeDefinition(
      node,
      key,
      parent,
      path,
      ancestors
    ) {
      var enumValues = node.values.map(val => {
        return val.name.value;
      });

      if (!arraysEqual(enumValues, enumValues.slice().sort())) {
        context.reportError(
          new ValidationError(
            'enum-values-sorted-alphabetically',
            'The enum `' +
              node.name.value +
              '` should be sorted alphabetically.',
            [node]
          )
        );
      }
    },
  };
}

function arraysEqual(a, b) {
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
