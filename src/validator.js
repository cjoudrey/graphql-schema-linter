import { parse } from 'graphql';
import { visit, visitInParallel } from 'graphql/language/visitor';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

export function validateSchemaDefinition(
  schemaDefinition,
  schemaFileOffsets,
  rules
) {
  const ast = parse(schemaDefinition);
  const schema = buildASTSchema(ast);
  const errors = validate(schema, ast, rules);
  const sortedErrors = sortErrors(errors);
  const groupedErrors = groupErrorsByFile(sortedErrors, schemaFileOffsets);

  return groupedErrors;
}

function sortErrors(errors) {
  return errors.sort((a, b) => {
    return a.locations[0].line - b.locations[0].line;
  });
}

function groupErrorsByFile(errors, schemaFileOffsets) {
  var groups = {};

  var currentFileOffset = 0;

  for (var i = 0; i < errors.length; i++) {
    var error = errors[i];
    var errorLine = error.locations[0].line;

    for (var j = currentFileOffset; j < schemaFileOffsets.length; j++) {
      if (
        schemaFileOffsets[j].startLine <= errorLine &&
        errorLine <= schemaFileOffsets[j].endLine
      ) {
        var filename = schemaFileOffsets[j].filename;
        groups[filename] = groups[filename] || [];

        error.locations[0].line =
          error.locations[0].line - schemaFileOffsets[j].startLine + 1;
        groups[filename].push(error);

        currentFileOffset = j;
        break;
      }
    }
  }

  return groups;
}
