import path from 'path';

import cosmiconfig from 'cosmiconfig';

export function loadOptionsFromConfigDir(configDirectory) {
  const searchPath = configDirectory || './';

  const cosmic = cosmiconfig('graphql-schema-linter', {
    cache: false,
  }).searchSync(searchPath);

  if (cosmic) {
    let schemaPaths = [];
    let customRulePaths = [];

    // If schemaPaths come from cosmic, we resolve the given paths relative to the searchPath.
    if (cosmic.config.schemaPaths) {
      schemaPaths = cosmic.config.schemaPaths.map((schemaPath) =>
        path.resolve(searchPath, schemaPath)
      );
    }

    // If customRulePaths come from cosmic, we resolve the given paths relative to the searchPath.
    if (cosmic.config.customRulePaths) {
      customRulePaths = cosmic.config.customRulePaths.map((schemaPath) =>
        path.resolve(searchPath, schemaPath)
      );
    }

    return {
      rules: cosmic.config.rules,
      ignore: cosmic.config.ignore || {},
      customRulePaths: customRulePaths || [],
      schemaPaths: schemaPaths,
    };
  } else {
    return {};
  }
}
