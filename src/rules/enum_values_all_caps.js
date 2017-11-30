import { ValidationError } from '../validation_error';

export function EnumValuesAllCaps(context) {
  return {
    EnumValueDefinition(node, key, parent, path, ancestors) {
      const enumValueName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

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
