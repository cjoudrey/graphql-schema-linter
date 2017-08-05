import { validateSchemaDefinition } from './validator.js';
import { rules } from './index.js';
import { version } from '../package.json';
import commander from 'commander';
import { Configuration } from './configuration.js';

export function run(stdout, argv) {
  commander
    .usage('[options] [schema.graphql]')
    .option('-o, --only <rules>', 'only the rules specified will be used to validate the schema. Example: FieldsHaveDescriptions,TypesHaveDescriptions')
    .option('-e, --except <rules>', 'all rules except the ones specified will be used to validate the schema. Example: FieldsHaveDescriptions,TypesHaveDescriptions')
    .option('-f, --format <format>', 'choose the output format of the report. Possible values: json, text')
    .option('-s, --stdin', 'schema definition will be read from STDIN instead of specified file.')
    .version(version, '--version')
    .parse(argv);

  const configuration = new Configuration({
    format: (commander.format && commander.format.toLowerCase()) || 'text',
    stdin: commander.stdin,
    only: (commander.only && commander.only.split(',')) || [],
    except: (commander.except && commander.except.split(',')) || [],
    args: commander.args,
  });

  const schema = configuration.getSchema();
  const formatter = configuration.getFormatter();
  const rules = configuration.getRules();

  const errors = validateSchemaDefinition(schema, rules);

  stdout.write(formatter(errors));

  return errors.length > 0 ? 1 : 0;
}
