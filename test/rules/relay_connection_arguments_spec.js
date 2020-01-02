import { RelayConnectionArgumentsSpec } from '../../src/rules/relay_connection_arguments_spec';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('RelayConnectionArgumentsSpec rule', () => {
  it('reports connections that do not support forward or backward pagination', () => {
    expectFailsRule(
      RelayConnectionArgumentsSpec,
      `
      extend type Query {
        users: UserConnection
      }

      type UserConnection {
        a: String
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
            'A field that returns a Connection Type must include forward pagination arguments (`first` and `after`), backward pagination arguments (`last` and `before`), or both as per the Relay spec.',
        },
      ]
    );
  });

  it('accepts connection with proper forward pagination arguments', () => {
    expectPassesRule(
      RelayConnectionArgumentsSpec,
      `
      extend type Query {
        users(first: Int, after: String): UserConnection
      }

      type UserConnection {
        a: String
      }
    `
    );
  });

  it('accepts connection with proper backward pagination arguments', () => {
    expectPassesRule(
      RelayConnectionArgumentsSpec,
      `
      extend type Query {
        users(last: Int, before: String): UserConnection
      }

      type UserConnection {
        a: String
      }
    `
    );
  });

  it('accepts connection with proper forward and backward pagination arguments', () => {
    expectPassesRule(
      RelayConnectionArgumentsSpec,
      `
      extend type Query {
        users(first: Int, after: String, last: Int, before: String): UserConnection
      }

      type UserConnection {
        a: String
      }
    `
    );
  });

  it('accepts connection with required first argument if no backward pagination is specified', () => {
    expectPassesRule(
      RelayConnectionArgumentsSpec,
      `
      extend type Query {
        users(first: Int!, after: String): UserConnection
      }

      type UserConnection {
        a: String
      }
    `
    );
  });

  it('accepts connection with required last argument if no forward pagination is specified', () => {
    expectPassesRule(
      RelayConnectionArgumentsSpec,
      `
      extend type Query {
        users(last: Int!, before: String): UserConnection
      }

      type UserConnection {
        a: String
      }
    `
    );
  });

  it('reports invalid first argument if first is required and backward pagination is specified', () => {
    expectFailsRule(
      RelayConnectionArgumentsSpec,
      `
      extend type Query {
        users(first: Int!, after: String, last: Int, before: String): UserConnection
      }

      type UserConnection {
        a: String
      }
    `,
      [
        {
          locations: [
            {
              column: 15,
              line: 3,
            },
          ],
          message:
            'Fields that support forward and backward pagination must include a `first` argument that takes a nullable non-negative integer as per the Relay spec.',
        },
      ]
    );
  });

  it('reports invalid last argument if last is required and forward pagination is specified', () => {
    expectFailsRule(
      RelayConnectionArgumentsSpec,
      `
      extend type Query {
        users(first: Int, after: String, last: Int!, before: String): UserConnection
      }

      type UserConnection {
        a: String
      }
    `,
      [
        {
          locations: [
            {
              column: 42,
              line: 3,
            },
          ],
          message:
            'Fields that support forward and backward pagination must include a `last` argument that takes a nullable non-negative integer as per the Relay spec.',
        },
      ]
    );
  });

  it('reports invalid first argument', () => {
    expectFailsRule(
      RelayConnectionArgumentsSpec,
      `
      extend type Query {
        users(first: String, after: String): UserConnection
      }

      type UserConnection {
        a: String
      }
    `,
      [
        {
          locations: [
            {
              column: 15,
              line: 3,
            },
          ],
          message:
            'Fields that support forward pagination must include a `first` argument that takes a non-negative integer as per the Relay spec.',
        },
      ]
    );
  });

  it('reports invalid last argument', () => {
    expectFailsRule(
      RelayConnectionArgumentsSpec,
      `
      extend type Query {
        users(last: String, before: String): UserConnection
      }

      type UserConnection {
        a: String
      }
    `,
      [
        {
          locations: [
            {
              column: 15,
              line: 3,
            },
          ],
          message:
            'Fields that support backward pagination must include a `last` argument that takes a non-negative integer as per the Relay spec.',
        },
      ]
    );
  });
});
