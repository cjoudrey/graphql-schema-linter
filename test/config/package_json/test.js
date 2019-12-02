import path from 'path';
import { readFileSync } from 'fs';
import assert from 'assert';
import { Configuration } from '../../../src/configuration';

describe('Config', () => {
  describe('getRules', () => {
    it('pulls rule config from the package.json file', () => {
      const configuration = new Configuration({
        configDirectory: __dirname,
      });

      const rules = configuration.getRules();

      assert.equal(2, rules.length);
      assert.equal(
        1,
        rules.filter(rule => {
          return rule.name == 'EnumValuesSortedAlphabetically';
        }).length
      );
    });
  });

  describe('customRulePaths', () => {
    it('pulls customRulePaths from package.json', () => {
      const configuration = new Configuration({
        configDirectory: __dirname,
      });

      const rules = configuration.getRules();

      assert.equal(rules.filter(({ name }) => name === 'SomeRule').length, 1);
    });
  });

  describe('schemaPaths', () => {
    it('pulls schemaPaths from package.json when configDirectory is provided', () => {
      const fixturePath = path.join(
        __dirname,
        '/../../fixtures/schema.graphql'
      );
      const configuration = new Configuration({
        configDirectory: __dirname,
      });
      assert.equal(
        configuration.getSchema(),
        readFileSync(fixturePath).toString('utf8')
      );
    });
  });
});
