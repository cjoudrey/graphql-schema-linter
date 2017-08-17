import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

export function validateSchemaString(schemaString, rules) {
  const ast = parse(`
    type QueryRoot {
      a: String
    }

    ${schemaString}

    schema {
      query: QueryRoot
    }
  `);
  const astSchema = buildASTSchema(ast);

  return validate(astSchema, ast, rules);
}
