import { DescriptionsAreCapitalized } from '../../src/rules/descriptions_are_capitalized';
import {
  expectFailsRule,
  expectFailsRuleWithConfiguration,
  expectPassesRule,
} from '../assertions';

describe('DescriptionsAreCapitalized rule', () => {
  it('detects lowercase field descriptions', () => {
    expectFailsRule(
      DescriptionsAreCapitalized,
      `
      type Widget {
        "widget name"
        name: String!

        "Valid description"
        other: Int
      }
    `,
      [
        {
          message:
            'The description for field `Widget.name` should be capitalized.',
          locations: [{ line: 3, column: 9 }],
        },
      ]
    );
  });

  it('detects lowercase field descriptions with commentDescriptions option', () => {
    expectFailsRuleWithConfiguration(
      DescriptionsAreCapitalized,
      `
      type Widget {
        # widget name
        name: String!

        # Valid description
        other: Int
      }
    `,
      { commentDescriptions: true },
      [
        {
          message:
            'The description for field `Widget.name` should be capitalized.',
          locations: [{ line: 4, column: 9 }],
        },
      ]
    );
  });

  it('does not err on an empty description', () => {
    expectPassesRule(
      DescriptionsAreCapitalized,
      `
      type Widget {
        ""
        name: String!
      }
    `
    );
  });

  it('does not err on a missing description', () => {
    expectPassesRule(
      DescriptionsAreCapitalized,
      `
      type Widget {
        name: String!
      }
    `
    );
  });
});
