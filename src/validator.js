import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';
import { GraphQLError } from 'graphql/error';

export function validateSchemaDefinition(schemaDefinition, rules) {
  let ast;
  try {
    ast = parse(schemaDefinition);
  } catch (e) {
    if (e instanceof GraphQLError) {
      return [e];
    } else {
      throw e;
    }
  }
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
