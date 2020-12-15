import { InterfaceFieldsSortedAlphabetically } from '../../src/rules/interface_fields_sorted_alphabetically';
import { expectFailsRule, expectPassesRule } from '../assertions';


describe('InterfaceFieldsSortedAlphabetically rule', () => {
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
            'The fields of interface type `Error` should be sorted alphabetically. Expected sorting: a, b',
          locations: [{ line: 2, column: 7 }],
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
