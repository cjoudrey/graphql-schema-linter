import { FieldsAreCamelCased } from '../../src/rules/fields_are_camel_cased';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('FieldsAreCamelCased rule', () => {
  it('catches fields that have are not camelcased', () => {
    expectFailsRule(
      FieldsAreCamelCased,
      `
      type A {
        # Invalid
        invalid_name: String

        # Valid
        thisIsValid: String

        # Valid
        thisIDIsValid: String

        # Invalid
        ThisIsInvalid: String
      }

      interface Something {
        # Invalid
        invalid_name: String

        # Valid
        thisIsValid: String

        # Valid
        thisIDIsValid: String
      }
    `,
      [
        {
          message: 'The field `A.invalid_name` is not camel cased.',
          locations: [{ line: 4, column: 9 }],
        },
        {
          message: 'The field `A.ThisIsInvalid` is not camel cased.',
          locations: [{ line: 13, column: 9 }],
        },
        {
          message: 'The field `Something.invalid_name` is not camel cased.',
          locations: [{ line: 18, column: 9 }],
        },
      ]
    );
  });
});
