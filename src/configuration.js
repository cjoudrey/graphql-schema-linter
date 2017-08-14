const cosmiconfig = require('cosmiconfig');
import { readSync, readFileSync } from 'fs';
import getGraphQLProjectConfig from 'graphql-config';
import path from 'path';

import defaultRules from './rules/index.js';
import JSONFormatter from './formatters/json_formatter.js';
import TextFormatter from './formatters/text_formatter.js';

export class Configuration {
  /*
    options:
      - configDirectory: path to begin searching for config files
      - except: [string array] blacklist rules
      - format: (required) `text` | `json`
      - only: [string array] whitelist rules
      - schemaFileName: [string] file to read schema from
      - stdin: [boolean] pass schema via stdin?
  */
  constructor(options = {}, stdinFd = null) {
    const defaultOptions = { format: 'text' };
    const configOptions = loadOptionsFromConfig(options.configDirectory);

    this.options = Object.assign({}, defaultOptions, configOptions, options);
    this.stdinFd = stdinFd;
  }

  getSchema() {
    // TODO - Check for args.length > 1

    if (this.options.stdin) {
      return getSchemaFromFileDescriptor(this.stdinFd);
    } else if (this.options.schemaFileName) {
      return getSchemaFromFile(this.options.schemaFileName);
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

    if (this.options.only && this.options.only.length > 0) {
      rules = filterRules(this.options.only);
    } else if (this.options.except && this.options.except.length > 0) {
      rules = defaultRules.filter(rule => {
        return (
          this.options.except.map(toUpperCamelCase).indexOf(rule.name) == -1
        );
      });
    }

    return rules;
  }
}

function loadOptionsFromConfig(configDirectory) {
  // If config path is not specified, look in root directory of project
  // the first option to cosmiconfig.load can be absolute or relative
  const searchPath = configDirectory || './'

  const cosmic = cosmiconfig('graphql-schema-linter', {
    cache: false,
    sync: true,
  }).load(searchPath);
  let options = {};
  if (cosmic) {
    // Map config.rules -> `only` param
    if (cosmic.config.rules) {
      options.only = cosmic.config.rules;
    }
  }
  return options;
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
