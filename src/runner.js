import { validateSchemaDefinition } from './validator.js';
import { rules } from './index.js';
import { version } from '../package.json';
import commander from 'commander';
import { Configuration } from './configuration.js';
import figures from 'figures';
import chalk from 'chalk';

export function run(stdout, stdin, stderr, argv) {
  commander
    .usage('[options] [schema.graphql]')
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

  const schema = configuration.getSchema();
  const formatter = configuration.getFormatter();
  const rules = configuration.getRules();

  const errors = validateSchemaDefinition(schema, rules);

  stdout.write(formatter(errors));

  return errors.length > 0 ? 1 : 0;
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

  if (commander.args && commander.args.length) {
    options.schemaFileName = commander.args[0];
  }

  return options;
}
