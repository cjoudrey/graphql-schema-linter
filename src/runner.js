import { readSync, readFileSync } from 'fs';
import { validateSchemaDefinition } from './validator.js';
import { rules } from './index.js';
import getGraphQLProjectConfig from 'graphql-config';
import JSONFormatter from './formatters/json_formatter.js';
import TextFormatter from './formatters/text_formatter.js';

export function run(options) {
  const schema = getSchema(options);
  const formatter = getFormatter(options);
  // TODO: Add a way to configure rules
  const errors = validateSchemaDefinition(schema, rules);

  formatter.start();
  errors.map((error) => { formatter.error(error); });
  const output = formatter.output();
  process.stdout.write(output);
}

function getSchema(options) {
  if (options.stdin) {
    return getSchemaFromStdin();
  } else if (options._.length > 0) {
    return getSchemaFromFile(options._[0]);
  } else {
    // TODO: Get schema from .graphqlconfig file
  }
}

function getSchemaFromStdin() {
  var b = new Buffer(1024);
  var data = '';

  while (true) {
    var n = readSync(process.stdin.fd, b, 0, b.length);
    if (!n) {
      break;
    }
    data += b.toString('utf8', 0, n);
  }

  return data;
}

function getSchemaFromFile(path) {
  return readFileSync(path).toString('utf8');
}

function getFormatter(options) {
  switch(options.format) {
    case 'json': return new JSONFormatter(options);
    case 'text': return new TextFormatter(options);
  }
}
