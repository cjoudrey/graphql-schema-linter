import { ValidationError } from '../validation_error';

export function EnumValuesAllCaps(context) {
  var isFixable = true;
  return {
    EnumValueDefinition(node, key, parent, path, ancestors) {
      const enumValueName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;
      const isFixable = true;

      if (enumValueName !== enumValueName.toUpperCase()) {
        context.reportError(
          new ValidationError(
            'enum-values-all-caps',
            `The enum value \`${parentName}.${enumValueName}\` should be uppercase.`,
            [node]
          )
        );
      }
    },
  };
}
