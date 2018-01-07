import assert from 'assert';
import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import { InputObjectValuesHaveDescriptions } from '../../src/rules/input_object_values_have_descriptions';

describe('InputObjectValuesHaveDescriptions rule', () => {
  it('catches input object type values that have no description', () => {
    const ast = parse(`
      type Query {
        hello: String
      }

      input User {
        username: String

        # Description
        withDescription: String
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [InputObjectValuesHaveDescriptions]);

    assert.equal(errors.length, 1);

    assert.equal(errors[0].ruleName, 'input-object-values-have-descriptions');
    assert.equal(
      errors[0].message,
      'The input value `User.username` is missing a description.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 7, column: 9 }]);
  });

  it('ignores arguments that have no description', () => {
    const ast = parse(`
      type Query {
        hello(argumentWithoutDescription: String): String
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [InputObjectValuesHaveDescriptions]);

    assert.equal(errors.length, 0);
  });
});
