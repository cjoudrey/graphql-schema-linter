import assert from 'assert';
import { parse } from 'graphql';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';
import { findSchemaNodes } from '../src/find_schema_nodes';

describe('findSchemaNodes', () => {
  it('returns relevant AST nodes given object as a scope', () => {
    test({
      scopes: ['Query'],
      expected: [
        'FieldDefinition : blem',
        'FieldDefinition : fizz',
        'FieldDefinition : foo',
        'ObjectTypeDefinition : Query',
      ],
    });
  });

  it('returns relevant AST nodes given field as a scope', () => {
    test({
      scopes: ['Fizz.buzz'],
      expected: [
        'FieldDefinition : buzz',
        'InputValueDefinition : buzzFizz',
        'InputValueDefinition : fizzBuzz',
      ],
    });
  });

  it('returns combined list of AST nodes given multiple scopes', () => {
    test({
      scopes: ['Query.foo', 'Query.blem'],
      expected: ['FieldDefinition : blem', 'FieldDefinition : foo'],
    });
  });

  it('returns relevant AST nodes given parameter as a scope', () => {
    test({
      scopes: ['Fizz.buzz.fizzBuzz'],
      expected: ['InputValueDefinition : fizzBuzz'],
    });
  });

  it('returns relevant AST nodes given scalar type as a scope', () => {
    test({
      scopes: ['Blem'],
      expected: ['ScalarTypeDefinition : Blem'],
    });
  });

  it('returns relevant AST nodes given enum as a scope', () => {
    test({
      scopes: ['Episode'],
      expected: [
        'EnumTypeDefinition : Episode',
        'EnumValueDefinition : EMPIRE',
        'EnumValueDefinition : JEDI',
        'EnumValueDefinition : NEWHOPE',
      ],
    });
  });

  it('returns relevant AST nodes given enum value as a scope', () => {
    test({
      scopes: ['Episode.NEWHOPE'],
      expected: ['EnumValueDefinition : NEWHOPE'],
    });
  });

  it('returns relevant AST nodes given input type as a scope', () => {
    test({
      scopes: ['ReviewInput'],
      expected: [
        'InputObjectTypeDefinition : ReviewInput',
        'InputValueDefinition : commentary',
        'InputValueDefinition : stars',
      ],
    });
  });

  it('returns relevant AST nodes given input type field as a scope', () => {
    test({
      scopes: ['ReviewInput.commentary'],
      expected: ['InputValueDefinition : commentary'],
    });
  });

  it('returns relevant AST nodes given interface as a scope', () => {
    test({
      scopes: ['Character'],
      expected: [
        'FieldDefinition : id',
        'FieldDefinition : name',
        'InterfaceTypeDefinition : Character',
      ],
    });
  });

  it('returns relevant AST nodes given interface field as a scope', () => {
    test({
      scopes: ['Character.name'],
      expected: ['FieldDefinition : name'],
    });
  });

  it('returns relevant AST nodes given union as a scope', () => {
    test({
      scopes: ['SomeUnion'],
      expected: ['UnionTypeDefinition : SomeUnion'],
    });
  });

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

    enum Episode {
      NEWHOPE
      EMPIRE
      JEDI
    }

    input ReviewInput {
      stars: Int!
      commentary: String
    }

    interface Character {
      id: ID!
      name: String!
    }

    union SomeUnion = Fizz | Foo
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
});
