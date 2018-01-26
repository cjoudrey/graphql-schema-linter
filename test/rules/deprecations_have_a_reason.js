import { DeprecationsHaveAReason } from '../../src/rules/deprecations_have_a_reason';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('DeprecationsHaveAReason rule', () => {
  it('catches deprecated fields that have no deprecation reason in object types', () => {
    expectFailsRule(
      DeprecationsHaveAReason,
      `
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
    `,
      [
        {
          message:
            'The field `A.deprecatedWithoutReason` is deprecated but has no deprecation reason.',
          locations: [{ line: 7, column: 41 }],
        },
      ]
    );
  });

  it('catches deprecated fields that have no deprecation reason in interface types', () => {
    expectFailsRule(
      DeprecationsHaveAReason,
      `
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
    `,
      [
        {
          message:
            'The field `A.deprecatedWithoutReason` is deprecated but has no deprecation reason.',
          locations: [{ line: 7, column: 41 }],
        },
      ]
    );
  });

  it('catches deprecated enum values that have no deprecation reason', () => {
    expectFailsRule(
      DeprecationsHaveAReason,
      `
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
    `,
      [
        {
          message:
            'The enum value `A.deprecatedWithoutReason` is deprecated but has no deprecation reason.',

          locations: [{ line: 7, column: 33 }],
        },
      ]
    );
  });
});
