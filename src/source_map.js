export class SourceMap {
  constructor(sourceFiles) {
    this.sourceFiles = sourceFiles;
    this.offsets = this._computeOffsets();
  }

  _computeOffsets() {
    var currentOffset = 1;

    const paths = Object.keys(this.sourceFiles);

    return paths.reduce((offsets, path) => {
      const currentSegment = this.sourceFiles[path];
      const currentSegmentLines = currentSegment.match(/\r?\n/g);
      const amountLines = currentSegmentLines ? currentSegmentLines.length : 0;

      const startLine = currentOffset;
      const endLine = currentOffset + amountLines;

      currentOffset = currentOffset + amountLines + 1;

      offsets[path] = {
        startLine,
        endLine,
        filename: path,
      };

      return offsets;
    }, {});
  }

  getCombinedSource() {
    return getObjectValues(this.sourceFiles).join('\n');
  }

  getOriginalPathForLine(lineNumber) {
    const offsets = getObjectValues(this.offsets);

    for (var i = 0; i < offsets.length; i++) {
      if (
        offsets[i].startLine <= lineNumber &&
        lineNumber <= offsets[i].endLine
      ) {
        return offsets[i].filename;
      }
    }
  }

  getOffsetForPath(path) {
    return this.offsets[path];
  }
}

function getObjectValues(arr) {
  return Object.keys(arr).map(function(key) {
    return arr[key];
  });
}
