import assert from 'assert';
import { Configuration } from '../../../src/configuration';

describe('Config', () => {
  describe('getRules', () => {
    it('pulls rule config from a .graphql-schema-linterrc dotfile', () => {
      const configuration = new Configuration({ only: [], except: [] });

      const rules = configuration.getRules(__dirname);

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
