import { RelayConnectionTypesSpec } from '../../src/rules/relay_connection_types_spec';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('RelayConnectionTypesSpec  rule', () => {
  it('catches object types that have missing fields', () => {
    expectFailsRule(
      RelayConnectionTypesSpec,
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

  it('accepts object types with the correct fields.', () => {
    expectPassesRule(
      RelayConnectionTypesSpec,
      `
      type BetterConnection {
        pageInfo: String
        edges: Int
      }
    `
    );
  });
  it('ignores interface types that have missing fields', () => {
    expectPassesRule(
      RelayConnectionTypesSpec,
      `
      interface BadConnection {
        a: String
      }
    `
    );
  });
});
