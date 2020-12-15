import { InterfaceFieldsSortedAlphabetically } from '../../src/rules/interface_fields_sorted_alphabetically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('InterfaceFieldsSortedAlphabetically rule', () => {
  describe('when sortOrder is alphabetical', () => {
    it('catches interface fields are not sorted alphabetically', () => {
      expectFailsRule(
        InterfaceFieldsSortedAlphabetically,
        `
        interface Error {
          b: String
          a: String
        }
      `,
        [
          {
            message:
              'The fields of interface type `Error` should be sorted in alphabetical order. Expected sorting: a, b',
            locations: [{ line: 2, column: 9 }],
            ruleName: 'interface-fields-sorted-alphabetically',
          },
        ]
      );
    });

    it('allows interfaces that are sorted alphabetically ', () => {
      expectPassesRule(
        InterfaceFieldsSortedAlphabetically,
        `
        interface Error {
          a: String
          b: String
        }
      `
      );
    });
  });

  describe('when sortOrder is lexicographical', () => {
    it('catches interface fields are not sorted lexicographically', () => {
      expectFailsRule(
        InterfaceFieldsSortedAlphabetically,
        `
        interface Error {
          ZZZ: String
          AAA: String
          AA_: String
          aaa: String
        }
      `,
        [
          {
            message:
              'The fields of interface type `Error` should be sorted in lexicographical order. Expected sorting: AA_, aaa, AAA, ZZZ',
            locations: [{ line: 2, column: 9 }],
            ruleName: 'interface-fields-sorted-alphabetically',
          },
        ],
        {
          rulesOptions: {
            'interface-fields-sorted-alphabetically': {
              sortOrder: 'lexicographical',
            },
          },
        }
      );
    });

    it('allows interfaces that are sorted lexicographically', () => {
      expectPassesRule(
        InterfaceFieldsSortedAlphabetically,
        `
        interface Error {
          AA_: String
          aaa: String
          AAA: String
          ZZZ: String
        }
      `,
        {
          rulesOptions: {
            'interface-fields-sorted-alphabetically': {
              sortOrder: 'lexicographical',
            },
          },
        }
      );
    });
  });
});
