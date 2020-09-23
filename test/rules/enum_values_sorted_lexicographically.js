import { EnumValuesSortedLexicographically } from '../../src/rules/enum_values_sorted_lexicographically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('EnumValuesSortedLexicographically rule', () => {
  it('catches enums that are not sorted lexicographically', () => {
    expectFailsRule(
      EnumValuesSortedLexicographically,
      `
      enum Stage {
        ZZZ
        AAA
        AA_
        aaa
      }
    `,
      [
        {
          message:
            'The enum `Stage` should be sorted lexicographically. Expected sorting: AA_, aaa, AAA, ZZZ',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('allows enums that are sorted lexicographically ', () => {
    expectPassesRule(
      EnumValuesSortedLexicographically,
      `
      enum Stage {
        AA_
        aaa
        AAA
        ZZZ
      }
    `
    );
  });
});
