import path from 'path';
import { sync as globSync, hasMagic as globHasMagic } from 'glob';

export default function expandPaths(pathOrPattern) {
  return (
    pathOrPattern
      .map((path) => {
        if (globHasMagic(path)) {
          return globSync(path);
        } else {
          return path;
        }
      })
      .reduce((a, b) => {
        return a.concat(b);
      }, [])
      // Resolve paths to absolute paths so that including the same file
      // multiple times is not treated as different files
      .map((p) => path.resolve(p))
  );
}
