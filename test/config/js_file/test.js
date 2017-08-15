import assert from 'assert';
import { Configuration } from '../../../src/configuration';

describe('Config', () => {
  describe('getRules', () => {
    it('pulls rule config from a *.config.js', () => {
      const configuration = new Configuration({
        configDirectory: __dirname,
      });

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
