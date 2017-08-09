import assert from 'assert';
import { parse } from 'graphql';
import { visit, visitInParallel } from 'graphql/language/visitor';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import { TypesAreCapitalized } from '../../src/rules/types_are_capitalized';

describe('TypesAreCapitalized rule', () => {
  it('catches object types that are not capitalized', () => {
    const ast = parse(`
      type QueryRoot {
        a: String
      }

      type a {
        a: String
      }

      schema {
        query: QueryRoot
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [TypesAreCapitalized]);

    assert.equal(errors.length, 1);

    assert.equal(
      errors[0].message,
      'The object type `a` should start with a capital letter.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 6, column: 7 }]);
  });

  it('catches interface types that are not capitalized', () => {
    const ast = parse(`
      type QueryRoot {
        a: String
      }

      interface a {
        a: String
      }

      schema {
        query: QueryRoot
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [TypesAreCapitalized]);

    assert.equal(errors.length, 1);

    assert.equal(
      errors[0].message,
      'The interface type `a` should start with a capital letter.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 6, column: 7 }]);
  });
});
