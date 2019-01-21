import assert from 'assert';
import TextFormatter from '../../src/formatters/text_formatter';
import figures from '../../src/figures';
const stripAnsi = require('strip-ansi');

describe('TextFormatter', () => {
  it('returns a summary when there are no errors', () => {
    const expected = '\n' + `\n${figures.tick} 0 errors detected\n\n`;

    assert.equal(stripAnsi(TextFormatter({})), expected);
  });

  it('returns error and singular summary when there is one error', () => {
    const errors = {
      'schema/query.graphql': [
        {
          message:
            'The field `Query.users` is deprecated but has no deprecation reason.',
          locations: [{ line: 4, column: 20 }],
          ruleName: 'deprecations-have-a-reason',
        },
      ],
    };

    const expected =
      '' +
      'schema/query.graphql\n' +
      '4:20 The field `Query.users` is deprecated but has no deprecation reason.  deprecations-have-a-reason\n' +
      '\n' +
      `${figures.cross} 1 error detected\n`;

    assert.equal(stripAnsi(TextFormatter(errors)), expected);
  });

  it('returns errors and plural summary when there is more than one error', () => {
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

    const expected =
      '' +
      'schema/query.graphql\n' +
      '4:20 The field `Query.users` is deprecated but has no deprecation reason.  deprecations-have-a-reason\n' +
      '\n' +
      'schema/user.graphql\n' +
      '3:3 The field `User.email` is missing a description.  fields-have-descriptions\n' +
      '\n' +
      `${figures.cross} 2 errors detected\n`;

    assert.equal(stripAnsi(TextFormatter(errors)), expected);
  });
});
