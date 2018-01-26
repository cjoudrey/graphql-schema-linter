import { FieldsHaveDescriptions } from '../../src/rules/fields_have_descriptions';
import { expectFailsRule } from '../assertions';

describe('FieldsHaveDescriptions rule', () => {
  it('catches fields that have no description', () => {
    expectFailsRule(
      FieldsHaveDescriptions,
      `
      type QueryRoot {
        withoutDescription: String
        withoutDescriptionAgain: String!

        # Description
        withDescription: String
      }

      schema {
        query: QueryRoot
      }
    `,
      [
        {
          message:
            'The field `QueryRoot.withoutDescription` is missing a description.',
          locations: [{ line: 3, column: 9 }],
        },
        {
          message:
            'The field `QueryRoot.withoutDescriptionAgain` is missing a description.',
          locations: [{ line: 4, column: 9 }],
        },
      ]
    );
  });
});
