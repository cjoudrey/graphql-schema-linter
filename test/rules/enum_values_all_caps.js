import { EnumValuesAllCaps } from '../../src/rules/enum_values_all_caps';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('EnumValuesAllCaps rule', () => {
  it('catches enums that are lower case', () => {
    expectFailsRule(
      EnumValuesAllCaps,
      `
      enum Stage {
        aaa
        bbb_bbb
      }
    `,
      [
        {
          message: 'The enum value `Stage.aaa` should be uppercase.',
          locations: [{ line: 3, column: 9 }],
        },
        {
          message: 'The enum value `Stage.bbb_bbb` should be uppercase.',
          locations: [{ line: 4, column: 9 }],
        },
      ]
    );
  });

  it('allows enums that are uppercase, numbers allowed ', () => {
    expectPassesRule(
      EnumValuesAllCaps,
      `
      enum Stage {
        FOO
        FOO_BAR
        FOO_BAR_1
      }
    `
    );
  });
});
