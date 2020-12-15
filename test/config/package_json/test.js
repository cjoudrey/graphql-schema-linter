import path from 'path';
import { readFileSync } from 'fs';
import assert from 'assert';
import { Configuration } from '../../../src/configuration';
import { loadSchema, emptySchema } from '../../../src/schema';
import { loadOptionsFromConfigDir } from '../../../src/options';
import { temporaryConfigDirectory } from '../../helpers';

describe('Config', () => {
  describe('getRules', () => {
    it('pulls rule config from the package.json file', () => {
      const options = loadOptionsFromConfigDir(
        temporaryConfigDirectory({
          rules: ['enum-values-sorted-alphabetically'],
        })
      );
      const configuration = new Configuration(emptySchema, options);

      const rules = configuration.getRules();

      assert.equal(1, rules.length);
      assert.equal(
        1,
        rules.filter((rule) => {
          return rule.name == 'EnumValuesSortedAlphabetically';
        }).length
      );
    });
  });

  describe('getRulesOptions', () => {
    it('pulls rule config from the package.json file', () => {
      const options = loadOptionsFromConfigDir(
        temporaryConfigDirectory({
          rulesOptions: {
            'enum-values-sorted-alphabetically': {
              sortOrder: 'alphabetical',
            },
          },
        })
      );
      const configuration = new Configuration(emptySchema, options);
      const rulesOptions = configuration.getRulesOptions();

      assert.equal(1, Object.entries(rulesOptions).length);
      assert.deepEqual(rulesOptions, {
        'enum-values-sorted-alphabetically': { sortOrder: 'alphabetical' },
      });
    });
  });

  describe('getIgnoreList', () => {
    it('pulls ignore list from the package.json file', () => {
      const options = loadOptionsFromConfigDir(
        temporaryConfigDirectory({
          ignore: {
            'fields-have-descriptions': [
              'Obvious',
              'Query.obvious',
              'Query.something.obvious',
            ],
          },
        })
      );
      const configuration = new Configuration(emptySchema, options);

      const ignoreList = configuration.getIgnoreList();

      assert.deepEqual(ignoreList, {
        'fields-have-descriptions': [
          'Obvious',
          'Query.obvious',
          'Query.something.obvious',
        ],
      });
    });

    it('defaults to {} when unspecified', () => {
      const options = loadOptionsFromConfigDir(temporaryConfigDirectory({}));
      const configuration = new Configuration(emptySchema, options);

      const ignoreList = configuration.getIgnoreList();

      assert.deepEqual(ignoreList, {});
    });
  });

  describe('customRulePaths', () => {
    it('pulls customRulePaths from package.json', () => {
      const options = loadOptionsFromConfigDir(
        temporaryConfigDirectory({
          rules: ['SomeRule'],
          customRulePaths: [
            // we provide the full path to the helper
            path.join(__dirname, '../../fixtures/custom_rules/*.js'),
          ],
        })
      );
      const configuration = new Configuration(emptySchema, options);

      const rules = configuration.getRules();

      assert.equal(rules.filter(({ name }) => name === 'SomeRule').length, 1);
    });
  });

  describe('schemaPaths', () => {
    it('pulls schemaPaths from package.json when configDirectory is provided', async () => {
      const fixturePath = path.join(
        __dirname,
        '/../../fixtures/schema.graphql'
      );
      const schema = await loadSchema({ schemaPaths: [fixturePath] });
      const configuration = new Configuration(schema, {
        configDirectory: temporaryConfigDirectory({
          rules: ['enum-values-sorted-alphabetically'],
        }),
      });
      assert.equal(
        configuration.getSchema(),
        readFileSync(fixturePath).toString('utf8')
      );
    });
  });
});
