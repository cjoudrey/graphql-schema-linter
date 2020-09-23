import { TypeFieldsSortedLexicographically } from '../../src/rules/type_fields_sorted_lexicographically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('TypeFieldsSortedLexicographically rule', () => {
  it('catches enums that are not sorted lexicographically', () => {
    expectFailsRule(
      TypeFieldsSortedLexicographically,
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
            'The fields of object type `Stage` should be sorted lexicographically. Expected sorting: bar, foo, Foo',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('allows enums that are sorted lexicographically ', () => {
    expectPassesRule(
      TypeFieldsSortedLexicographically,
      `
      type Stage {
        bar: String
        foo: String
        Foo: String
      }
    `
    );
  });
});
