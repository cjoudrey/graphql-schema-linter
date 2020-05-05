import assert from 'assert';
import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import { InputObjectValuesHaveDescriptions } from '../../src/rules/input_object_values_have_descriptions';
import {
  expectFailsRule,
  expectPassesRule,
  expectPassesRuleWithConfiguration,
} from '../assertions';

describe('InputObjectValuesHaveDescriptions rule', () => {
  it('catches input object type values that have no description', () => {
    expectFailsRule(
      InputObjectValuesHaveDescriptions,
      `
      input User {
        username: String

        "Description"
        withDescription: String
      }
    `,
      [
        {
          message: 'The input value `User.username` is missing a description.',
          locations: [{ line: 3, column: 9 }],
        },
      ]
    );
  });

  it('ignores arguments that have no description', () => {
    expectPassesRule(
      InputObjectValuesHaveDescriptions,
      `
      type A {
        hello(argumentWithoutDescription: String): String
      }
    `
    );
  });

  it('gets descriptions correctly with commentDescriptions option', () => {
    expectPassesRuleWithConfiguration(
      InputObjectValuesHaveDescriptions,
      `
      input F {
        # F
        f: String
      }
    `,
      { commentDescriptions: true }
    );
  });
});
