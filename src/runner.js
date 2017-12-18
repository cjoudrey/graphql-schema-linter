import { validateSchemaDefinition } from './validator.js';
import { version } from '../package.json';
import { Command } from 'commander';
import { Configuration } from './configuration.js';
import figures from 'figures';
import chalk from 'chalk';

export function run(stdout, stdin, stderr, argv) {
  const commander = new Command()
    .usage('[options] [schema.graphql ...]')
    .option(
      '-r, --rules <rules>',
      'only the rules specified will be used to validate the schema. Example: fields-have-descriptions,types-have-descriptions'
    )
    .option(
      '-f, --format <format>',
      'choose the output format of the report. Possible values: json, text'
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
      '-p, --custom-rules-paths <path>',
      'path to additional custom rules to be loaded.'
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

  const configuration = new Configuration(
    getOptionsFromCommander(commander),
    stdin.fd
  );

  const issues = configuration.validate();

  issues.map(issue => {
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

  if (issues.some(issue => issue.type == 'error')) {
    return 2;
  }

  const schema = configuration.getSchema();
  const formatter = configuration.getFormatter();
  const rules = configuration.getRules();
  const schemaSourceMap = configuration.getSchemaSourceMap();

  const errors = validateSchemaDefinition(schema, rules);

  const groupedErrors = groupErrorsBySchemaFilePath(errors, schemaSourceMap);

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

  if (commander.customRulesPaths) {
    options.customRulesPaths = commander.customRulesPaths.split(',');
  }

  if (commander.args && commander.args.length) {
    options.schemaPaths = commander.args;
  }

  return options;
}
