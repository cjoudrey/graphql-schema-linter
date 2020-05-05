import { TypesHaveDescriptions } from '../../src/rules/types_have_descriptions';
import {
  expectFailsRule,
  expectPassesRule,
  expectPassesRuleWithConfiguration,
} from '../assertions';

describe('TypesHaveDescriptions rule', () => {
  it('catches enum types that have no description', () => {
    expectFailsRule(
      TypesHaveDescriptions,
      `
      "A"
      enum A {
        A
      }

      enum STATUS {
        DRAFT
        PUBLISHED
        HIDDEN
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
      "A"
      scalar A

      scalar DateTime
    `,
      [
        {
          message: 'The scalar type `DateTime` is missing a description.',
          locations: [{ line: 5, column: 7 }],
        },
      ]
    );
  });

  it('catches object types that have no description', () => {
    expectFailsRule(
      TypesHaveDescriptions,
      `
      type A {
        a: String
      }

      "B"
      type B {
        b: String
      }
    `,
      [
        {
          message: 'The object type `A` is missing a description.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('catches input types that have no description', () => {
    expectFailsRule(
      TypesHaveDescriptions,
      `
      input AddStar {
        id: ID!
      }

      "RemoveStar"
      input RemoveStar {
        id: ID!
      }
    `,
      [
        {
          message: 'The input object type `AddStar` is missing a description.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('catches interface types that have no description', () => {
    expectFailsRule(
      TypesHaveDescriptions,
      `
      "B"
      interface B {
        B: String
      }

      interface A {
        a: String
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
      "A"
      type A {
        a: String
      }

      "B"
      type B {
        b: String
      }

      union AB = A | B

      "BA"
      union BA = B | A
    `,
      [
        {
          message: 'The union type `AB` is missing a description.',
          locations: [{ line: 12, column: 7 }],
        },
      ]
    );
  });

  it('ignores type extensions', () => {
    expectPassesRule(
      TypesHaveDescriptions,
      `
      extend type Query {
        b: String
      }

      "Interface"
      interface Vehicle {
        make: String!
      }

      extend interface Vehicle {
        something: String!
      }
    `
    );
  });

  it('gets descriptions correctly with commentDescriptions option', () => {
    expectPassesRuleWithConfiguration(
      TypesHaveDescriptions,
      `
      # A
      scalar A

      # B
      type B {
        b: String
      }

      # C
      interface C {
        c: String
      }

      # D
      union D = B

      # E
      enum E {
        A
      }

      # F
      input F {
        f: String
      }
    `,
      { commentDescriptions: true }
    );
  });
});
