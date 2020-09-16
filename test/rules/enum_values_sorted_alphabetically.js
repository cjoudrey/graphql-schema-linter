import { EnumValuesSortedAlphabetically } from '../../src/rules/enum_values_sorted_alphabetically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('EnumValuesSortedAlphabetically rule', () => {
  it('catches enums that are not sorted alphabetically', () => {
    expectFailsRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage {
        ZZZ
        AAA
      }
    `,
      [
        {
          message:
            'The enum `Stage` should be sorted alphabetically. Expected sorting: AAA, ZZZ',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('allows enums that are sorted alphabetically ', () => {
    expectPassesRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage {
        AAA
        ZZZ
      }
    `
    );
  });

  it('sorts enum values with underscores first', () => {
    expectPassesRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage {
        AA_
        AAA
        ZZZ
      }
    `
    );
  });
});
