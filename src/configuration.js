const cosmiconfig = require('cosmiconfig');
import { readSync, readFileSync } from 'fs';
import getGraphQLProjectConfig from 'graphql-config';
import path from 'path';

import defaultRules from './rules/index.js';
import JSONFormatter from './formatters/json_formatter.js';
import TextFormatter from './formatters/text_formatter.js';

export class Configuration {
  constructor(options, stdinFd) {
    this.options = options;
    this.stdinFd = stdinFd;
  }

  getSchema() {
    // TODO - Check for args.length > 1

    if (this.options.stdin) {
      return getSchemaFromFileDescriptor(this.stdinFd);
    } else if (this.options.args.length > 0) {
      return getSchemaFromFile(this.options.args[0]);
    } else {
      // TODO: Get schema from .graphqlconfig file
    }
  }

  getFormatter() {
    switch (this.options.format) {
      case 'json':
        return JSONFormatter;
      case 'text':
        return TextFormatter;
      // TODO raise when invalid formatter
    }
  }

  getRules() {
    // TODO Cannot have both except and only -- raise in this case
    // TODO validate that all rules passed to only/except exist.

    var rules = defaultRules;

    if (this.options.only.length > 0) {
      rules = filterRules(this.options.only);
    } else if (this.options.except.length > 0) {
      rules = defaultRules.filter(rule => {
        return (
          this.options.except.map(toUpperCamelCase).indexOf(rule.name) == -1
        );
      });
    } else {
      const directory = this.options.searchDirectory || process.cwd();
      const cosmic = cosmiconfig('graphql-schema-linter', {
        cache: false,
        sync: true,
      }).load(directory);

      if (cosmic) {
        rules = filterRules(cosmic.config.rules);
      }
    }

    return rules;
  }
}

function filterRules(rules) {
  return defaultRules.filter(rule => {
    return rules.map(toUpperCamelCase).indexOf(rule.name) >= 0;
  });
}

function getSchemaFromFileDescriptor(fd) {
  var b = new Buffer(1024);
  var data = '';

  while (true) {
    var n = readSync(fd, b, 0, b.length);
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

function toUpperCamelCase(string) {
  return string
    .split('-')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('');
}
