import { writeFileSync } from 'fs';

// Returns {<path>: <new content>} for only those paths which changed.
export function fixSchema(errors, sourceMap) {
  // Select fixable errors, and sort in by start-location of the fix.
  errors = errors.filter((error) => error.fix != null);
  if (errors.length === 0) {
    return {};
  }
  errors.sort((first, second) => first.fix.loc.start - second.fix.loc.start);

  // Apply the fixes by iterating through files, walking the errors list for
  // each at the same time.
  let fileStartOffset = 0;
  const fixedPaths = {};
  let errorIndex = 0;
  Object.entries(sourceMap.sourceFiles).forEach(([path, text]) => {
    const fileEndOffset = fileStartOffset + text.length;
    const fixedParts = [];
    let currentFileOffset = 0;
    while (
      errorIndex < errors.length &&
      errors[errorIndex].fix.loc.start <= fileEndOffset
    ) {
      const { loc, replacement } = errors[errorIndex].fix;
      fixedParts.push(
        text.slice(currentFileOffset, loc.start - fileStartOffset)
      );
      fixedParts.push(replacement);
      currentFileOffset = loc.end - fileStartOffset;
      errorIndex++;
    }

    if (fixedParts.length > 0) {
      fixedParts.push(text.slice(currentFileOffset));
      fixedPaths[path] = fixedParts.join('');
    }

    fileStartOffset = fileEndOffset + 1; // sourceMap adds a newline in between
  });

  return fixedPaths;
}

// Given output from fixSchema, write the fixes to disk.
export function applyFixes(fixes) {
  for (const [path, text] of Object.entries(fixes)) {
    try {
      writeFileSync(path, text);
    } catch (e) {
      console.error(e.message);
    }
  }
}
