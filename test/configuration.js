import assert from 'assert';
import { Configuration } from '../src/configuration.js';
import JSONFormatter from '../src/formatters/json_formatter.js';
import TextFormatter from '../src/formatters/text_formatter.js';
import { openSync, readFileSync } from 'fs';
import { relative as pathRelative } from 'path';

describe('Configuration', () => {
  describe('getSchema', () => {
    it('concatenates multiple files when given a glob', () => {
      const schemaPath = `${__dirname}/fixtures/schema/**/*.graphql`;
      const configuration = new Configuration({ schemaPaths: [schemaPath] });

      const expectedSchema = `type Comment {
  body: String!
  author: User!
}

type Query {
  something: String!
}

schema {
  query: Query
}

type User {
  username: String!
  email: String!
}

extend type Query {
  viewer: User!
}
`;

      assert.equal(configuration.getSchema(), expectedSchema);
    });

    it('reads schema from file when provided', () => {
      const fixturePath = `${__dirname}/fixtures/schema.graphql`;
      const configuration = new Configuration({ schemaPaths: [fixturePath] });
      assert.equal(
        configuration.getSchema(),
        readFileSync(fixturePath).toString('utf8')
      );
    });

    it('reads schema from stdin when --stdin is set', () => {
      const fixturePath = `${__dirname}/fixtures/schema.graphql`;
      const fd = openSync(fixturePath, 'r');

      const configuration = new Configuration({ args: [], stdin: true }, fd);
      assert.equal(
        configuration.getSchema(),
        readFileSync(fixturePath).toString('utf8')
      );
    });

    it('normalizes schema files paths', () => {
      const fixturePath = `${__dirname}/fixtures/schema.graphql`;
      const duplicatePath = pathRelative(
        process.cwd(),
        `${__dirname}/fixtures/schema.graphql`
      );

      assert.notEqual(fixturePath, duplicatePath);

      const configuration = new Configuration({
        schemaPaths: [fixturePath, duplicatePath],
      });

      assert.equal(
        configuration.getSchema(),
        readFileSync(fixturePath).toString('utf8')
      );
    });
  });

  describe('getFormatter', () => {
    it('returns text formatter', () => {
      const configuration = new Configuration({ format: 'text' });
      assert.equal(configuration.getFormatter(), TextFormatter);
    });

    it('returns json formatter', () => {
      const configuration = new Configuration({ format: 'json' });
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
      const configuration = new Configuration();
      assert.equal(configuration.getRules(), configuration.getAllRules());
    });

    it('omits rules that are not specified in --only', () => {
      const configuration = new Configuration({
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
      const configuration = new Configuration({
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
      const configuration = new Configuration({
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
      const configuration = new Configuration({
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

    it('adds custom rules that are specified in --custom-rules-path', () => {
      const configuration = new Configuration({
        customRulePaths: [`${__dirname}/fixtures/custom_rules/*.js`],
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

    it('adds a custom rules that is specified in --custom-rules-path', () => {
      const configuration = new Configuration({
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
      const configuration = new Configuration({
        format: 'xml',
      });

      const issues = configuration.validate();

      assert.equal(issues.length, 1);
      assert.equal(issues[0].message, "The output format 'xml' is invalid");
      assert.equal(issues[0].field, 'format');
      assert.equal(issues[0].type, 'error');
    });

    it('warns when an invalid rule is configured', () => {
      const configuration = new Configuration({
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

    it('warns and errors when multiple issues arise configured', () => {
      const configuration = new Configuration({
        except: ['NoRuleOfMine', 'FieldsHaveDescriptions'],
        format: 'xml',
      });

      const issues = configuration.validate();

      assert.equal(issues.length, 2);
    });
  });

  describe('getCommentDescriptions', () => {
    it('defaults to false', () => {
      const configuration = new Configuration({});
      assert.equal(configuration.getCommentDescriptions(), false);
    });

    it('returns specified value', () => {
      const configuration = new Configuration({ commentDescriptions: true });
      assert.equal(configuration.getCommentDescriptions(), true);
    });
  });
});
