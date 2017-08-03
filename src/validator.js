import { parse } from 'graphql';
import { visit, visitInParallel } from 'graphql/language/visitor';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

export function validateSchemaDefinition(schemaDefinition, rules) {
  const ast = parse(schemaDefinition);
  const schema = buildASTSchema(ast);
  const errors = validate(schema, ast, rules);

  return errors;
}
