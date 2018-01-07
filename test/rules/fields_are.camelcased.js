import assert from 'assert';
import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import { FieldsAreCamelCased } from '../../src/rules/fields_are_camelcased';

describe('FieldsAreCamelCased rule', () => {
  it('catches fields that have are not camelcased', () => {
    const ast = parse(`
      type Query {
        # Invalid
        invalid_name: String
      
        # Valid
        thisIsValid: String
        
        # Invalid
        ThisIsInvalid: String
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [FieldsAreCamelCased]);

    assert.equal(errors.length, 2);

    assert.equal(errors[0].ruleName, 'fields-are-camelcased');
    assert.equal(
      errors[0].message,
      'The field `Query.invalid_name` is not camel cased.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 4, column: 9 }]);

    assert.equal(errors[1].ruleName, 'fields-are-camelcased');
    assert.equal(
      errors[1].message,
      'The field `Query.ThisIsInvalid` is not camel cased.'
    );
    assert.deepEqual(errors[1].locations, [{ line: 10, column: 9 }]);
  });
});
