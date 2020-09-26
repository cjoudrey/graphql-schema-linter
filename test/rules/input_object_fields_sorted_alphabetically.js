import { InputObjectFieldsSortedAlphabetically } from '../../src/rules/input_object_fields_sorted_alphabetically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('InputObjectFieldsSortedAlphabetically rule', () => {
  describe('when sortOrder is alphabetical', () => {
    it('catches enums that are not sorted alphabetically', () => {
      expectFailsRule(
        InputObjectFieldsSortedAlphabetically,
        `
        input Stage {
          foo: String
          bar: String
          Bar: String
        }
      `,
        [
          {
            message:
              'The fields of input type `Stage` should be sorted in alphabetical order. Expected sorting: Bar, bar, foo',
            locations: [{ line: 2, column: 9 }],
          },
        ],
        {
          rulesOptions: {
            'input-object-fields-sorted-alphabetically': {
              sortOrder: 'alphabetical',
            },
          },
        }
      );
    });

    it('allows enums that are sorted alphabetically ', () => {
      expectPassesRule(
        InputObjectFieldsSortedAlphabetically,
        `
        input Stage {
          Bar: String
          bar: String
          foo: String
        }
      `,
        {
          rulesOptions: {
            'input-object-fields-sorted-alphabetically': {
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
        InputObjectFieldsSortedAlphabetically,
        `
        input Stage {
          foo: String
          bar: String
          Bar: String
        }
      `,
        [
          {
            message:
              'The fields of input type `Stage` should be sorted in lexicographical order. Expected sorting: bar, Bar, foo',
            locations: [{ line: 2, column: 9 }],
          },
        ],
        {
          rulesOptions: {
            'input-object-fields-sorted-alphabetically': {
              sortOrder: 'lexicographical',
            },
          },
        }
      );
    });

    it('allows enums that are sorted lexicographically ', () => {
      expectPassesRule(
        InputObjectFieldsSortedAlphabetically,
        `
        input Stage {
          bar: String
          Bar: String
          foo: String
        }
      `,
        {
          rulesOptions: {
            'input-object-fields-sorted-alphabetically': {
              sortOrder: 'lexicographical',
            },
          },
        }
      );
    });
  });
});
