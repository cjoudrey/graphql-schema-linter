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
      const amountLines = currentSegment.match(/\r?\n/g).length;

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
    return Object.values(this.sourceFiles).join('\n');
  }

  getOriginalPathForLine(lineNumber) {
    const offsets = Object.values(this.offsets);

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
