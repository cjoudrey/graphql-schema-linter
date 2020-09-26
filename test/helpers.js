import { writeFileSync, mkdtempSync } from 'fs';
import os from 'os';
import path from 'path';

const TEMP_DIR_PREFIX = '.mockedTests-';
const writeJSONFile = (filename, data) =>
  writeFileSync(filename, JSON.stringify(data));

/**
 * There's some magic in order to create a relative path to the temporal directory. but mostly it does 3 things.
 * 1) gets the dirname of the given path.
 * 2) finds the relative from the temp file to the dirname found in step 1)
 * 3) joins relativePath to the remaining fullPath (minus the dirnamePath)
 */

const getRelocatedPath = (dir, fullPath) => {
  const dirnamePath = path.dirname(fullPath);
  const relativePath = path.relative(dir, dirnamePath);
  return path.join(path.join(relativePath, fullPath.split(dirnamePath)[1]));
};

export const temporaryConfigDirectory = ({
  rules = null,
  rulesOptions = null,
  ignore = null,
  customRulePaths = [],
  schemaPaths = [],
}) => {
  const configDirectory = mkdtempSync(path.join(os.tmpdir(), TEMP_DIR_PREFIX));
  let fixCustomRulePaths = [];
  let fixedSchemaPaths = [];
  const options = { rules, rulesOptions, ignore };

  // due to the temp nature of the directory creation we ought to fix the provided paths to match the location.
  if (customRulePaths.length) {
    fixCustomRulePaths = customRulePaths.map((rulePath) =>
      getRelocatedPath(configDirectory, rulePath)
    );

    options.customRulePaths = fixCustomRulePaths;
  }

  if (schemaPaths.length) {
    fixedSchemaPaths = schemaPaths.map((globPath) =>
      getRelocatedPath(configDirectory, globPath)
    );

    options.schemaPaths = fixedSchemaPaths;
  }

  writeJSONFile(path.join(configDirectory, 'package.json'), {
    'graphql-schema-linter': { ...options },
  });
  return configDirectory;
};
