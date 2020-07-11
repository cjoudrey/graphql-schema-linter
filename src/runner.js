import { validateSchemaDefinition } from './validator.js';
import { version } from '../package.json';
import { Command } from 'commander';
import { Configuration } from './configuration.js';
import { loadSchema } from './schema.js';
import { loadOptionsFromConfigDir } from './options.js';
import figures from './figures';
import chalk from 'chalk';

export async function run(stdout, stdin, stderr, argv) {
  const commander = new Command()
    .usage('[options] [schema.graphql ...]')
    .option(
      '-r, --rules <rules>',
      'only the rules specified will be used to validate the schema. Example: fields-have-descriptions,types-have-descriptions'
    )
    .option(
      '-i, --ignore <ignore list>',
      "ignore errors for specific subjects. Example: {'fields-have-descriptions':['Obvious','Query.obvious','Query.something.obvious']}"
    )
    .option(
      '-f, --format <format>',
      'choose the output format of the report. Possible values: json, text, compact'
    )
    .option(
      '-s, --stdin',
      'schema definition will be read from STDIN instead of specified file.'
    )
    .option(
      '-c, --config-directory <path>',
      'path to begin searching for config files.'
    )
    .option(
      '-p, --custom-rule-paths <paths>',
      'path to additional custom rules to be loaded. Example: rules/*.js'
    )
    .option(
      '--comment-descriptions',
      'use old way of defining descriptions in GraphQL SDL'
    )
    .option(
      '--old-implements-syntax',
      'use old way of defining implemented interfaces in GraphQL SDL'
    )
    // DEPRECATED - This code should be removed in v1.0.0.
    .option(
      '-o, --only <rules>',
      'This option is DEPRECATED. Use `--rules` instead.'
    )
    // DEPRECATED - This code should be removed in v1.0.0.
    .option(
      '-e, --except <rules>',
      'This option is DEPRECATED. Use `--rules` instead.'
    )
    .version(version, '--version')
    .parse(argv);

  if (commander.only || commander.except) {
    stderr.write(
      `${chalk.yellow(figures.warning)} The ${chalk.bold(
        '--only'
      )} and ${chalk.bold('--except')} command line options ` +
        `have been deprecated. They will be removed in ${chalk.bold(
          'v1.0.0'
        )}.\n\n`
    );
  }

  // TODO Get configs from .graphqlconfig file

  const optionsFromCommandLine = getOptionsFromCommander(commander);
  const optionsFromConfig = loadOptionsFromConfigDir(
    optionsFromCommandLine.configDirectory
  );
  const options = { ...optionsFromConfig, ...optionsFromCommandLine };

  const schema = await loadSchema(options, stdin);

  if (schema === null) {
    console.error('No valid schema input.');
    return 2;
  }

  const configuration = new Configuration(schema, options);

  const issues = configuration.validate();

  issues.map((issue) => {
    var prefix;
    if (issue.type == 'error') {
      prefix = `${chalk.red(figures.cross)} Error`;
    } else {
      prefix = `${chalk.yellow(figures.warning)} Warning`;
    }
    stderr.write(
      `${prefix} on ${chalk.bold(issue.field)}: ${issue.message}\n\n`
    );
  });

  if (issues.some((issue) => issue.type == 'error')) {
    return 2;
  }

  const formatter = configuration.getFormatter();
  const rules = configuration.getRules();

  const errors = validateSchemaDefinition(schema, rules, configuration);
  const groupedErrors = groupErrorsBySchemaFilePath(errors, schema.sourceMap);

  stdout.write(formatter(groupedErrors));

  return errors.length > 0 ? 1 : 0;
}

function groupErrorsBySchemaFilePath(errors, schemaSourceMap) {
  return errors.reduce((groupedErrors, error) => {
    const path = schemaSourceMap.getOriginalPathForLine(
      error.locations[0].line
    );

    const offsetForPath = schemaSourceMap.getOffsetForPath(path);
    error.locations[0].line =
      error.locations[0].line - offsetForPath.startLine + 1;

    groupedErrors[path] = groupedErrors[path] || [];
    groupedErrors[path].push(error);

    return groupedErrors;
  }, {});
}

function getOptionsFromCommander(commander) {
  let options = { stdin: commander.stdin };

  if (commander.configDirectory) {
    options.configDirectory = commander.configDirectory;
  }

  if (commander.except) {
    options.except = commander.except.split(',');
  }

  if (commander.format) {
    options.format = commander.format;
  }

  if (commander.only) {
    options.only = commander.only.split(',');
  }

  if (commander.rules) {
    options.rules = commander.rules.split(',');
  }

  if (commander.ignore) {
    options.ignore = JSON.parse(commander.ignore);
  }

  if (commander.customRulePaths) {
    options.customRulePaths = commander.customRulePaths.split(',');
  }

  if (commander.commentDescriptions) {
    options.commentDescriptions = commander.commentDescriptions;
  }

  if (commander.oldImplementsSyntax) {
    options.oldImplementsSyntax = commander.oldImplementsSyntax;
  }

  if (commander.args && commander.args.length) {
    options.schemaPaths = commander.args;
  }

  return options;
}
