import path from 'path';

import JSONFormatter from './formatters/json_formatter.js';
import TextFormatter from './formatters/text_formatter.js';
import CompactFormatter from './formatters/compact_formatter.js';
import expandPaths from './util/expandPaths.js';

export class Configuration {
  /*
    options:
      - format: (required) `text` | `json`
      - rules: [string array] whitelist rules
      - rulesOptions: [string to object] configuration options for rules. Example: "rulesOptions": { "enum-values-sorted-alphabetically": { "sortOrder": "lexicographical" } }
      - ignore: [string to string array object] ignore list for rules. Example: {"fields-have-descriptions": ["Obvious", "Query.obvious", "Query.something.obvious"]}
      - customRulePaths: [string array] path to additional custom rules to be loaded
      - commentDescriptions: [boolean] use old way of defining descriptions in GraphQL SDL
      - oldImplementsSyntax: [boolean] use old way of defining implemented interfaces in GraphQL SDL
  */
  constructor(schema, options = {}) {
    const defaultOptions = {
      format: 'text',
      customRulePaths: [],
      commentDescriptions: false,
      oldImplementsSyntax: false,
      rulesOptions: {},
      ignore: {},
    };

    this.schema = schema;
    this.options = { ...defaultOptions, ...options };
    this.rules = null;
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
    return this.schema.definition;
  }

  getSchemaSourceMap() {
    return this.schema.sourceMap;
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
      rules = this.getAllRules().filter((rule) => {
        return specifiedRules.indexOf(rule.name) >= 0;
      });
    }

    // DEPRECATED - This code should be removed in v1.0.0.
    if (this.options.only && this.options.only.length > 0) {
      specifiedRules = this.options.only.map(toUpperCamelCase);
      rules = this.getAllRules().filter((rule) => {
        return specifiedRules.indexOf(rule.name) >= 0;
      });
    }

    // DEPRECATED - This code should be removed in v1.0.0.
    if (this.options.except && this.options.except.length > 0) {
      specifiedRules = this.options.except.map(toUpperCamelCase);
      rules = this.getAllRules().filter((rule) => {
        return specifiedRules.indexOf(rule.name) == -1;
      });
    }

    return rules;
  }

  getAllRules() {
    if (this.rules !== null) {
      return this.rules;
    }

    this.rules = this.getRulesFromPaths(this.rulePaths);

    return this.rules;
  }

  getRulesFromPaths(rulePaths) {
    const expandedPaths = expandPaths(rulePaths);
    const rules = new Set([]);

    expandedPaths.map((rulePath) => {
      let ruleMap = require(rulePath);
      Object.keys(ruleMap).forEach((k) => rules.add(ruleMap[k]));
    });

    return Array.from(rules);
  }

  getAllBuiltInRules() {
    return this.getRulesFromPaths([this.builtInRulePaths]);
  }

  getRulesOptions() {
    return this.options.rulesOptions;
  }

  getIgnoreList() {
    return this.options.ignore;
  }

  validate() {
    const issues = [];

    let rules;

    try {
      rules = this.getAllRules();
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        issues.push({
          message: `There was an issue loading the specified custom rules: '${
            e.message.split('\n')[0]
          }'`,
          field: 'custom-rule-paths',
          type: 'error',
        });

        rules = this.getAllBuiltInRules();
      } else {
        throw e;
      }
    }

    const ruleNames = rules.map((rule) => rule.name);

    let misConfiguredRuleNames = []
      .concat(
        this.options.only || [],
        this.options.except || [],
        this.options.rules || []
      )
      .map(toUpperCamelCase)
      .filter((name) => ruleNames.indexOf(name) == -1);

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

function toUpperCamelCase(string) {
  return string
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}
