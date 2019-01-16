import assert from 'assert';
import { validateSchemaDefinition } from '../src/validator';
import { Configuration } from '../src/configuration';
import { FieldsHaveDescriptions } from '../src/rules/fields_have_descriptions';
import { GraphQLError } from 'graphql/error';

describe('validateSchemaDefinition', () => {
  it('returns errors sorted by line number', () => {
    const schemaPath = `${__dirname}/fixtures/schema/**/*.graphql`;
    const configuration = new Configuration({ schemaPaths: [schemaPath] });

    const schemaDefinition = configuration.getSchema();
    const rules = [FieldsHaveDescriptions, DummyValidator];

    const errors = validateSchemaDefinition(
      schemaDefinition,
      rules,
      configuration
    );
    const errorLineNumbers = errors.map(error => {
      return error.locations[0].line;
    });

    assert.equal(7, errors.length);

    assert.deepEqual(errorLineNumbers.sort(), errorLineNumbers);
  });

  it('catches and returns GraphQL syntax errors', () => {
    const schemaPath = `${__dirname}/fixtures/invalid.graphql`;
    const configuration = new Configuration({ schemaPaths: [schemaPath] });

    const schemaDefinition = configuration.getSchema();

    const errors = validateSchemaDefinition(
      schemaDefinition,
      [],
      configuration
    );

    assert.equal(1, errors.length);
  });

  it('catches and returns GraphQL schema errors', () => {
    const schemaPath = `${__dirname}/fixtures/invalid-schema.graphql`;
    const configuration = new Configuration({ schemaPaths: [schemaPath] });

    const schemaDefinition = configuration.getSchema();

    const errors = validateSchemaDefinition(
      schemaDefinition,
      [],
      configuration
    );

    assert.equal(2, errors.length);

    assert.equal('Unknown type "Node".', errors[0].message);
    assert.equal(3, errors[0].locations[0].line);

    assert.equal('Unknown type "Product".', errors[1].message);
    assert.equal(7, errors[1].locations[0].line);
  });

  it('handles invalid GraphQL schemas', () => {
    const schemaPath = `${__dirname}/fixtures/invalid-query-root.graphql`;
    const configuration = new Configuration({ schemaPaths: [schemaPath] });

    const schemaDefinition = configuration.getSchema();

    const errors = validateSchemaDefinition(
      schemaDefinition,
      [],
      configuration
    );

    assert.equal(1, errors.length);

    assert.equal(
      'Query root type must be Object type, it cannot be Query.',
      errors[0].message
    );
    assert.equal(1, errors[0].locations[0].line);
  });

  it('passes configuration to rules that require it', () => {
    const schemaPath = `${__dirname}/fixtures/valid.graphql`;
    const configuration = new Configuration({ schemaPaths: [schemaPath] });

    const schemaDefinition = configuration.getSchema();

    const ruleWithConfiguration = (config, context) => {
      assert.equal(configuration, config);
      assert.equal('ValidationContext', context.constructor.name);
      return {};
    };

    const ruleWithoutConfiguration = context => {
      assert.equal('ValidationContext', context.constructor.name);
      return {};
    };

    const errors = validateSchemaDefinition(
      schemaDefinition,
      [ruleWithConfiguration, ruleWithoutConfiguration],
      configuration
    );

    assert.equal(0, errors.length);
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
