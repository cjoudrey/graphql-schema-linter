import assert from 'assert';
import { parse } from 'graphql';
import { visit, visitInParallel } from 'graphql/language/visitor';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import { EnumValuesHaveDescriptions } from '../../src/rules/enum_values_have_descriptions';

describe('EnumValuesHaveDescriptions rule', () => {
  it('catches enum values that have no description', () => {
    const ast = parse(`
      type QueryRoot {
        hello: String
      }

      schema {
        query: QueryRoot
      }

      enum Status {
        DRAFT

        # Hidden
        HIDDEN

        PUBLISHED
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [EnumValuesHaveDescriptions]);

    assert.equal(errors.length, 2);

    assert.equal(
      errors[0].message,
      'The enum value `Status.DRAFT` is missing a description.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 11, column: 9 }]);

    assert.equal(
      errors[1].message,
      'The enum value `Status.PUBLISHED` is missing a description.'
    );
    assert.deepEqual(errors[1].locations, [{ line: 16, column: 9 }]);
  });
});
