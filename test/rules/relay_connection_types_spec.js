import { RelayConnectionTypesSpec } from '../../src/rules/relay_connection_types_spec';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('RelayConnectionTypesSpec rule', () => {
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
      type PageInfo {
        a: String
      }

      type Edge {
        a: String
      }

      type BetterConnection {
        pageInfo: PageInfo!
        edges: [Edge]
      }

      type AnotherConnection {
        pageInfo: PageInfo!
        edges: [Edge]!
      }

      type AnotherGoodConnection {
        pageInfo: PageInfo!
        edges: [Edge!]!
      }

      type AgainAnotherConnection {
        pageInfo: PageInfo!
        edges: [Edge!]
      }
    `
    );
  });

  it('catches edges fields that are not lists of edges', () => {
    expectFailsRule(
      RelayConnectionTypesSpec,
      `
      type PageInfo {
        a: String
      }

      type Edge {
        a: String
      }

      type BadConnection {
        pageInfo: PageInfo!
        edges: String
      }

      type AnotherBadConnection {
        pageInfo: String
        edges: [Edge]
      }

      type YetAnotherBadConnection {
        pageInfo: String!
        edges: [Edge]
      }
    `,
      [
        {
          message:
            'The `BadConnection.edges` field must return a list of edges not `String`.',
          locations: [{ line: 10, column: 7 }],
        },
        {
          message:
            'The `AnotherBadConnection.pageInfo` field must return a non-null `PageInfo` object not `String`',
          locations: [
            {
              column: 7,
              line: 15,
            },
          ],
        },
        {
          message:
            'The `YetAnotherBadConnection.pageInfo` field must return a non-null `PageInfo` object not `String!`',
          locations: [
            {
              column: 7,
              line: 20,
            },
          ],
        },
      ]
    );
  });

  it('ignores types that are not objects', () => {
    expectPassesRule(
      RelayConnectionTypesSpec,
      `
      scalar A

      interface B {
        a: String
      }

      union C = F

      enum D {
        SOMETHING
      }

      input E {
        a: String!
      }

      type F {
        a: String!
      }
    `
    );
  });

  it('catches types that end in Connection but that are not objects', () => {
    expectFailsRule(
      RelayConnectionTypesSpec,
      `
      scalar AConnection

      interface BConnection {
        a: String!
      }

      type F {
        a: String!
      }
      union CConnection = F

      enum DConnection {
        SOMETHING
      }

      input EConnection {
        a: String!
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
            'Types that end in `Connection` must be an object type as per the relay spec. `AConnection` is not an object type.',
          ruleName: 'relay-connection-types-spec',
        },
        {
          locations: [
            {
              column: 7,
              line: 4,
            },
          ],
          message:
            'Types that end in `Connection` must be an object type as per the relay spec. `BConnection` is not an object type.',
          ruleName: 'relay-connection-types-spec',
        },
        {
          locations: [
            {
              column: 7,
              line: 11,
            },
          ],
          message:
            'Types that end in `Connection` must be an object type as per the relay spec. `CConnection` is not an object type.',
          ruleName: 'relay-connection-types-spec',
        },
        {
          locations: [
            {
              column: 7,
              line: 13,
            },
          ],
          message:
            'Types that end in `Connection` must be an object type as per the relay spec. `DConnection` is not an object type.',
          ruleName: 'relay-connection-types-spec',
        },
        {
          locations: [
            {
              column: 7,
              line: 17,
            },
          ],
          message:
            'Types that end in `Connection` must be an object type as per the relay spec. `EConnection` is not an object type.',
          ruleName: 'relay-connection-types-spec',
        },
      ]
    );
  });
});
