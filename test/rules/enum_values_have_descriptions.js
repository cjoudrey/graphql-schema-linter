import { EnumValuesHaveDescriptions } from '../../src/rules/enum_values_have_descriptions';
import {
  expectFailsRule,
  expectPassesRuleWithConfiguration,
} from '../assertions';

describe('EnumValuesHaveDescriptions rule', () => {
  it('catches enum values that have no description', () => {
    expectFailsRule(
      EnumValuesHaveDescriptions,
      `
      enum Status {
        DRAFT

        "Hidden"
        HIDDEN

        PUBLISHED
      }
    `,
      [
        {
          message: 'The enum value `Status.DRAFT` is missing a description.',
          locations: [{ line: 3, column: 9 }],
        },
        {
          message:
            'The enum value `Status.PUBLISHED` is missing a description.',
          locations: [{ line: 8, column: 9 }],
        },
      ]
    );
  });

  it('get descriptions correctly with commentDescriptions option', () => {
    expectPassesRuleWithConfiguration(
      EnumValuesHaveDescriptions,
      `
      enum Status {
        # Hidden
        HIDDEN
      }
    `,
      { commentDescriptions: true }
    );
  });
});
