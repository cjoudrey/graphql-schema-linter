import assert from 'assert';
import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';
import { validateSchemaDefinition } from '../src/validator.js';
import { Configuration } from '../src/configuration.js';
import { Schema } from '../src/schema.js';
import { SourceMap } from '../src/source_map.js';
import { fixSchema } from '../src/fix.js';

const DefaultSchema = `
  "Query root"
  type Query {
    "Field"
    a: String
  }
`;

export function expectFailsRule(rule, schemaSDL, expectedErrors = [], fixed) {
  return expectFailsRuleWithConfiguration(
    rule,
    schemaSDL,
    {},
    expectedErrors,
    fixed
  );
}

export function expectFailsRuleWithConfiguration(
  rule,
  schemaSDL,
  configurationOptions,
  expectedErrors = [],
  expectedFixedSDL = null
) {
  const errors = validateSchemaWithRule(rule, schemaSDL, configurationOptions);

  assert(errors.length > 0, "Expected rule to fail but didn't");

  let actualErrors = errors;
  if (expectedFixedSDL != null) {
    // If expectedFixedSDL is provided, assert about that rather than
    // errors[].fix.
    actualErrors = errors.map((error) => {
      const { fix, ...rest } = error;
      return rest;
    });
  }

  assert.deepEqual(
    actualErrors,
    expectedErrors.map((expectedError) => {
      return Object.assign(expectedError, {
        ruleName: rule.name
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .replace(/^-/, ''),
      });
    })
  );

  if (expectedFixedSDL != null) {
    const fixedFiles = fixSchema(errors, new SourceMap({ file: schemaSDL }));
    assert.equal(fixedFiles.file, expectedFixedSDL);
  }
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
  const rules = [rule];
  const schema = new Schema(`${schemaSDL}${DefaultSchema}`, null);
  const configuration = new Configuration(schema, configurationOptions);
  const errors = validateSchemaDefinition(schema, rules, configuration);

  return errors;
}
