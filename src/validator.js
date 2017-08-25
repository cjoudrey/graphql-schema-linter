import { parse } from 'graphql';
import { visit, visitInParallel } from 'graphql/language/visitor';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

export function validateSchemaDefinition(schemaDefinition, rules) {
  const ast = parse(schemaDefinition);
  const schema = buildASTSchema(ast);
  const errors = validate(schema, ast, rules);
  const sortedErrors = sortErrors(errors);

  return sortedErrors;
}

function sortErrors(errors) {
  return errors.sort((a, b) => {
    return a.locations[0].line - b.locations[0].line;
  });
}
