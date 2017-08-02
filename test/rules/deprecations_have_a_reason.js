import assert from 'assert';
import { parse } from 'graphql';
import { visit, visitInParallel } from 'graphql/language/visitor';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import rule from '../../src/rules/deprecations_have_a_reason';

describe('DeprecationsHaveAReason rule', () => {
  it('catches deprecated fields that have no deprecation reason in object types', () => {
    const ast = parse(`
      type QueryRoot {
        a: String
      }

      type A {
        deprecatedWithoutReason: String @deprecated
        deprecatedWithReason: String @deprecated(reason: "Reason")
        notDeprecated: String
      }

      schema {
        query: QueryRoot
      }
    `);

    const schema = buildASTSchema(ast)
    const errors = validate(schema, ast, [rule])

    assert.equal(errors.length, 1)

    assert.equal(errors[0].message, 'The field `A.deprecatedWithoutReason` is deprecated but has no deprecation reason.')
    assert.deepEqual(errors[0].locations, [{ line: 7, column: 9 }])
  });

  it('catches deprecated fields that have no deprecation reason in interface types', () => {
    const ast = parse(`
      type QueryRoot {
        a: String
      }

      interface A {
        deprecatedWithoutReason: String @deprecated
        deprecatedWithReason: String @deprecated(reason: "Reason")
        notDeprecated: String
      }

      schema {
        query: QueryRoot
      }
    `);

    const schema = buildASTSchema(ast)
    const errors = validate(schema, ast, [rule])

    assert.equal(errors.length, 1)

    assert.equal(errors[0].message, 'The field `A.deprecatedWithoutReason` is deprecated but has no deprecation reason.')
    assert.deepEqual(errors[0].locations, [{ line: 7, column: 9 }])
  });

  it('catches deprecated enum values that have no deprecation reason', () => {
    const ast = parse(`
      type QueryRoot {
        a: String
      }

      enum A {
        deprecatedWithoutReason @deprecated
        deprecatedWithReason @deprecated(reason: "Reason")
        notDeprecated
      }

      schema {
        query: QueryRoot
      }
    `);

    const schema = buildASTSchema(ast)
    const errors = validate(schema, ast, [rule])

    assert.equal(errors.length, 1)

    assert.equal(errors[0].message, 'The enum value `A.deprecatedWithoutReason` is deprecated but has no deprecation reason.')
    assert.deepEqual(errors[0].locations, [{ line: 7, column: 9 }])
  });

});
