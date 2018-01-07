import assert from 'assert';
import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import { InputObjectValuesAreCamelCased } from '../../src/rules/input_object_values_are_camelcased';

describe('InputObjectValuesAreCamelCased rule', () => {
  it('catches input object type values that are not camel cased', () => {
    const ast = parse(`
      type Query {
        hello: String
      }

      input User {
        user_name: String

        withDescription: String
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [InputObjectValuesAreCamelCased]);

    assert.equal(errors.length, 1);

    assert.equal(errors[0].ruleName, 'input-object-values-are-camelcased');
    assert.equal(
      errors[0].message,
      'The input value `User.user_name` is not camel cased.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 7, column: 9 }]);
  });

  it('catches arguments that are not camel cased', () => {
    const ast = parse(`
      type Query {
        hello(argument_without_description: String): String
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [InputObjectValuesAreCamelCased]);

    assert.equal(errors.length, 1);

    assert.equal(errors[0].ruleName, 'input-object-values-are-camelcased');
    assert.equal(
      errors[0].message,
      'The input value `hello.argument_without_description` is not camel cased.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 3, column: 15 }]);
  });
});
