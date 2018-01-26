import { DefinedTypesAreUsed } from '../../src/rules/defined_types_are_used';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('DefinedTypesAreUsed rule', () => {
  it('catches object types that are defined but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      type Query {
        a: String
      }

      type A {
        a: String
      }
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 6, column: 7 }],
        },
      ]
    );
  });

  it('catches interface types that are defined but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      type Query {
        a: String
      }

      interface A {
        a: String
      }
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 6, column: 7 }],
        },
      ]
    );
  });

  it('catches scalar types that are defined but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      type Query {
        a: String
      }

      scalar A
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 6, column: 7 }],
        },
      ]
    );
  });

  it('catches input types that are defined but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      type Query {
        a: String
      }

      input A {
        a: String
      }
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 6, column: 7 }],
        },
      ]
    );
  });

  it('catches union types that are defined but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      type Query {
        a: String
      }

      union A = Query
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 6, column: 7 }],
        },
      ]
    );
  });

  it('ignores types that are a member of a union', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
      type Query {
        a: B
      }

      type A {
        a: A
      }

      union B = A | Query
    `
    );
  });

  it('ignores types that implement an interface that is used', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
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
    `
    );
  });

  it('ignores types that are used in field definitions', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
      type Query {
        a: A
      }

      type A {
        id: ID!
      }
    `
    );
  });

  it('ignores scalar and input types that are used in arguments', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
      type Query {
        a(date: Date): String
        b(b: B): String
      }

      scalar Date

      input B {
        b: String
      }
    `
    );
  });
});
