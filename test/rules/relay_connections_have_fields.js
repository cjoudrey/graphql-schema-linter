import { RelayConnectionsHaveFields } from '../../src/rules/relay_connections_have_fields';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('RelayConnectionsHaveFields  rule', () => {
  it('catches object types that have missing fields', () => {
    expectFailsRule(
      RelayConnectionsHaveFields,
      `
      type BadConnection {
        a: String
      }
    `,
      [
        {
          message:
            'Connection `BadConnection` is missing the following fields: pageInfo, edges.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });
  it('catches interface types that have missing fields', () => {
    expectFailsRule(
      RelayConnectionsHaveFields,
      `
      interface BadConnection {
        a: String
      }
    `,
      [
        {
          message:
            'Connection `BadConnection` is missing the following fields: pageInfo, edges.',
          locations: [{ line: 2, column: 7 }],
        },
      ]
    );
  });

  it('accepts object types with the correct fields.', () => {
    expectPassesRule(
      RelayConnectionsHaveFields,
      `
      
      type BetterConnection {
        pageInfo: String
        edges: Int
      }
    `
    );
  });
  it('accepts interface types with the correct fields.', () => {
    expectPassesRule(
      RelayConnectionsHaveFields,
      `
      
      interface BetterConnection {
        pageInfo: String
        edges: Int
      }
    `
    );
  });
});
