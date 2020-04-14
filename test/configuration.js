import assert from 'assert';
import { Configuration } from '../src/configuration.js';
import { emptySchema } from '../src/schema.js';
import JSONFormatter from '../src/formatters/json_formatter.js';
import TextFormatter from '../src/formatters/text_formatter.js';
import { openSync, readFileSync } from 'fs';
import { relative as pathRelative } from 'path';

describe('Configuration', () => {
  describe('getFormatter', () => {
    it('returns text formatter', () => {
      const configuration = new Configuration(emptySchema, { format: 'text' });
      assert.equal(configuration.getFormatter(), TextFormatter);
    });

    it('returns json formatter', () => {
      const configuration = new Configuration(emptySchema, { format: 'json' });
      assert.equal(configuration.getFormatter(), JSONFormatter);
    });

    it('raises on invalid formatter', () => {
      // TODO
    });
  });

  describe('getRules', () => {
    it('raises when both --only and --except are specified', () => {
      // TODO
    });

    it('returns all rules when --only and --except are not specified', () => {
      const configuration = new Configuration(emptySchema);
      assert.equal(configuration.getRules(), configuration.getAllRules());
    });

    it('omits rules that are not specified in --only', () => {
      const configuration = new Configuration(emptySchema, {
        only: ['fields-have-descriptions', 'types-have-descriptions'],
      });

      const rules = configuration.getRules();

      assert.equal(rules.length, 2);
      assert.equal(
        rules[0],
        configuration.getAllRules().find(rule => {
          return rule.name == 'FieldsHaveDescriptions';
        })
      );
      assert.equal(
        rules[1],
        configuration.getAllRules().find(rule => {
          return rule.name == 'TypesHaveDescriptions';
        })
      );
    });

    it('omits rules that are specified in --except', () => {
      const configuration = new Configuration(emptySchema, {
        except: ['fields-have-descriptions', 'types-have-descriptions'],
      });

      const rules = configuration.getRules();

      assert.equal(rules.length, configuration.getAllRules().length - 2);
      assert.equal(
        0,
        rules.filter(rule => {
          return (
            rule.name == 'FieldsHaveDescriptions' ||
            rule.name == 'TypesHaveDescriptions'
          );
        }).length
      );
    });

    it('omits rules that are not specified in --only (PascalCase)', () => {
      const configuration = new Configuration(emptySchema, {
        only: ['FieldsHaveDescriptions', 'TypesHaveDescriptions'],
      });

      const rules = configuration.getRules();

      assert.equal(rules.length, 2);
      assert.equal(
        rules[0],
        configuration.getAllRules().find(rule => {
          return rule.name == 'FieldsHaveDescriptions';
        })
      );
      assert.equal(
        rules[1],
        configuration.getAllRules().find(rule => {
          return rule.name == 'TypesHaveDescriptions';
        })
      );
    });

    it('omits rules that are specified in --except (PascalCase)', () => {
      const configuration = new Configuration(emptySchema, {
        except: ['FieldsHaveDescriptions', 'TypesHaveDescriptions'],
      });

      const rules = configuration.getRules();

      assert.equal(rules.length, configuration.getAllRules().length - 2);
      assert.equal(
        0,
        rules.filter(rule => {
          return (
            rule.name == 'FieldsHaveDescriptions' ||
            rule.name == 'TypesHaveDescriptions'
          );
        }).length
      );
    });

    it('dedups duplicate rules', () => {
      const configuration = new Configuration(emptySchema, {
        customRulePaths: [
          `${__dirname}/fixtures/custom_rules/*.js`,
          `${__dirname}/fixtures/custom_rules/type_name_cannot_contain_type.js`,
        ],
      });

      const rules = configuration.getRules();

      assert.equal(
        2,
        rules.filter(rule => {
          return (
            rule.name == 'EnumNameCannotContainEnum' ||
            rule.name == 'TypeNameCannotContainType'
          );
        }).length
      );
    });

    it('adds custom rules that are specified in --custom-rules-path', () => {
      const configuration = new Configuration(emptySchema, {
        customRulePaths: [`${__dirname}/fixtures/custom_rules/*.js`],
      });

      const rules = configuration.getRules();

      assert.equal(
        4,
        rules.filter(rule => {
          return (
            rule.name == 'SomeRule' ||
            rule.name == 'AnotherRule' ||
            rule.name == 'EnumNameCannotContainEnum' ||
            rule.name == 'TypeNameCannotContainType'
          );
        }).length
      );
    });

    it('adds a custom rules that is specified in --custom-rules-path', () => {
      const configuration = new Configuration(emptySchema, {
        customRulePaths: [
          `${__dirname}/fixtures/custom_rules/type_name_cannot_contain_type.js`,
        ],
      });

      const rules = configuration.getRules();

      assert.equal(
        1,
        rules.filter(rule => {
          return rule.name == 'TypeNameCannotContainType';
        }).length
      );
    });
  });

  describe('validate', () => {
    it('errors when an invalid format is configured', () => {
      const configuration = new Configuration(emptySchema, {
        format: 'xml',
      });

      const issues = configuration.validate();

      assert.equal(issues.length, 1);
      assert.equal(issues[0].message, "The output format 'xml' is invalid");
      assert.equal(issues[0].field, 'format');
      assert.equal(issues[0].type, 'error');
    });

    it('warns when an invalid rule is configured', () => {
      const configuration = new Configuration(emptySchema, {
        except: ['NoRuleOfMine', 'FieldsHaveDescriptions'],
      });

      const issues = configuration.validate();

      assert.equal(issues.length, 1);
      assert.equal(
        issues[0].message,
        'The following rule(s) are invalid: NoRuleOfMine'
      );
      assert.equal(issues[0].field, 'rules');
      assert.equal(issues[0].type, 'warning');
    });

    it('errors when invalid custom rule paths is configured', () => {
      const invalidPaths = [
        `${__dirname}/fixtures/nonexistent_path`,
        `${__dirname}/fixtures/custom_rules/*.js`,
      ];

      const configuration = new Configuration(emptySchema, {
        customRulePaths: invalidPaths,
        rules: ['fields-have-descriptions', 'types-have-descriptions'],
      });

      const issues = configuration.validate();

      assert.equal(issues.length, 1);
      assert.equal(
        issues[0].message,
        `There was an issue loading the specified custom rules: 'Cannot find module '${__dirname}/fixtures/nonexistent_path''`
      );
      assert.equal(issues[0].field, 'custom-rule-paths');
      assert.equal(issues[0].type, 'error');
    });

    it('warns and errors when multiple issues arise configured', () => {
      const configuration = new Configuration(emptySchema, {
        except: ['NoRuleOfMine', 'FieldsHaveDescriptions'],
        format: 'xml',
      });

      const issues = configuration.validate();

      assert.equal(issues.length, 2);
    });
  });

  describe('getCommentDescriptions', () => {
    it('defaults to false', () => {
      const configuration = new Configuration(emptySchema, {});
      assert.equal(configuration.getCommentDescriptions(), false);
    });

    it('returns specified value', () => {
      const configuration = new Configuration(emptySchema, {
        commentDescriptions: true,
      });
      assert.equal(configuration.getCommentDescriptions(), true);
    });
  });

  describe('getOldImplementsSyntax', () => {
    it('defaults to false', () => {
      const configuration = new Configuration(emptySchema, {});
      assert.equal(configuration.getOldImplementsSyntax(), false);
    });

    it('returns specified value', () => {
      const configuration = new Configuration(emptySchema, {
        oldImplementsSyntax: true,
      });
      assert.equal(configuration.getOldImplementsSyntax(), true);
    });
  });
});
