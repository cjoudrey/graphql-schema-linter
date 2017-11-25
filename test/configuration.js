import assert from 'assert';
import defaultRules from '../src/rules/index.js';
import { Configuration } from '../src/configuration.js';
import JSONFormatter from '../src/formatters/json_formatter.js';
import TextFormatter from '../src/formatters/text_formatter.js';
import { openSync, readFileSync } from 'fs';

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

    it('returns default rules when --only and --except are not specified', () => {
      const configuration = new Configuration();
      assert.equal(configuration.getRules(), defaultRules);
    });

    it('omits rules that are not specified in --only', () => {
      const configuration = new Configuration({
        only: ['fields-have-descriptions', 'types-have-descriptions'],
      });

      const rules = configuration.getRules();

      assert.equal(rules.length, 2);
      assert.equal(
        rules[0],
        defaultRules.find(rule => {
          return rule.name == 'FieldsHaveDescriptions';
        })
      );
      assert.equal(
        rules[1],
        defaultRules.find(rule => {
          return rule.name == 'TypesHaveDescriptions';
        })
      );
    });

    it('omits rules that are specified in --except', () => {
      const configuration = new Configuration({
        except: ['fields-have-descriptions', 'types-have-descriptions'],
      });

      const rules = configuration.getRules();

      assert.equal(rules.length, defaultRules.length - 2);
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
        defaultRules.find(rule => {
          return rule.name == 'FieldsHaveDescriptions';
        })
      );
      assert.equal(
        rules[1],
        defaultRules.find(rule => {
          return rule.name == 'TypesHaveDescriptions';
        })
      );
    });

    it('omits rules that are specified in --except (PascalCase)', () => {
      const configuration = new Configuration({
        except: ['FieldsHaveDescriptions', 'TypesHaveDescriptions'],
      });

      const rules = configuration.getRules();

      assert.equal(rules.length, defaultRules.length - 2);
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
  });
});
