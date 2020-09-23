import { InputObjectFieldsSortedLexicographically } from '../../src/rules/input_object_fields_sorted_lexicographically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('InputObjectFieldsSortedLexicographically rule', () => {
  it('catches enums that are not sorted lexicographically', () => {
    expectFailsRule(
      InputObjectFieldsSortedLexicographically,
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
            'The fields of input type `Stage` should be sorted lexicographically. Expected sorting: bar, Bar, foo',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('allows enums that are sorted lexicographically ', () => {
    expectPassesRule(
      InputObjectFieldsSortedLexicographically,
      `
      input Stage {
        bar: String
        Bar: String
        foo: String
      }
    `
    );
  });
});
