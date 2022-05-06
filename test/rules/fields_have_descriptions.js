import { version } from 'graphql';
import { FieldsHaveDescriptions } from '../../src/rules/fields_have_descriptions';
import {
  expectFailsRule,
  expectPassesRuleWithConfiguration,
} from '../assertions';

const itPotentially = version.startsWith('15.') ? it : it.skip;

describe('FieldsHaveDescriptions rule', () => {
  it('catches fields that have no description', () => {
    expectFailsRule(
      FieldsHaveDescriptions,
      `
      type A {
        withoutDescription: String
        withoutDescriptionAgain: String!

        "Description"
        withDescription: String
      }
    `,
      [
        {
          message: 'The field `A.withoutDescription` is missing a description.',
          locations: [{ line: 3, column: 9 }],
        },
        {
          message:
            'The field `A.withoutDescriptionAgain` is missing a description.',
          locations: [{ line: 4, column: 9 }],
        },
      ]
    );
  });

  itPotentially(
    'gets descriptions correctly with commentDescriptions option',
    () => {
      expectPassesRuleWithConfiguration(
        FieldsHaveDescriptions,
        `
      type A {
        "Description"
        withDescription: String
      }
    `,
        { commentDescriptions: true }
      );
    }
  );
});
