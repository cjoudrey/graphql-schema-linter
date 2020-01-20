import assert from 'assert';
import InlineTextFormatter from '../../src/formatters/inline_text_formatter.js';
const stripAnsi = require('strip-ansi');

describe('InlineTextFormatter', () => {
  it('returns a single newline when there are no errors', () => {
    const expected = '\n';
    assert.equal(stripAnsi(InlineTextFormatter({})), expected);
  });

  it('returns a single block of text for all errors otherwise', () => {
    const errors = {
      file1: [
        {
          message: 'error.',
          locations: [{ line: 1, column: 1 }],
          ruleName: 'a-rule',
        },
      ],
      file2: [
        {
          message: 'another error.',
          locations: [{ line: 1, column: 1 }],
          ruleName: 'a-rule',
        },
      ],
    };

    const expected =
      '' + 'file1:1:1 error.  a-rule\n' + 'file2:1:1 another error.  a-rule\n';

    assert.equal(stripAnsi(InlineTextFormatter(errors)), expected);
  });
});
