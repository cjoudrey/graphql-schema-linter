import assert from 'assert';
import { run } from '../src/runner.js';
import { openSync } from 'fs';

describe('Runner', () => {
  var stdout;
  var mockStdout = {
    write: text => {
      stdout = stdout + text;
    },
  };

  var stderr;
  var mockStderr = {
    write: text => {
      stderr = stderr + text;
    },
  };

  beforeEach(() => {
    stdout = '';
    stderr = '';
  });

  const fixturePath = `${__dirname}/fixtures/schema.graphql`;
  const mockStdin = { fd: openSync(fixturePath, 'r') };

  describe('run', () => {
    it('validates a single schema file and outputs in json', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'json',
        '--rules',
        'fields-have-descriptions',
        fixturePath,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      var errors = JSON.parse(stdout);
      assert.equal(1, errors['errors'].length);
    });

    it('validates schema passed in via stdin and outputs in json', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'json',
        '--rules',
        'fields-have-descriptions',
        '--stdin',
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      var errors = JSON.parse(stdout);
      assert.equal(1, errors['errors'].length);
    });
  });
});
