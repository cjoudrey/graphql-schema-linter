const cosmiconfig = require('cosmiconfig');
import { readSync, readFileSync } from 'fs';
import getGraphQLProjectConfig from 'graphql-config';
import path from 'path';
import { sync as globSync } from 'glob';

import defaultRules from './rules/index.js';
import JSONFormatter from './formatters/json_formatter.js';
import TextFormatter from './formatters/text_formatter.js';

export class Configuration {
  /*
    options:
      - configDirectory: path to begin searching for config files
      - format: (required) `text` | `json`
      - rules: [string array] whitelist rules
      - schemaFileName: [string] file to read schema from
      - stdin: [boolean] pass schema via stdin?
  */
  constructor(options = {}, stdinFd = null) {
    const defaultOptions = { format: 'text' };
    const configOptions = loadOptionsFromConfig(options.configDirectory);

    // TODO Get configs from .graphqlconfig file

    this.options = Object.assign({}, defaultOptions, configOptions, options);
    this.stdinFd = stdinFd;
    this.schemaFileOffsets = null;
    this.schema = null;
  }

  getSchema() {
    if (this.schema) {
      return this.schema;
    }

    var schema;

    if (this.options.stdin) {
      this.schema = getSchemaFromFileDescriptor(this.stdinFd);
      this.schemaFileOffsets = computeSchemaFileOffsets(
        ['stdin'],
        [this.schema]
      );
    } else if (this.options.schemaFileName) {
      var paths = globSync(this.options.schemaFileName);
      var segments = getSchemaFromFiles(paths);

      this.schemaFileOffsets = computeSchemaFileOffsets(paths, segments);
      this.schema = segments.join('\n');
    }

    return this.schema;
  }

  getSchemaFileOffsets() {
    if (!this.schemaFileOffsets) {
      this.getSchema();
    }

    return this.schemaFileOffsets;
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
    // TODO validate that all specified rules actually exist. This way we can
    //      prevent people from making typos.

    var rules = defaultRules;
    var specifiedRules;

    if (this.options.rules && this.options.rules.length > 0) {
      specifiedRules = this.options.rules.map(toUpperCamelCase);
      rules = rules.filter(rule => {
        return specifiedRules.indexOf(rule.name) >= 0;
      });
    }

    // DEPRECATED - This code should be removed in v1.0.0.
    if (this.options.only && this.options.only.length > 0) {
      specifiedRules = this.options.only.map(toUpperCamelCase);
      rules = defaultRules.filter(rule => {
        return specifiedRules.indexOf(rule.name) >= 0;
      });
    }

    // DEPRECATED - This code should be removed in v1.0.0.
    if (this.options.except && this.options.except.length > 0) {
      specifiedRules = this.options.except.map(toUpperCamelCase);
      rules = defaultRules.filter(rule => {
        return specifiedRules.indexOf(rule.name) == -1;
      });
    }

    return rules;
  }
}

function loadOptionsFromConfig(configDirectory) {
  const searchPath = configDirectory || './';

  const cosmic = cosmiconfig('graphql-schema-linter', {
    cache: false,
    sync: true,
  }).load(searchPath);

  if (cosmic) {
    return {
      rules: cosmic.config.rules,
    };
  } else {
    return {};
  }
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

function getSchemaFromFiles(paths) {
  return paths.map(getSchemaFromFile);
}

function computeSchemaFileOffsets(paths, segments) {
  var currentOffset = 1;

  return paths.map((path, index) => {
    const currentSegment = segments[index];
    const amountLines = currentSegment.match(/\r?\n/g).length;

    const startLine = currentOffset;
    const endLine = currentOffset + amountLines;

    currentOffset = currentOffset + amountLines + 1;

    return {
      startLine,
      endLine,
      filename: path,
    };
  });
}

function toUpperCamelCase(string) {
  return string
    .split('-')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('');
}
