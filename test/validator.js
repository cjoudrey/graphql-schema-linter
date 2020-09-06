import assert from 'assert';
import { validateSchemaDefinition } from '../src/validator';
import { Configuration } from '../src/configuration';
import { loadSchema } from '../src/schema';
import { FieldsHaveDescriptions } from '../src/rules/fields_have_descriptions';
import { GraphQLError } from 'graphql/error';

describe('validateSchemaDefinition', () => {
  it('returns errors sorted by line number', async () => {
    const schemaPath = `${__dirname}/fixtures/schema/**/*.graphql`;
    const schema = await loadSchema({ schemaPaths: [schemaPath] });
    const options = {
      ignore: { 'fields-have-descriptions': ['Obvious', 'DontPanic.obvious'] },
    };
    const configuration = new Configuration(schema, options);

    const rules = [FieldsHaveDescriptions, DummyValidator];

    const errors = validateSchemaDefinition(schema, rules, configuration);
    const errorLineNumbers = errors.map((error) => {
      return error.locations[0].line;
    });

    assert.equal(10, errors.length);

    assert.deepEqual(errorLineNumbers.sort(), errorLineNumbers);
  });

  it('catches and returns GraphQL syntax errors', async () => {
    const schemaPath = `${__dirname}/fixtures/invalid.graphql`;
    const schema = await loadSchema({ schemaPaths: [schemaPath] });
    const configuration = new Configuration(schema);

    const errors = validateSchemaDefinition(schema, [], configuration);

    assert.equal(1, errors.length);
  });

  it('reports schema with missing query root', async () => {
    const schemaPath = `${__dirname}/fixtures/schema.missing-query-root.graphql`;
    const schema = await loadSchema({ schemaPaths: [schemaPath] });
    const configuration = new Configuration(schema);

    const errors = validateSchemaDefinition(schema, [], configuration);

    assert.equal(1, errors.length);
  });

  it('catches and returns GraphQL schema errors', async () => {
    const schemaPath = `${__dirname}/fixtures/invalid-schema.graphql`;
    const schema = await loadSchema({ schemaPaths: [schemaPath] });
    const configuration = new Configuration(schema);

    const errors = validateSchemaDefinition(schema, [], configuration);

    assert.equal(2, errors.length);

    assert.equal('Unknown type "Node".', errors[0].message);
    assert.equal(3, errors[0].locations[0].line);

    assert.equal('Unknown type "Product".', errors[1].message);
    assert.equal(7, errors[1].locations[0].line);
  });

  it('handles invalid GraphQL schemas', async () => {
    const schemaPath = `${__dirname}/fixtures/invalid-query-root.graphql`;
    const schema = await loadSchema({ schemaPaths: [schemaPath] });
    const configuration = new Configuration(schema);

    const errors = validateSchemaDefinition(schema, [], configuration);

    assert.equal(1, errors.length);

    assert.equal(
      'Query root type must be Object type, it cannot be Query.',
      errors[0].message
    );
    assert.equal(1, errors[0].locations[0].line);
  });

  it('passes configuration to rules that require it', async () => {
    const schemaPath = `${__dirname}/fixtures/valid.graphql`;
    const schema = await loadSchema({ schemaPaths: [schemaPath] });
    const configuration = new Configuration(schema);

    const ruleWithConfiguration = (config, context) => {
      assert.equal(configuration, config);
      assert.equal('ValidationContext', context.constructor.name);
      return {};
    };

    const ruleWithoutConfiguration = (context) => {
      assert.equal('ValidationContext', context.constructor.name);
      return {};
    };

    const errors = validateSchemaDefinition(
      schema,
      [ruleWithConfiguration, ruleWithoutConfiguration],
      configuration
    );

    assert.equal(0, errors.length);
  });
});

function DummyValidator(context) {
  return {
    Document: {
      leave: (node) => {
        context.reportError(new GraphQLError('Dummy message', [node]));
      },
    },
  };
}
