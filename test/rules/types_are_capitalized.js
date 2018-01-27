import { TypesAreCapitalized } from '../../src/rules/types_are_capitalized';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('TypesAreCapitalized rule', () => {
  it('catches object types that are not capitalized', () => {
    expectFailsRule(
      TypesAreCapitalized,
      `
      type a {
        a: String
      }
    `,
      [
        {
          message: 'The object type `a` should start with a capital letter.',
          locations: [{ line: 2, column: 12 }],
        },
      ]
    );
  });

  it('catches interface types that are not capitalized', () => {
    expectFailsRule(
      TypesAreCapitalized,
      `
      interface a {
        a: String
      }
    `,
      [
        {
          message: 'The interface type `a` should start with a capital letter.',
          locations: [{ line: 2, column: 17 }],
        },
      ]
    );
  });
});
