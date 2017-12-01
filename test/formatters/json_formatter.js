import assert from 'assert';
import JSONFormatter from '../../src/formatters/json_formatter';

describe('JSONFormatter', () => {
  it('returns an array of errors in JSON format', () => {
    const errors = {
      'schema/query.graphql': [
        {
          message:
            'The field `Query.users` is deprecated but has no deprecation reason.',
          locations: [{ line: 4, column: 20 }],
          ruleName: 'deprecations-have-a-reason',
        },
      ],

      'schema/user.graphql': [
        {
          message: 'The field `User.email` is missing a description.',
          locations: [{ line: 3, column: 3 }],
          ruleName: 'fields-have-descriptions',
        },
      ],
    };

    assert.equal(
      JSONFormatter(errors),
      JSON.stringify({
        errors: [
          {
            message:
              'The field `Query.users` is deprecated but has no deprecation reason.',
            location: {
              line: 4,
              column: 20,
              file: 'schema/query.graphql',
            },
            rule: 'deprecations-have-a-reason',
          },
          {
            message: 'The field `User.email` is missing a description.',
            location: {
              line: 3,
              column: 3,
              file: 'schema/user.graphql',
            },
            rule: 'fields-have-descriptions',
          },
        ],
      })
    );
  });

  it('returns an empty array when there is no errors', () => {
    assert.equal(JSONFormatter({}), JSON.stringify({ errors: [] }));
  });
});
