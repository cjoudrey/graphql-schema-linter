import { TypeFieldsSortedAlphabetically } from '../../src/rules/type_fields_sorted_alphabetically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('TypeFieldsSortedAlphabetically rule', () => {
  it('catches enums that are not sorted alphabetically', () => {
    expectFailsRule(
      TypeFieldsSortedAlphabetically,
      `
      type Stage {
        foo: String
        bar: String
      }
    `,
      [
        {
          message:
            'The fields of object type `Stage` should be sorted alphabetically. Expected sorting: bar, foo',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('allows enums that are sorted alphabetically ', () => {
    expectPassesRule(
      TypeFieldsSortedAlphabetically,
      `
      type Stage {
        bar: String
        foo: String
      }
    `
    );
  });
});
