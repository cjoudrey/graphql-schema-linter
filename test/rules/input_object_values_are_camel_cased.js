import { InputObjectValuesAreCamelCased } from '../../src/rules/input_object_values_are_camel_cased';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('InputObjectValuesAreCamelCased rule', () => {
  it('catches input object type values that are not camel cased', () => {
    expectFailsRule(
      InputObjectValuesAreCamelCased,
      `
      input User {
        user_name: String

        userID: String
        withDescription: String
      }
    `,
      [
        {
          message: 'The input value `User.user_name` is not camel cased.',
          locations: [{ line: 3, column: 9 }],
        },
      ]
    );
  });

  it('catches arguments that are not camel cased', () => {
    expectFailsRule(
      InputObjectValuesAreCamelCased,
      `
      type A {
        hello(argument_without_description: String): String
      }
    `,
      [
        {
          message:
            'The input value `hello.argument_without_description` is not camel cased.',
          locations: [{ line: 3, column: 15 }],
        },
      ]
    );
  });
});
