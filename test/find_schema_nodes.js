import assert from 'assert';
import { parse } from 'graphql';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';
import { findSchemaNodes } from '../src/find_schema_nodes';

describe('findSchemaNodes', () => {
  it('works', () => {
    const ast = parse(`
      type Query {
        foo: Foo!
        fizz: Fizz
        blem: Blem
      }

      scalar Blem

      interface Fizz {
        buzz(buzzFizz: String!, fizzBuzz: Int): Int
      }

      type Foo {
        bar(blem: Int!): String
      }
    `);

    const schema = buildASTSchema(ast, {
      commentDescriptions: false,
      assumeValidSDL: true,
      assumeValid: true,
    });

    // Helper method is used because the output is too noisy
    // with all those aux AST nodes like Name and NotNullType
    const test = ({ scopes, expected }) => {
      assert.deepEqual(findFiltered(scopes), expected);
    };

    const findFiltered = (scopes) => {
      const raw = findSchemaNodes(scopes, schema);
      const filtered = [];
      for (const node of raw) {
        if (node.kind.endsWith('Definition')) {
          filtered.push(`${node.kind} : ${node.name.value}`);
        }
      }
      filtered.sort();
      return filtered;
    };

    test({
      scopes: ['Query'],
      expected: [
        'FieldDefinition : blem',
        'FieldDefinition : fizz',
        'FieldDefinition : foo',
        'ObjectTypeDefinition : Query',
      ],
    });

    test({
      scopes: ['Query.foo', 'Query.blem'],
      expected: ['FieldDefinition : blem', 'FieldDefinition : foo'],
    });

    test({
      scopes: ['Blem'],
      expected: ['ScalarTypeDefinition : Blem'],
    });

    test({
      scopes: ['Fizz.buzz'],
      expected: [
        'FieldDefinition : buzz',
        'InputValueDefinition : buzzFizz',
        'InputValueDefinition : fizzBuzz',
      ],
    });

    test({
      scopes: ['Fizz.buzz.fizzBuzz'],
      expected: ['InputValueDefinition : fizzBuzz'],
    });
  });
});
