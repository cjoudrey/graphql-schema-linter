import assert from 'assert';
import { run } from '../src/runner.js';
import { openSync } from 'fs';
import { stripAnsi } from './strip_ansi.js';

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
    it('returns exit code 1 when schema has a syntax error', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'json',
        `${__dirname}/fixtures/invalid.graphql`,
      ];

      const exitCode = run(mockStdout, mockStdin, mockStderr, argv);
      assert.equal(1, exitCode);

      var errors = JSON.parse(stdout)['errors'];
      assert(errors);
      assert.equal(1, errors.length);
    });

    it('returns exit code 1 when there are errors', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--rules',
        'fields-have-descriptions',
        fixturePath,
      ];

      const exitCode = run(mockStdout, mockStdin, mockStderr, argv);
      assert.equal(1, exitCode);
    });

    it('validates schema when query root is missing', () => {
      const argv = [
        'node',
        'lib/cli.js',
        `${__dirname}/fixtures/schema.missing-query-root.graphql`,
      ];

      const exitCode = run(mockStdout, mockStdin, mockStderr, argv);

      const expected =
        `${__dirname}/fixtures/schema.missing-query-root.graphql\n` +
        '1:1 Query root type must be provided.  invalid-graphql-schema\n' +
        '\n' +
        '✖ 1 error detected\n';

      assert.equal(expected, stripAnsi(stdout));
    });

    it('validates schema when ast is invalid', () => {
      const argv = [
        'node',
        'lib/cli.js',
        `${__dirname}/fixtures/invalid-ast.graphql`,
      ];

      const exitCode = run(mockStdout, mockStdin, mockStderr, argv);

      const expected =
        `${__dirname}/fixtures/invalid-ast.graphql\n` +
        '9:1 Must provide only one schema definition.  invalid-graphql-schema\n' +
        '\n' +
        '✖ 1 error detected\n';

      assert.equal(expected, stripAnsi(stdout));
    });

    it('returns exit code 0 when there are errors', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--rules',
        'fields-have-descriptions',
        `${__dirname}/fixtures/valid.graphql`,
      ];

      const exitCode = run(mockStdout, mockStdin, mockStderr, argv);
      assert.equal(0, exitCode);
    });

    it('allows setting descriptions using comments in GraphQL SDL', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'text',
        '--comment-descriptions',
        '--rules',
        'fields-have-descriptions',
        `${__dirname}/fixtures/schema.comment-descriptions.graphql`,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      const expected =
        `${__dirname}/fixtures/schema.comment-descriptions.graphql\n` +
        '3:3 The field `Query.a` is missing a description.  fields-have-descriptions\n' +
        '\n' +
        '✖ 1 error detected\n';

      assert.equal(expected, stripAnsi(stdout));
    });

    it('allows using old `implements` syntax in GraphQL SDL', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'json',
        '--old-implements-syntax',
        '--rules',
        'types-have-descriptions',
        `${__dirname}/fixtures/schema.old-implements.graphql`,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      assert.deepEqual([], JSON.parse(stdout)['errors']);
    });

    it('validates using new `implements` syntax in GraphQL SDL', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'json',
        '--rules',
        'types-have-descriptions',
        `${__dirname}/fixtures/schema.new-implements.graphql`,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      assert.deepEqual([], JSON.parse(stdout)['errors']);
    });

    it('validates a single schema file and outputs in text', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'text',
        '--rules',
        'fields-have-descriptions',
        fixturePath,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      const expected =
        `${fixturePath}\n` +
        '2:3 The field `Query.a` is missing a description.  fields-have-descriptions\n' +
        '\n' +
        '✖ 1 error detected\n';

      assert.equal(expected, stripAnsi(stdout));
    });

    it('validates a single schema file by a custom rule and outputs in text', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'text',
        '--rules',
        'enum-name-cannot-contain-enum',
        '--custom-rule-paths',
        `${__dirname}/fixtures/custom_rules/*`,
        `${__dirname}/fixtures/animal.graphql`,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      const expected =
        `${__dirname}/fixtures/animal.graphql\n` +
        "18:3 The enum value `AnimalTypes.CAT_ENUM` cannot include the word 'enum'.  enum-name-cannot-contain-enum\n" +
        "21:3 The enum value `AnimalTypes.DOG_ENUM` cannot include the word 'enum'.  enum-name-cannot-contain-enum\n" +
        '\n' +
        '✖ 2 errors detected\n';

      assert.equal(expected, stripAnsi(stdout));
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

      var errors = JSON.parse(stdout)['errors'];
      assert(errors);
      assert.equal(1, errors.length);
    });

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

      var errors = JSON.parse(stdout)['errors'];
      assert.deepEqual(
        [
          {
            message: 'The field `Query.a` is missing a description.',
            location: { column: 3, line: 2, file: fixturePath },
            rule: 'fields-have-descriptions',
          },
        ],
        errors
      );
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

      var errors = JSON.parse(stdout)['errors'];
      assert(errors);
      assert.equal(1, errors.length);
    });

    it('validates a schema composed of multiple files (glob) and outputs in json', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'json',
        '--rules',
        'fields-have-descriptions',
        `${__dirname}/fixtures/schema/*.graphql`,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      var errors = JSON.parse(stdout)['errors'];
      assert(errors);
      assert.equal(6, errors.length);
    });

    it('validates a schema composed of multiple files (args) and outputs in json', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'json',
        '--rules',
        'fields-have-descriptions',
        `${__dirname}/fixtures/schema/schema.graphql`,
        `${__dirname}/fixtures/schema/user.graphql`,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      var errors = JSON.parse(stdout)['errors'];
      assert(errors);
      assert.equal(4, errors.length);
    });

    it('preserves original line numbers when schema is composed of multiple files', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'json',
        '--rules',
        'fields-have-descriptions',
        `${__dirname}/fixtures/schema/schema.graphql`,
        `${__dirname}/fixtures/schema/user.graphql`,
        `${__dirname}/fixtures/schema/comment.graphql`,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      var errors = JSON.parse(stdout)['errors'];
      assert(errors);

      assert.equal(6, errors.length);

      assert.equal(
        'The field `Query.something` is missing a description.',
        errors[0].message
      );
      assert.equal(2, errors[0].location.line);
      assert.equal(
        `${__dirname}/fixtures/schema/schema.graphql`,
        errors[0].location.file
      );
      assert.equal(errors[0].rule, 'fields-have-descriptions');

      assert.equal(
        'The field `User.username` is missing a description.',
        errors[1].message
      );
      assert.equal(2, errors[1].location.line);
      assert.equal(
        `${__dirname}/fixtures/schema/user.graphql`,
        errors[1].location.file
      );
      assert.equal(errors[1].rule, 'fields-have-descriptions');

      assert.equal(
        'The field `User.email` is missing a description.',
        errors[2].message
      );
      assert.equal(3, errors[2].location.line);
      assert.equal(
        `${__dirname}/fixtures/schema/user.graphql`,
        errors[2].location.file
      );
      assert.equal(errors[2].rule, 'fields-have-descriptions');

      assert.equal(
        'The field `Query.viewer` is missing a description.',
        errors[3].message
      );
      assert.equal(7, errors[3].location.line);
      assert.equal(
        `${__dirname}/fixtures/schema/user.graphql`,
        errors[3].location.file
      );
      assert.equal(errors[3].rule, 'fields-have-descriptions');

      assert.equal(
        'The field `Comment.body` is missing a description.',
        errors[4].message
      );
      assert.equal(2, errors[4].location.line);
      assert.equal(
        `${__dirname}/fixtures/schema/comment.graphql`,
        errors[4].location.file
      );
      assert.equal(errors[4].rule, 'fields-have-descriptions');

      assert.equal(
        'The field `Comment.author` is missing a description.',
        errors[5].message
      );
      assert.equal(3, errors[5].location.line);
      assert.equal(
        `${__dirname}/fixtures/schema/comment.graphql`,
        errors[5].location.file
      );
      assert.equal(errors[5].rule, 'fields-have-descriptions');
    });

    it('fails and exits if the output format is unknown', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--format',
        'xml',
        '--rules',
        'fields-have-descriptions',
        `${__dirname}/fixtures/valid.graphql`,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      const exitCode = run(mockStdout, mockStdin, mockStderr, argv);
      assert(stderr.indexOf("The output format 'xml' is invalid") >= 0);
      assert.equal(2, exitCode);
    });

    it('warns but continues if a rule is unknown', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--rules',
        'no-rule-of-mine,fields-have-descriptions',
        `${__dirname}/fixtures/valid.graphql`,
      ];

      run(mockStdout, mockStdin, mockStderr, argv);

      const exitCode = run(mockStdout, mockStdin, mockStderr, argv);
      assert(
        stderr.indexOf('The following rule(s) are invalid: NoRuleOfMine') >= 0
      );
      assert.equal(0, exitCode);
    });

    it('prints config and exits with 0 if config is valid', () => {
      const argv = [
        'node',
        'lib/cli.js',
        '--print-config',
        '--rules',
        'no-rule-of-mine,fields-have-descriptions',
        '--stdin',
        'foo.graphql',
        '--format',
        'json',
        '--custom-rule-paths',
        `${__dirname}/fixtures/custom_rules/*`,
      ];

      const exitCode = run(mockStdout, mockStdin, mockStderr, argv);
      assert.strictEqual(exitCode, 0);

      const config = JSON.parse(stdout);
      assert(config.options.stdin);
      assert.strictEqual(config.options.format, 'json');
      assert(!config.options.commentDescriptions);
      assert(!config.options.oldImplementsSyntax);
      assert.strictEqual(config.options.customRulePaths.length, 1);
      assert.strictEqual(config.options.rules.length, 2);
      assert(config.rules.length > 0);
      assert(config.builtInRulePaths);
      assert.strictEqual(config.rulePaths.length, 2);
    });
  });
});
