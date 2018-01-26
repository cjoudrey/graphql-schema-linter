import { EnumValuesHaveDescriptions } from '../../src/rules/enum_values_have_descriptions';
import { expectFailsRule } from '../assertions';

describe('EnumValuesHaveDescriptions rule', () => {
  it('catches enum values that have no description', () => {
    expectFailsRule(
      EnumValuesHaveDescriptions,
      `
      type QueryRoot {
        hello: String
      }

      schema {
        query: QueryRoot
      }

      enum Status {
        DRAFT

        # Hidden
        HIDDEN

        PUBLISHED
      }
    `,
      [
        {
          message: 'The enum value `Status.DRAFT` is missing a description.',
          locations: [{ line: 11, column: 9 }],
        },
        {
          message:
            'The enum value `Status.PUBLISHED` is missing a description.',
          locations: [{ line: 16, column: 9 }],
        },
      ]
    );
  });
});
