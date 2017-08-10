import assert from 'assert';
import { parse } from 'graphql';
import { visit, visitInParallel } from 'graphql/language/visitor';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import { DefinedTypesAreUsed } from '../../src/rules/defined_types_are_used';

describe('DefinedTypesAreUsed rule', () => {
  it('catches object types that are defined but not used', () => {
    const ast = parse(`
      type Query {
        a: String
      }

      type A {
        a: String
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [DefinedTypesAreUsed]);

    assert.equal(errors.length, 1);

    assert.equal(
      errors[0].message,
      'The type `A` is defined in the schema but not used anywhere.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 6, column: 7 }]);
  });

  it('catches interface types that are defined but not used', () => {
    const ast = parse(`
      type Query {
        a: String
      }

      interface A {
        a: String
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [DefinedTypesAreUsed]);

    assert.equal(errors.length, 1);

    assert.equal(
      errors[0].message,
      'The type `A` is defined in the schema but not used anywhere.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 6, column: 7 }]);
  });

  it('catches scalar types that are defined but not used', () => {
    const ast = parse(`
      type Query {
        a: String
      }

      scalar A
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [DefinedTypesAreUsed]);

    assert.equal(errors.length, 1);

    assert.equal(
      errors[0].message,
      'The type `A` is defined in the schema but not used anywhere.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 6, column: 7 }]);
  });

  it('catches input types that are defined but not used', () => {
    const ast = parse(`
      type Query {
        a: String
      }

      input A {
        a: String
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [DefinedTypesAreUsed]);

    assert.equal(errors.length, 1);

    assert.equal(
      errors[0].message,
      'The type `A` is defined in the schema but not used anywhere.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 6, column: 7 }]);
  });

  it('catches union types that are defined but not used', () => {
    const ast = parse(`
      type Query {
        a: String
      }

      union A = Query
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [DefinedTypesAreUsed]);

    assert.equal(errors.length, 1);

    assert.equal(
      errors[0].message,
      'The type `A` is defined in the schema but not used anywhere.'
    );
    assert.deepEqual(errors[0].locations, [{ line: 6, column: 7 }]);
  });

  it('ignores types that are a member of a union', () => {
    const ast = parse(`
      type Query {
        a: B
      }

      type A {
        a: A
      }

      union B = A | Query
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [DefinedTypesAreUsed]);

    assert.equal(errors.length, 0);
  });

  it('ignores types that implement an interface that is used', () => {
    const ast = parse(`
      type Query {
        a: Node
      }

      interface Node {
        id: ID!
      }

      type A implements Node {
        id: ID!
        a: A
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [DefinedTypesAreUsed]);

    assert.equal(errors.length, 0);
  });

  it('ignores types that are used in field definitions', () => {
    const ast = parse(`
      type Query {
        a: A
      }

      type A {
        id: ID!
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [DefinedTypesAreUsed]);

    assert.equal(errors.length, 0);
  });

  it('ignores scalar and input types that are used in arguments', () => {
    const ast = parse(`
      type Query {
        a(date: Date): String
        b(b: B): String
      }

      scalar Date

      input B {
        b: String
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [DefinedTypesAreUsed]);

    assert.equal(errors.length, 0);
  });
});
