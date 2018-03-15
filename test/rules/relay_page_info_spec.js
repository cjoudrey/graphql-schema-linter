import { RelayPageInfoSpec } from '../../src/rules/relay_page_info_spec';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('RelayPageInfoSpec  rule', () => {
  it('catches missing PageInfo type', () => {
    expectFailsRule(RelayPageInfoSpec, '', [
      {
        locations: [
          {
            column: 1,
            line: 1,
          },
        ],
        message: 'A `PageInfo` object type is required as per the Relay spec.',
      },
    ]);
  });

  it('catches missing PageInfo.hasPreviousPage field', () => {
    expectFailsRule(
      RelayPageInfoSpec,
      `
      type PageInfo {
        hasNextPage: Boolean!
      }
      `,
      [
        {
          locations: [
            {
              column: 7,
              line: 2,
            },
          ],
          message:
            'The `PageInfo` object type must have a `hasPreviousPage` field that returns a non-null Boolean as per the Relay spec.',
        },
      ]
    );
  });

  it('catches invalid PageInfo.hasPreviousPage field', () => {
    expectFailsRule(
      RelayPageInfoSpec,
      `
      type PageInfo {
        hasNextPage: Boolean!
        hasPreviousPage: String!
      }
      `,
      [
        {
          locations: [
            {
              column: 9,
              line: 4,
            },
          ],
          message:
            'The `PageInfo` object type must have a `hasPreviousPage` field that returns a non-null Boolean as per the Relay spec.',
        },
      ]
    );
  });

  it('catches missing PageInfo.hasNextPage field', () => {
    expectFailsRule(
      RelayPageInfoSpec,
      `
      type PageInfo {
        hasPreviousPage: Boolean!
      }
      `,
      [
        {
          locations: [
            {
              column: 7,
              line: 2,
            },
          ],
          message:
            'The `PageInfo` object type must have a `hasNextPage` field that returns a non-null Boolean as per the Relay spec.',
        },
      ]
    );
  });

  it('catches invalid PageInfo.hasNextPage field', () => {
    expectFailsRule(
      RelayPageInfoSpec,
      `
      type PageInfo {
        hasNextPage: String!
        hasPreviousPage: Boolean!
      }
      `,
      [
        {
          locations: [
            {
              column: 9,
              line: 3,
            },
          ],
          message:
            'The `PageInfo` object type must have a `hasNextPage` field that returns a non-null Boolean as per the Relay spec.',
        },
      ]
    );
  });

  it('accepts proper definition', () => {
    expectPassesRule(
      RelayPageInfoSpec,
      `
      type PageInfo {
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
      }
    `
    );
  });
});
