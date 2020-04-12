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
        rules.filter(rule => {
          return rule.name == 'EnumValuesSortedAlphabetically';
        }).length
      );
    });
  });
});
