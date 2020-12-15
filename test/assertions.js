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
  configurationOptions = {}
) {
  return expectFailsRuleWithConfiguration(
    rule,
    schemaSDL,
    configurationOptions,
    expectedErrors
  );
}

export function expectFailsRuleWithConfiguration(
  rule,
  schemaSDL,
  configurationOptions,
  expectedErrors = []
) {
  const errors = validateSchemaWithRule(rule, schemaSDL, configurationOptions);

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
  expectPassesRuleWithConfiguration(rule, schemaSDL, configurationOptions);
}

export function expectPassesRuleWithConfiguration(
  rule,
  schemaSDL,
  configurationOptions
) {
  const errors = validateSchemaWithRule(rule, schemaSDL, configurationOptions);

  assert(
    errors.length == 0,
    `Expected rule to pass but didn't got these errors:\n\n${errors.join('\n')}`
  );
}

function validateSchemaWithRule(rule, schemaSDL, configurationOptions) {
  const rules = [rule];
  const schema = new Schema(`${schemaSDL}${DefaultSchema}`, null);
  const configuration = new Configuration(schema, configurationOptions);
  const errors = validateSchemaDefinition(schema, rules, configuration);

  return errors;
}
