import defaultRules from './rules/index.js'
import JSONFormatter from './formatters/json_formatter.js';
import TextFormatter from './formatters/text_formatter.js';
import getGraphQLProjectConfig from 'graphql-config';
import { readSync, readFileSync } from 'fs';

export class Configuration {
  constructor(options) {
    this.options = options;
  }

  getSchema() {
    // TODO - Check for args.length > 1

    if (this.options.stdin) {
      return getSchemaFromStdin();
    } else if (this.options.args.length > 0) {
      return getSchemaFromFile(this.options.args[0]);
    } else {
      // TODO: Get schema from .graphqlconfig file
    }
  }

  getFormatter() {
    switch(this.options.format) {
      case 'json': return new JSONFormatter(this);
      case 'text': return new TextFormatter(this);
      // TODO raise when invalid formatter
    }
  }

  getRules() {
    // TODO Cannot have both except and only -- raise in this case
    // TODO validate that all rules passed to only/except exist.

    var rules;

    if (this.options.only.length > 0) {
      rules = defaultRules.filter((rule) => {
        return (this.options.only.indexOf(rule.name) >= 0);
      });
    } else if (this.options.except.length > 0) {
      rules = defaultRules.filter((rule) => {
        return (this.options.except.indexOf(rule.name) == -1);
      });
    } else {
      rules = defaultRules;
    }

    return rules;
  }
};

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
