import { TypesHaveDescriptions } from '../../src/rules/types_have_descriptions';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('TypesHaveDescriptions rule', () => {
  it('catches enum types that have no description', () => {
    expectFailsRule(
      TypesHaveDescriptions,
      `
      # Query
      type QueryRoot {
        a: String
      }

      enum STATUS {
        DRAFT
        PUBLISHED
        HIDDEN
      }

      schema {
        query: QueryRoot
      }
    `,
      [
        {
          message: 'The enum type `STATUS` is missing a description.',
          locations: [{ line: 7, column: 7 }],
        },
      ]
    );
  });

  it('catches scalar types that have no description', () => {
    expectFailsRule(
      TypesHaveDescriptions,
      `
      # Query
      type QueryRoot {
        a: String
      }

      scalar DateTime

      schema {
        query: QueryRoot
      }
    `,
      [
        {
          message: 'The scalar type `DateTime` is missing a description.',
          locations: [{ line: 7, column: 7 }],
        },
      ]
    );
  });

  it('catches object types that have no description', () => {
    expectFailsRule(
      TypesHaveDescriptions,
      `
      type QueryRoot {
        a: String
      }

      schema {
        query: QueryRoot
      }
    `,
      [
        {
          message: 'The object type `QueryRoot` is missing a description.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('catches input types that have no description', () => {
    expectFailsRule(
      TypesHaveDescriptions,
      `
      # Query
      type QueryRoot {
        a: String
      }

      input AddStar {
        id: ID!
      }

      schema {
        query: QueryRoot
      }
    `,
      [
        {
          message: 'The input object type `AddStar` is missing a description.',
          locations: [{ line: 7, column: 7 }],
        },
      ]
    );
  });

  it('catches interface types that have no description', () => {
    expectFailsRule(
      TypesHaveDescriptions,
      `
      # The query root
      type QueryRoot {
        a: String
      }

      interface A {
        a: String
      }

      schema {
        query: QueryRoot
      }
    `,
      [
        {
          message: 'The interface type `A` is missing a description.',
          locations: [{ line: 7, column: 7 }],
        },
      ]
    );
  });

  it('catches union types that have no description', () => {
    expectFailsRule(
      TypesHaveDescriptions,
      `
      # The query root
      type QueryRoot {
        a: String
      }

      # A
      type A {
        a: String
      }

      # B
      type B {
        b: String
      }

      union AB = A | B

      schema {
        query: QueryRoot
      }
    `,
      [
        {
          message: 'The union type `AB` is missing a description.',
          locations: [{ line: 17, column: 7 }],
        },
      ]
    );
  });

  it('ignores type extensions', () => {
    expectPassesRule(
      TypesHaveDescriptions,
      `
      # The query root
      type Query {
        a: String
      }

      extend type Query {
        b: String
      }

      # Interface
      interface Vehicle {
        make: String!
      }

      extend type Vehicle {
        something: String!
      }
    `
    );
  });
});
