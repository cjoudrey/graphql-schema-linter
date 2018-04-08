import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';
import { GraphQLError } from 'graphql/error';

export function validateSchemaDefinition(
  schemaDefinition,
  rules,
  configuration
) {
  let ast;

  let parseOptions = {};
  if (configuration.getOldImplementsSyntax()) {
    parseOptions.allowLegacySDLImplementsInterfaces = true;
  }

  try {
    ast = parse(schemaDefinition, parseOptions);
  } catch (e) {
    if (e instanceof GraphQLError) {
      return [e];
    } else {
      throw e;
    }
  }
  const schema = buildASTSchema(ast, {
    commentDescriptions: configuration.getCommentDescriptions(),
  });

  const rulesWithConfiguration = rules.map(rule => {
    return ruleWithConfiguration(rule, configuration);
  });

  const errors = validate(schema, ast, rulesWithConfiguration);
  const sortedErrors = sortErrors(errors);

  return sortedErrors;
}

function sortErrors(errors) {
  return errors.sort((a, b) => {
    return a.locations[0].line - b.locations[0].line;
  });
}

function ruleWithConfiguration(rule, configuration) {
  if (rule.length == 2) {
    return function(context) {
      return rule(configuration, context);
    };
  } else {
    return rule;
  }
}
