import assert from 'assert';
import { validateSchemaDefinition } from '../src/validator';
import { Configuration } from '../src/configuration';
import { FieldsHaveDescriptions } from '../src/rules/fields_have_descriptions';
import { GraphQLError } from 'graphql/error';

describe('validateSchemaDefinition', () => {
  it('returns errors sorted by line number', () => {
    const schemaPath = `${__dirname}/fixtures/schema/**/*.graphql`;
    const configuration = new Configuration({ schemaFileName: schemaPath });

    const schemaDefinition = configuration.getSchema();
    const rules = [FieldsHaveDescriptions, DummyValidator];

    const errors = validateSchemaDefinition(schemaDefinition, rules);

    assert.equal(5, errors.length);
    assert.equal(1, errors[0].locations[0].line);
    assert.equal(2, errors[1].locations[0].line);
    assert.equal(10, errors[2].locations[0].line);
    assert.equal(11, errors[3].locations[0].line);
    assert.equal(15, errors[4].locations[0].line);
  });
});

function DummyValidator(context) {
  return {
    Document: {
      leave: node => {
        context.reportError(new GraphQLError('Dummy message', [node]));
      },
    },
  };
}
