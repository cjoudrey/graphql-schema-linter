import { ValidationError } from '../validation_error';

const camelCaseTest = RegExp('^[a-z][a-zA-Z0-9]*$');

function makeCamelCase(name) {
  name = name.replace(/_+([^_])/g, (match, g1) => g1.toUpperCase());
  return name[0].toLowerCase() + name.slice(1);
}

export function FieldsAreCamelCased(context) {
  return {
    FieldDefinition(node, key, parent, path, ancestors) {
      const fieldName = node.name.value;
      if (!camelCaseTest.test(fieldName)) {
        const parentName = ancestors[ancestors.length - 1].name.value;
        context.reportError(
          new ValidationError(
            'fields-are-camel-cased',
            `The field \`${parentName}.${fieldName}\` is not camel cased.`,
            [node],
            { loc: node.name.loc, replacement: makeCamelCase(fieldName) }
          )
        );
      }
    },
  };
}
