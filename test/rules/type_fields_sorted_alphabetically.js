import { TypeFieldsSortedAlphabetically } from '../../src/rules/type_fields_sorted_alphabetically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('TypeFieldsSortedAlphabetically rule', () => {
  describe('when sortOrder is alphabetical', () => {
    it('catches enums that are not sorted alphabetically', () => {
      expectFailsRule(
        TypeFieldsSortedAlphabetically,
        `
        type Stage {
          foo: String
          Foo: String
          bar: String
        }
      `,
        [
          {
            message:
              'The fields of object type `Stage` should be sorted in alphabetical order. Expected sorting: Foo, bar, foo',
            locations: [{ line: 2, column: 9 }],
          },
        ],
        {
          rulesOptions: {
            'type-fields-sorted-alphabetically': {
              sortOrder: 'alphabetical',
            },
          },
        }
      );
    });

    it('allows enums that are sorted alphabetically ', () => {
      expectPassesRule(
        TypeFieldsSortedAlphabetically,
        `
        type Stage {
          Foo: String
          bar: String
          foo: String
        }
      `,
        {
          rulesOptions: {
            'type-fields-sorted-alphabetically': {
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
        TypeFieldsSortedAlphabetically,
        `
        type Stage {
          foo: String
          Foo: String
          bar: String
        }
      `,
        [
          {
            message:
              'The fields of object type `Stage` should be sorted in lexicographical order. Expected sorting: bar, foo, Foo',
            locations: [{ line: 2, column: 9 }],
          },
        ],
        {
          rulesOptions: {
            'type-fields-sorted-alphabetically': {
              sortOrder: 'lexicographical',
            },
          },
        }
      );
    });

    it('allows enums that are sorted lexicographically ', () => {
      expectPassesRule(
        TypeFieldsSortedAlphabetically,
        `
        type Stage {
          bar: String
          foo: String
          Foo: String
        }
      `,
        {
          rulesOptions: {
            'type-fields-sorted-alphabetically': {
              sortOrder: 'lexicographical',
            },
          },
        }
      );
    });
  });
});
