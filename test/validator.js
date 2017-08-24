import assert from 'assert';
import { validateSchemaDefinition } from '../src/validator';
import { Configuration } from '../src/configuration';
import { FieldsHaveDescriptions } from '../src/rules/fields_have_descriptions';

describe('validateSchemaDefinition', () => {
  it('returns errors for a schema grouped by files', () => {
    const schemaPath = `${__dirname}/fixtures/schema/**/*.graphql`;
    const configuration = new Configuration({ schemaFileName: schemaPath });

    const schemaDefinition = configuration.getSchema();
    const schemaFileOffsets = configuration.getSchemaFileOffsets();
    const rules = [FieldsHaveDescriptions];

    const errors = validateSchemaDefinition(
      schemaDefinition,
      schemaFileOffsets,
      rules
    );

    assert.deepEqual(Object.keys(errors), [
      `${__dirname}/fixtures/schema/schema.graphql`,
      `${__dirname}/fixtures/schema/user.graphql`,
    ]);

    assert.equal(
      1,
      errors[`${__dirname}/fixtures/schema/schema.graphql`].length
    );
    assert.equal(
      2,
      errors[`${__dirname}/fixtures/schema/schema.graphql`][0].locations[0].line
    );

    assert.equal(3, errors[`${__dirname}/fixtures/schema/user.graphql`].length);
    assert.equal(
      2,
      errors[`${__dirname}/fixtures/schema/user.graphql`][0].locations[0].line
    );
    assert.equal(
      3,
      errors[`${__dirname}/fixtures/schema/user.graphql`][1].locations[0].line
    );
    assert.equal(
      7,
      errors[`${__dirname}/fixtures/schema/user.graphql`][2].locations[0].line
    );
  });
});
