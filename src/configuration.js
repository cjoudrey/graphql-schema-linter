const cosmiconfig = require('cosmiconfig');
import { readSync, readFileSync } from 'fs';
import getGraphQLProjectConfig from 'graphql-config';
import path from 'path';
import { sync as globSync, hasMagic as globHasMagic } from 'glob';

import defaultRules from './rules/index.js';
import { SourceMap } from './source_map.js';
import JSONFormatter from './formatters/json_formatter.js';
import TextFormatter from './formatters/text_formatter.js';

export class Configuration {
  /*
    options:
      - configDirectory: path to begin searching for config files
      - format: (required) `text` | `json`
      - rules: [string array] whitelist rules
      - schemaPaths: [string array] file(s) to read schema from
      - stdin: [boolean] pass schema via stdin?
  */
  constructor(options = {}, stdinFd = null) {
    const defaultOptions = { format: 'text' };
    const configOptions = loadOptionsFromConfig(options.configDirectory);

    // TODO Get configs from .graphqlconfig file

    this.options = Object.assign({}, defaultOptions, configOptions, options);
    this.stdinFd = stdinFd;
    this.schema = null;
    this.sourceMap = null;
  }

  getSchema() {
    if (this.schema) {
      return this.schema;
    }

    var schema;

    if (this.options.stdin) {
      this.schema = getSchemaFromFileDescriptor(this.stdinFd);
      this.sourceMap = new SourceMap({ stdin: this.schema });
    } else if (this.options.schemaPaths) {
      var paths = this.options.schemaPaths
        .map(path => {
          if (globHasMagic(path)) {
            return globSync(path);
          } else {
            return path;
          }
        })
        .reduce((a, b) => {
          return a.concat(b);
        }, []);
      var segments = getSchemaSegmentsFromFiles(paths);

      this.sourceMap = new SourceMap(segments);
      this.schema = this.sourceMap.getCombinedSource();
    }

    return this.schema;
  }

  getSchemaSourceMap() {
    if (!this.sourceMap) {
      this.getSchema();
    }

    return this.sourceMap;
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

function getSchemaSegmentsFromFiles(paths) {
  return paths.reduce((segments, path) => {
    segments[path] = getSchemaFromFile(path);
    return segments;
  }, {});
}

function toUpperCamelCase(string) {
  return string
    .split('-')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('');
}
