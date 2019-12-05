import path from 'path';
import { readFileSync } from 'fs';
import assert from 'assert';
import { Configuration } from '../../../src/configuration';
import { temporaryConfigDirectory } from '../../helpers';

describe('Config', () => {
  describe('getRules', () => {
    it('pulls rule config from the package.json file', () => {
      const configuration = new Configuration({
        configDirectory: temporaryConfigDirectory({
          rules: ['enum-values-sorted-alphabetically'],
          schemaPaths: [path.join(__dirname, '/../../fixtures/schema.graphql')],
        }),
      });

      const rules = configuration.getRules();

      assert.equal(1, rules.length);
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
        configDirectory: temporaryConfigDirectory({
          rules: ['SomeRule'],
          customRulePaths: [
            // we provide the full path to the helper
            path.join(__dirname, '../../fixtures/custom_rules/*.js'),
          ],
        }),
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
        configDirectory: temporaryConfigDirectory({
          rules: ['"enum-values-sorted-alphabetically"'],
          schemaPaths: [fixturePath],
        }),
      });
      assert.equal(
        configuration.getSchema(),
        readFileSync(fixturePath).toString('utf8')
      );
    });
  });
});
