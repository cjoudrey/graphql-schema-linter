import assert from 'assert';
import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';
import { validateSchemaDefinition } from '../src/validator.js';
import { Configuration } from '../src/configuration.js';
import { Schema } from '../src/schema.js';

const DefaultSchema = `
  "Query root"
  type Query {
    "Field"
    a: String
  }
`;

export function expectFailsRule(
  rule,
  schemaSDL,
  expectedErrors = [],
  configurationOptions = {},
  omitDefaultSchema = false
) {
  return expectFailsRuleWithConfiguration(
    rule,
    `${schemaSDL}`,
    configurationOptions,
    expectedErrors,
    omitDefaultSchema
  );
}

export function expectFailsRuleWithConfiguration(
  rule,
  schemaSDL,
  configurationOptions,
  expectedErrors = [],
  omitDefaultSchema = false
) {
  var schema = omitDefaultSchema ? schemaSDL : `${schemaSDL}${DefaultSchema}`;

  const errors = validateSchemaWithRule(rule, schema, configurationOptions);

  assert(errors.length > 0, "Expected rule to fail but didn't");

  assert.deepEqual(
    errors,
    expectedErrors.map((expectedError) => {
      return Object.assign(expectedError, {
        ruleName: rule.name
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .replace(/^-/, ''),
      });
    })
  );
}

export function expectPassesRule(rule, schemaSDL, configurationOptions = {}) {
  expectPassesRuleWithConfiguration(rule, `${schemaSDL}`, configurationOptions);
}

export function expectPassesRuleWithConfiguration(
  rule,
  schemaSDL,
  configurationOptions
) {
  const errors = validateSchemaWithRule(
    rule,
    `${schemaSDL}${DefaultSchema}`,
    configurationOptions
  );

  assert(
    errors.length == 0,
    `Expected rule to pass but didn't got these errors:\n\n${errors.join('\n')}`
  );
}

function validateSchemaWithRule(rule, schemaSDL, configurationOptions) {
  const rules = [rule];
  const schema = new Schema(schemaSDL, null);
  const configuration = new Configuration(schema, configurationOptions);
  const errors = validateSchemaDefinition(schema, rules, configuration);
  const transformedErrors = errors.map((error) => ({
    locations: error.locations,
    message: error.message,
    ruleName: error.ruleName,
  }));

  return transformedErrors;
}
