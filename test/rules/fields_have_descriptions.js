import assert from 'assert';
import { parse } from 'graphql';
import { visit, visitInParallel } from 'graphql/language/visitor';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import { FieldsHaveDescriptions } from '../../src/rules/fields_have_descriptions';

describe('FieldsHaveDescriptions rule', () => {
  it('catches fields that have no description', () => {
    const ast = parse(`
      type QueryRoot {
        withoutDescription: String
        withoutDescriptionAgain: String!

        # Description
        withDescription: String
      }

      schema {
        query: QueryRoot
      }
    `);

    const schema = buildASTSchema(ast)
    const errors = validate(schema, ast, [FieldsHaveDescriptions])

    assert.equal(errors.length, 2)

    assert.equal(errors[0].message, 'The field `QueryRoot.withoutDescription` is missing a description.')
    assert.deepEqual(errors[0].locations, [{ line: 3, column: 9 }])

    assert.equal(errors[1].message, 'The field `QueryRoot.withoutDescriptionAgain` is missing a description.')
    assert.deepEqual(errors[1].locations, [{ line: 4, column: 9 }])
  });
});
