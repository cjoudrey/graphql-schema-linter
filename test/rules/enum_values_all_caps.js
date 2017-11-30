import assert from 'assert';

import { validateSchemaString } from '../utils';
import { EnumValuesAllCaps } from '../../src/rules/enum_values_all_caps';

describe('EnumValuesAllCaps rule', () => {
  it('catches enums that are lower case', () => {
    const schema = `
      enum Stage {
        aaa
        bbb_bbb
      }
    `;

    const errors = validateSchemaString(schema, [EnumValuesAllCaps]);

    assert.equal(errors.length, 2);

    assert.equal(errors[0].ruleName, 'enum-values-all-caps');
    assert.equal(
      errors[0].message,
      'The enum value `Stage.aaa` should be uppercase.'
    );

    assert.deepEqual(errors[0].locations, [{ line: 8, column: 9 }]);
  });

  it('allows enums that are uppercase, numbers allowed ', () => {
    const schema = `
      enum Stage {
        FOO
        FOO_BAR
        FOO_BAR_1
      }
    `;

    const errors = validateSchemaString(schema, [EnumValuesAllCaps]);

    assert.equal(errors.length, 0);
  });
});
