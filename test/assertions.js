import assert from 'assert';
import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';
import { kebabCase } from 'lodash';

const DefaultSchema = `
  # Query root
  type Query {
    # Field
    a: String
  }
`;

export function expectFailsRule(rule, schemaSDL, expectedErrors = []) {
  const ast = parse(`${schemaSDL}${DefaultSchema}`);
  const schema = buildASTSchema(ast);
  const errors = validate(schema, ast, [rule]);

  assert(errors.length > 0, "Expected rule to fail but didn't");

  assert.deepEqual(
    errors,
    expectedErrors.map(expectedError => {
      return Object.assign(expectedError, {
        ruleName: kebabCase(rule.name),
        path: undefined,
      });
    })
  );
}

export function expectPassesRule(rule, schemaSDL, expectedErrors = []) {
  const ast = parse(`${schemaSDL}${DefaultSchema}`);
  const schema = buildASTSchema(ast);
  const errors = validate(schema, ast, [rule]);

  assert(
    errors.length == 0,
    `Expected rule to pass but didn't got these errors:\n\n${errors.join('\n')}`
  );
}
