import { validateSchemaDefinition } from './validator.js';
import { rules } from './index.js';
import { version } from '../package.json';
import commander from 'commander';
import { Configuration } from './configuration.js';

export function run(stdout, stdin, argv) {
  commander
    .usage('[options] [schema.graphql]')
    .option(
      '-o, --only <rules>',
      'only the rules specified will be used to validate the schema. Example: FieldsHaveDescriptions,TypesHaveDescriptions'
    )
    .option(
      '-c, --config-directory <path>',
      'path to begin searching for config files.'
    )
    .option(
      '-e, --except <rules>',
      'all rules except the ones specified will be used to validate the schema. Example: FieldsHaveDescriptions,TypesHaveDescriptions'
    )
    .option(
      '-f, --format <format>',
      'choose the output format of the report. Possible values: json, text'
    )
    .option(
      '-s, --stdin',
      'schema definition will be read from STDIN instead of specified file.'
    )
    .version(version, '--version')
    .parse(argv);

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

  if (commander.args && commander.args.length) {
    options.schemaFileName = commander.args[0];
  }

  return options;
}
