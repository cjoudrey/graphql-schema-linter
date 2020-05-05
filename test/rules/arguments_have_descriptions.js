import { ArgumentsHaveDescriptions } from '../../src/rules/arguments_have_descriptions';
import {
  expectFailsRule,
  expectPassesRuleWithConfiguration,
} from '../assertions';

describe('ArgumentsHaveDescriptions rule', () => {
  it('catches field arguments that have no description', () => {
    expectFailsRule(
      ArgumentsHaveDescriptions,
      `
      type Box {
        widget(
          id: Int

          "Widget type"
          type: String
        ): String!
      }
    `,
      [
        {
          message: 'The `id` argument of `widget` is missing a description.',
          locations: [{ line: 4, column: 11 }],
        },
      ]
    );
  });

  it('catches field arguments that have empty description', () => {
    expectFailsRule(
      ArgumentsHaveDescriptions,
      `
      type Box {
        widget(
          ""
          id: Int

          "Widget type"
          type: String
        ): String!
      }
    `,
      [
        {
          message: 'The `id` argument of `widget` is missing a description.',
          locations: [{ line: 4, column: 11 }],
        },
      ]
    );
  });

  it('gets descriptions correctly with commentDescriptions option', () => {
    expectPassesRuleWithConfiguration(
      ArgumentsHaveDescriptions,
      `
      type Box {
        widget(
          "Widget ID"
          id: Int

          # Widget type
          type: String
        ): String!
      }
    `,
      { commentDescriptions: true }
    );
  });
});
