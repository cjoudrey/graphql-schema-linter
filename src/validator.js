import { parse } from 'graphql';
import { validate } from 'graphql/validation';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';
import { GraphQLError } from 'graphql/error';
import { validateSDL } from 'graphql/validation/validate';
import { validateSchema } from 'graphql/type/validate';
import { extractInlineConfigs } from './inline_configuration';
import { ValidationError } from './validation_error';
import { findSchemaNodes } from './find_schema_nodes';

export function validateSchemaDefinition(inputSchema, rules, configuration) {
  let ast;

  let parseOptions = {};
  if (configuration.getOldImplementsSyntax()) {
    parseOptions.allowLegacySDLImplementsInterfaces = true;
  }

  try {
    ast = parse(inputSchema.definition, parseOptions);
  } catch (e) {
    if (e instanceof GraphQLError) {
      e.ruleName = 'graphql-syntax-error';

      return [e];
    } else {
      throw e;
    }
  }

  let schemaErrors = validateSDL(ast);
  if (schemaErrors.length > 0) {
    return sortErrors(
      schemaErrors.map((error) => {
        return new ValidationError(
          'invalid-graphql-schema',
          error.message,
          error.nodes
        );
      })
    );
  }

  const schema = buildASTSchema(ast, {
    commentDescriptions: configuration.getCommentDescriptions(),
    assumeValidSDL: true,
    assumeValid: true,
  });

  schema.__validationErrors = undefined;
  schemaErrors = validateSchema(schema);
  if (schemaErrors.length > 0) {
    return sortErrors(
      schemaErrors.map((error) => {
        return new ValidationError(
          'invalid-graphql-schema',
          error.message,
          error.nodes || ast
        );
      })
    );
  }

  const rulesWithConfiguration = rules.map((rule) => {
    return ruleWithConfiguration(rule, configuration);
  });

  const errors = validate(schema, ast, rulesWithConfiguration);
  const sortedErrors = sortErrors(errors);
  const errorFilters = [
    inlineConfigErrorFilter(ast, inputSchema),
    ignoreListErrorFilter(schema, configuration),
  ];
  const filteredErrors = sortedErrors.filter((error) =>
    errorFilters.every((filter) => filter(error))
  );

  return filteredErrors;
}

function sortErrors(errors) {
  return errors.sort((a, b) => {
    return a.locations[0].line - b.locations[0].line;
  });
}

function ruleWithConfiguration(rule, configuration) {
  if (rule.length == 2) {
    return function (context) {
      return rule(configuration, context);
    };
  } else {
    return rule;
  }
}

function inlineConfigErrorFilter(ast, inputSchema) {
  const inlineConfigs = extractInlineConfigs(ast);
  if (inlineConfigs.length === 0) {
    return () => true;
  }
  const schemaSourceMap = inputSchema.sourceMap;

  return (error) => {
    let shouldApplyRule = true;
    const errorLine = error.locations[0].line;
    const errorFilePath = schemaSourceMap.getOriginalPathForLine(errorLine);

    for (const config of inlineConfigs) {
      // Skip inline configs that don't modify this error's rule
      if (!config.rules.includes(error.ruleName)) {
        continue;
      }

      // Skip inline configs that aren't in the same source file as the errored line
      const configFilePath = schemaSourceMap.getOriginalPathForLine(
        config.line
      );
      if (configFilePath !== errorFilePath) {
        continue;
      }

      // When 'disable-line': disable the rule if the error line and the command line match
      if (config.command === 'disable-line' && config.line === errorLine) {
        shouldApplyRule = false;
        break;
      }

      // Otherwise, last command wins (expected order by line)
      if (config.line < errorLine) {
        if (config.command === 'enable') {
          shouldApplyRule = true;
        } else if (config.command === 'disable') {
          shouldApplyRule = false;
        }
      }
    }

    return shouldApplyRule;
  };
}

function ignoreListErrorFilter(schema, configuration) {
  const ignoreList = configuration.getIgnoreList();
  const index = {};
  for (const [rule, scopes] of Object.entries(ignoreList)) {
    index[rule] = findSchemaNodes(scopes, schema);
  }

  return (error) => {
    if (error.ruleName) {
      const subjects = index[error.ruleName];
      const ignore = subjects?.has(error.nodes[0]);
      return !ignore;
    } else {
      return true;
    }
  };
}
