import { InputObjectFieldsSortedAlphabetically } from '../../src/rules/input_object_fields_sorted_alphabetically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('InputObjectFieldsSortedAlphabetically rule', () => {
  it('catches enums that are not sorted alphabetically', () => {
    expectFailsRule(
      InputObjectFieldsSortedAlphabetically,
      `
      input Stage {
        foo: String
        bar: String
      }
    `,
      [
        {
          message:
            'The fields of input type `Stage` should be sorted alphabetically. Expected sorting: bar, foo',
          locations: [{ line: 2, column: 7 }],
        },
      ],
      `
      input Stage {
        bar: String
        foo: String
      }
    `
    );
  });

  it('allows enums that are sorted alphabetically ', () => {
    expectPassesRule(
      InputObjectFieldsSortedAlphabetically,
      `
      input Stage {
        bar: String
        foo: String
      }
    `
    );
  });
});
