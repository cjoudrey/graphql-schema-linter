import assert from 'assert';
import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import { InputObjectValuesHaveDescriptions } from '../../src/rules/input_object_values_have_descriptions';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('InputObjectValuesHaveDescriptions rule', () => {
  it('catches input object type values that have no description', () => {
    expectFailsRule(
      InputObjectValuesHaveDescriptions,
      `
      type Query {
        hello: String
      }

      input User {
        username: String

        # Description
        withDescription: String
      }
    `,
      [
        {
          message: 'The input value `User.username` is missing a description.',
          locations: [{ line: 7, column: 9 }],
        },
      ]
    );
  });

  it('ignores arguments that have no description', () => {
    expectPassesRule(
      InputObjectValuesHaveDescriptions,
      `
      type Query {
        hello(argumentWithoutDescription: String): String
      }
    `
    );
  });
});
