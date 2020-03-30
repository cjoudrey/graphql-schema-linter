import cosmiconfig from 'cosmiconfig';
import { readSync, readFileSync } from 'fs';
import path from 'path';
import { sync as globSync, hasMagic as globHasMagic } from 'glob';

import ModuleResolver from './relative_module_resolver.js';
import { SourceMap } from './source_map.js';
import JSONFormatter from './formatters/json_formatter.js';
import TextFormatter from './formatters/text_formatter.js';
import CompactFormatter from './formatters/compact_formatter.js';

export class Configuration {
  /*
    options:
      - configDirectory: path to begin searching for config files
      - format: (required) `text` | `json`
      - rules: [string array] whitelist rules
      - schemaPaths: [string array] file(s) to read schema from
      - customRulePackages: [string array] names of packages where the entry point named exports are rules
      - customRulePaths: [string array] path to additional custom rules to be loaded
      - stdin: [boolean] pass schema via stdin?
      - commentDescriptions: [boolean] use old way of defining descriptions in GraphQL SDL
      - oldImplementsSyntax: [boolean] use old way of defining implemented interfaces in GraphQL SDL
  */
  constructor(options = {}, stdinFd = null) {
    const defaultOptions = {
      format: 'text',
      customRulePackages: [],
      customRulePaths: [],
      commentDescriptions: false,
      oldImplementsSyntax: false,
    };
    const configOptions = loadOptionsFromConfig(options.configDirectory);

    // TODO Get configs from .graphqlconfig file

    this.options = Object.assign({}, defaultOptions, configOptions, options);
    this.stdinFd = stdinFd;
    this.schema = null;
    this.sourceMap = null;
    this.rules = null;
    this.rulePackages = this.options.customRulePackages;
    this.builtInRulePaths = path.join(__dirname, 'rules/*.js');
    this.rulePaths = this.options.customRulePaths.concat(this.builtInRulePaths);
  }

  getCommentDescriptions() {
    return this.options.commentDescriptions;
  }

  getOldImplementsSyntax() {
    return this.options.oldImplementsSyntax;
  }

  getSchema() {
    if (this.schema) {
      return this.schema;
    }

    if (this.options.stdin) {
      this.schema = getSchemaFromFileDescriptor(this.stdinFd);
      if (this.schema == null) {
        return null;
      }

      this.sourceMap = new SourceMap({ stdin: this.schema });
    } else if (this.options.schemaPaths) {
      let schemaPaths = this.options.schemaPaths;

      const expandedPaths = expandPaths(schemaPaths);
      const segments = getSchemaSegmentsFromFiles(expandedPaths);

      if (Object.keys(segments).length === 0) {
        return null;
      }
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
      case 'compact':
        return CompactFormatter;
    }
  }

  getRules() {
    let rules = this.getAllRules();
    let specifiedRules;
    if (this.options.rules && this.options.rules.length > 0) {
      specifiedRules = this.options.rules.map(toUpperCamelCase);
      rules = this.getAllRules().filter(rule => {
        return specifiedRules.indexOf(rule.name) >= 0;
      });
    }

    // DEPRECATED - This code should be removed in v1.0.0.
    if (this.options.only && this.options.only.length > 0) {
      specifiedRules = this.options.only.map(toUpperCamelCase);
      rules = this.getAllRules().filter(rule => {
        return specifiedRules.indexOf(rule.name) >= 0;
      });
    }

    // DEPRECATED - This code should be removed in v1.0.0.
    if (this.options.except && this.options.except.length > 0) {
      specifiedRules = this.options.except.map(toUpperCamelCase);
      rules = this.getAllRules().filter(rule => {
        return specifiedRules.indexOf(rule.name) == -1;
      });
    }

    return rules;
  }

  getAllRules() {
    if (this.rules !== null) {
      return this.rules;
    }

    const packageRules = this.getRulesFromPackages(this.rulePackages);
    const pathRules = this.getRulesFromPaths(this.rulePaths);

    this.rules = packageRules.concat(pathRules);

    return this.rules;
  }

  getRulesFromPackages(rulePackages) {
    const rules = new Set([]);

    rulePackages.map(rulePackage => {
      // We can't simply call `require()` because it needs to be from the project's node_modules
      const rulePackagePath = ModuleResolver.resolve(
        rulePackage,
        path.join(process.cwd(), '__placeholder__.js')
      );
      let ruleMap = require(rulePackagePath);
      Object.keys(ruleMap).forEach(k => rules.add(ruleMap[k]));
    });

    return Array.from(rules);
  }

  getRulesFromPaths(rulePaths) {
    const expandedPaths = expandPaths(rulePaths);
    const rules = new Set([]);

    expandedPaths.map(rulePath => {
      let ruleMap = require(rulePath);
      Object.keys(ruleMap).forEach(k => rules.add(ruleMap[k]));
    });

    return Array.from(rules);
  }

  getAllBuiltInRules() {
    return this.getRulesFromPaths([this.builtInRulePaths]);
  }

  validate() {
    const issues = [];

    let rules;

    try {
      rules = this.getRulesFromPackages(this.rulePackages);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        issues.push({
          message: `There was an issue loading the specified custom rules: '${
            e.message.split('\n')[0]
          }'`,
          field: 'custom-rule-packages',
          type: 'error',
        });

        rules = [];
      } else {
        throw e;
      }
    }

    try {
      rules = rules.concat(this.getRulesFromPaths(this.rulePaths));
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        issues.push({
          message: `There was an issue loading the specified custom rules: '${
            e.message.split('\n')[0]
          }'`,
          field: 'custom-rule-paths',
          type: 'error',
        });
      } else {
        throw e;
      }
    }

    if (rules.length === 0) {
      rules = this.getAllBuiltInRules();
    }

    const ruleNames = rules.map(rule => rule.name);

    let misConfiguredRuleNames = []
      .concat(
        this.options.only || [],
        this.options.except || [],
        this.options.rules || []
      )
      .map(toUpperCamelCase)
      .filter(name => ruleNames.indexOf(name) == -1);

    if (this.getFormatter() == null) {
      issues.push({
        message: `The output format '${this.options.format}' is invalid`,
        field: 'format',
        type: 'error',
      });
    }

    if (misConfiguredRuleNames.length > 0) {
      issues.push({
        message: `The following rule(s) are invalid: ${misConfiguredRuleNames.join(
          ', '
        )}`,
        field: 'rules',
        type: 'warning',
      });
    }

    return issues;
  }
}

function loadOptionsFromConfig(configDirectory) {
  const searchPath = configDirectory || './';

  const cosmic = cosmiconfig('graphql-schema-linter', {
    cache: false,
  }).searchSync(searchPath);

  if (cosmic) {
    let schemaPaths = [];
    let customRulePaths = [];

    // If schemaPaths come from cosmic, we resolve the given paths relative to the searchPath.

    if (cosmic.config.schemaPaths) {
      schemaPaths = cosmic.config.schemaPaths.map(schemaPath =>
        path.resolve(searchPath, schemaPath)
      );
    }

    // If customRulePaths come from cosmic, we resolve the given paths relative to the searchPath.
    if (cosmic.config.customRulePaths) {
      customRulePaths = cosmic.config.customRulePaths.map(schemaPath =>
        path.resolve(searchPath, schemaPath)
      );
    }

    return {
      rules: cosmic.config.rules,
      customRulePackages: cosmic.config.customRulePackages,
      customRulePaths: customRulePaths || [],
      schemaPaths: schemaPaths,
    };
  } else {
    return {};
  }
}

function getSchemaFromFileDescriptor(fd) {
  let b = new Buffer(1024);
  let data = '';

  while (true) {
    let n;
    try {
      n = readSync(fd, b, 0, b.length);
    } catch (e) {
      if (e.code == 'EAGAIN') {
        console.error(
          'The --stdin option was specified, but not schema was provided via stdin.'
        );
      } else {
        console.error(e.message);
      }
      return null;
    }

    if (!n) {
      break;
    }
    data += b.toString('utf8', 0, n);
  }

  return data;
}

function getSchemaFromFile(path) {
  try {
    return readFileSync(path).toString('utf8');
  } catch (e) {
    console.error(e.message);
  }
  return null;
}

function getSchemaSegmentsFromFiles(paths) {
  return paths.reduce((segments, path) => {
    let schema = getSchemaFromFile(path);
    if (schema) {
      segments[path] = schema;
    }
    return segments;
  }, {});
}

function expandPaths(pathOrPattern) {
  return (
    pathOrPattern
      .map(path => {
        if (globHasMagic(path)) {
          return globSync(path);
        } else {
          return path;
        }
      })
      .reduce((a, b) => {
        return a.concat(b);
      }, [])
      // Resolve paths to absolute paths so that including the same file
      // multiple times is not treated as different files
      .map(p => path.resolve(p))
  );
}

function toUpperCamelCase(string) {
  return string
    .split('-')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('');
}
