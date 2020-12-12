import { DefinedTypesAreUsed } from '../../src/rules/defined_types_are_used';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('DefinedTypesAreUsed rule', () => {
  it('catches object types that are defined but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      type A {
        a: String
      }
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('catches object types that are extended but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      type A {
        a: String
      }

      extend type A {
        b: String
      }
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('catches interface types that are defined but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      interface A {
        a: String
      }
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('catches scalar types that are defined but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      scalar A
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('catches input types that are defined but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      input A {
        a: String
      }
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('catches union types that are defined but not used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
      union A = Query
    `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('catches Query type if a custom query type is used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
        extend type Query {
          b: String
        }

        type CustomQuery {
          a: String
        }

        schema {
          query: CustomQuery,
        }
      `,
      [
        {
          message:
            'The type `Query` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 9 }],
        },
      ]
    );
  });

  it('catches Mutation type if a custom mutation type is used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
        type Mutation {
          a: String
        }

        schema {
          query: Query
          mutation: Query
        }
      `,
      [
        {
          message:
            'The type `Mutation` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 9 }],
        },
      ]
    );
  });

  it('catches Subscription type if a custom subscription type is used', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
        type Subscription {
          a: String
        }

        schema {
          query: Query
          subscription: Query
        }
      `,
      [
        {
          message:
            'The type `Subscription` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 9 }],
        },
      ]
    );
  });

  it('catches a self-referential type that is unused', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
        type A {
          a: A
        }
      `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 9 }],
        },
      ]
    );
  });

  it('catches co-referential types that are unused', () => {
    expectFailsRule(
      DefinedTypesAreUsed,
      `
        type A {
          b: B
        }

        type B {
          a: A
        }
      `,
      [
        {
          message:
            'The type `A` is defined in the schema but not used anywhere.',
          locations: [{ line: 2, column: 9 }],
        },
        {
          message:
            'The type `B` is defined in the schema but not used anywhere.',
          locations: [{ line: 6, column: 9 }],
        },
      ]
    );
  });

  it('ignores types that are a member of a union', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
      extend type Query {
        b: B
      }

      type A {
        a: String
      }

      union B = A | Query
    `
    );
  });

  it('ignores types that are a member of an extended union', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
        extend type Query {
          b: B
        }

        type A {
          a: String
        }

        union B = Query
        extend union B = A
      `
    );
  });

  it('ignores types that implement an interface that is used', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
      extend type Query {
        c: Node
      }

      interface Node {
        id: ID!
      }

      type A implements Node {
        id: ID!
      }
    `
    );
  });

  it('ignores types that implement an interface that is used in an extension', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
        extend type Query {
          c: Node
        }

        interface Node {
          id: ID!
        }

        type A {
          a: String
        }

        extend type A implements Node{
          id: ID!
        }
      `
    );
  });

  it('ignores types that are used in field definitions', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
      extend type Query {
        B: B
      }

      type B {
        id: ID!
      }
    `
    );
  });

  it('ignores scalar and input types that are used in arguments', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
      extend type Query {
        b(date: Date): String
        c(c: [C!]!): String
      }

      scalar Date

      input C {
        c: String
      }
    `
    );
  });

  it('ignores types that are used in directives', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
        directive @exampleDirective(argument1: [C!], argument2: Date) on FIELD_DEFINITION

        scalar Date

        input C {
          c: String
        }
      `
    );
  });

  it('ignores unreferenced Mutation object type', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
      type Mutation {
        a: String
      }
    `
    );
  });

  it('ignores unreferenced Subscription object type', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
      type Subscription {
        a: String
      }
    `
    );
  });

  it('ignores unreferenced Query object type', () => {
    expectPassesRule(
      DefinedTypesAreUsed,
      `
      extend type Query {
        c: String
      }
    `
    );
  });
});
