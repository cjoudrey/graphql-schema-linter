import { readSync, readFileSync } from 'fs';

import { SourceMap } from './source_map.js';
import expandPaths from './util/expandPaths.js';

export class Schema {
  constructor(definition, sourceMap) {
    this.definition = definition;
    this.sourceMap = sourceMap;
  }
}

// emptySchema is an empty schema for use in tests, when it's known that the
// schema won't be used. If any of the schema properties are accessed an error
// is thrown.
export const emptySchema = {
  get definition() {
    throw Error('cannot get definition for empty schema');
  },
  get sourceMap() {
    throw Error('cannot get source map for empty schema');
  },
};

export async function loadSchema(options, stdin) {
  /*
    options:
      - schemaPaths: [string array] file(s) to read schema from
      - stdin: [boolean] read the schema from stdin?
  */
  if (options.stdin && stdin) {
    return await loadSchemaFromStdin(stdin);
  } else if (options.schemaPaths) {
    return loadSchemaFromPaths(options.schemaPaths);
  }

  return null;
}

async function loadSchemaFromStdin(stdin) {
  const definition = await loadDefinitionFromStream(stdin);

  if (definition === null) {
    return null;
  }

  const sourceMap = new SourceMap({ stdin: definition });

  return new Schema(definition, sourceMap);
}

async function loadDefinitionFromStream(stream) {
  return new Promise((resolve, reject) => {
    let data = Buffer.alloc(0);

    stream.on('data', chunk => {
      data = Buffer.concat([data, chunk]);
    });

    stream.on('end', () => {
      // We must not convert data to a utf8 string util we have all of the
      // bytes. Chunks may not end on sequence boundaries.
      resolve(data.length > 0 ? data.toString('utf8') : null);
    });
  });
}

function loadSchemaFromPaths(paths) {
  const expandedPaths = expandPaths(paths);
  const segments = getDefinitionSegmentsFromFiles(expandedPaths);

  if (Object.keys(segments).length === 0) {
    return null;
  }

  const sourceMap = new SourceMap(segments);
  const definition = sourceMap.getCombinedSource();

  return new Schema(definition, sourceMap);
}

function getDefinitionFromFile(path) {
  try {
    return readFileSync(path).toString('utf8');
  } catch (e) {
    console.error(e.message);
  }
  return null;
}

function getDefinitionSegmentsFromFiles(paths) {
  return paths.reduce((segments, path) => {
    let definition = getDefinitionFromFile(path);
    if (definition) {
      segments[path] = definition;
    }
    return segments;
  }, {});
}
