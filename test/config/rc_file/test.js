import assert from 'assert';
import { Configuration } from '../../../src/configuration';
import { emptySchema } from '../../../src/schema';
import { loadOptionsFromConfigDir } from '../../../src/options';

describe('Config', () => {
  describe('getRules', () => {
    it('pulls rule config from a .graphql-schema-linterrc dotfile', () => {
      const options = loadOptionsFromConfigDir(__dirname);
      const configuration = new Configuration(emptySchema, options);

      const rules = configuration.getRules();

      assert.equal(rules.length, 1);
      assert.equal(
        1,
        rules.filter((rule) => {
          return rule.name == 'EnumValuesSortedAlphabetically';
        }).length
      );
    });
  });

  describe('getRulesOptions', () => {
    it('pulls rule config from a .graphql-schema-linterrc dotfile', () => {
      const options = loadOptionsFromConfigDir(__dirname);
      const configuration = new Configuration(emptySchema, options);

      const rulesOptions = configuration.getRulesOptions();

      assert.equal(1, Object.entries(rulesOptions).length);
      assert.deepEqual(rulesOptions, {
        'enum-values-sorted-alphabetically': { sortOrder: 'lexicographical' },
      });
    });
  });

  describe('getIgnoreList', () => {
    it('pulls ignore list from a .graphql-schema-linterrc dotfile', () => {
      const options = loadOptionsFromConfigDir(__dirname);
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
  });
});
