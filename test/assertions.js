import assert from 'assert';
import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';
import { kebabCase } from 'lodash';
import { validateSchemaDefinition } from '../src/validator.js';
import { Configuration } from '../src/configuration.js';

const DefaultSchema = `
  "Query root"
  type Query {
    "Field"
    a: String
  }
`;

export function expectFailsRule(rule, schemaSDL, expectedErrors = []) {
  return expectFailsRuleWithConfiguration(rule, schemaSDL, {}, expectedErrors);
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
    expectedErrors.map(expectedError => {
      return Object.assign(expectedError, {
        ruleName: kebabCase(rule.name),
      });
    })
  );
}

export function expectPassesRule(rule, schemaSDL) {
  expectPassesRuleWithConfiguration(rule, schemaSDL, {});
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
  const fullSchemaSDL = `${schemaSDL}${DefaultSchema}`;
  const rules = [rule];
  const configuration = new Configuration(configurationOptions, null);
  const errors = validateSchemaDefinition(fullSchemaSDL, rules, configuration);

  return errors;
}
