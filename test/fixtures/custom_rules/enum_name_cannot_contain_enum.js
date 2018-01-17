import { ValidationError } from '../../../src/validation_error';

export function EnumNameCannotContainEnum(context) {
  return {
    EnumValueDefinition(node, key, parent, path, ancestors) {
      const enumValueName = node.name.value;
      const parentName = ancestors[ancestors.length - 1].name.value;

      if (enumValueName.toUpperCase().indexOf('ENUM') >= 0) {
        context.reportError(
          new ValidationError(
            'enum-name-cannot-contain-enum',
            `The enum value \`${parentName}.${
              enumValueName
            }\` cannot include the word 'enum'.`,
            [node]
          )
        );
      }
    },
  };
}
