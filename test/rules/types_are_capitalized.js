import { TypesAreCapitalized } from '../../src/rules/types_are_capitalized';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('TypesAreCapitalized rule', () => {
  it('catches object types that are not capitalized', () => {
    expectFailsRule(
      TypesAreCapitalized,
      `
      type QueryRoot {
        a: String
      }

      type a {
        a: String
      }

      schema {
        query: QueryRoot
      }
    `,
      [
        {
          message: 'The object type `a` should start with a capital letter.',
          locations: [{ line: 6, column: 12 }],
        },
      ]
    );
  });

  it('catches interface types that are not capitalized', () => {
    expectFailsRule(
      TypesAreCapitalized,
      `
      type QueryRoot {
        a: String
      }

      interface a {
        a: String
      }

      schema {
        query: QueryRoot
      }
    `,
      [
        {
          message: 'The interface type `a` should start with a capital letter.',
          locations: [{ line: 6, column: 17 }],
        },
      ]
    );
  });
});
