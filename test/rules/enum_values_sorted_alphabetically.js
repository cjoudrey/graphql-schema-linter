import { EnumValuesSortedAlphabetically } from '../../src/rules/enum_values_sorted_alphabetically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('EnumValuesSortedAlphabetically rule', () => {
  describe('when sortOrder is alphabetical', () => {
    it('catches enums that are not sorted alphabetically', () => {
      expectFailsRule(
        EnumValuesSortedAlphabetically,
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
              'The enum `Stage` should be sorted in alphabetical order. Expected sorting: AAA, AA_, ZZZ, aaa',
            locations: [{ line: 2, column: 9 }],
          },
        ],
        {
          rulesOptions: {
            'enum-values-sorted-alphabetically': {
              sortOrder: 'alphabetical',
            },
          },
        }
      );
    });

    it('allows enums that are sorted alphabetically ', () => {
      expectPassesRule(
        EnumValuesSortedAlphabetically,
        `
        enum Stage {
          AAA
          AA_
          ZZZ
          aaa
        }
      `,
        {
          rulesOptions: {
            'enum-values-sorted-alphabetically': {
              sortOrder: 'alphabetical',
            },
          },
        }
      );
    });
  });

  describe('when sortOrder is lexicographical', () => {
    it('catches enums that are not sorted lexicographically', () => {
      expectFailsRule(
        EnumValuesSortedAlphabetically,
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
              'The enum `Stage` should be sorted in lexicographical order. Expected sorting: AA_, aaa, AAA, ZZZ',
            locations: [{ line: 2, column: 9 }],
          },
        ],
        {
          rulesOptions: {
            'enum-values-sorted-alphabetically': {
              sortOrder: 'lexicographical',
            },
          },
        }
      );
    });

    it('allows enums that are sorted lexicographically ', () => {
      expectPassesRule(
        EnumValuesSortedAlphabetically,
        `
          enum Stage {
            AA_
            aaa
            AAA
            ZZZ
          }
        `,
        {
          rulesOptions: {
            'enum-values-sorted-alphabetically': {
              sortOrder: 'lexicographical',
            },
          },
        }
      );
    });
  });
});
