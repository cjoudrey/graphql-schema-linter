export class SourceMap {
  constructor(sourceFiles) {
    this.sourceFiles = sourceFiles;
    this.offsets = this._computeOffsets();
  }

  _computeOffsets() {
    var currentOffset = 1;

    const paths = Object.keys(this.sourceFiles);

    return paths.map(path => {
      const currentSegment = this.sourceFiles[path];
      const amountLines = currentSegment.match(/\r?\n/g).length;

      const startLine = currentOffset;
      const endLine = currentOffset + amountLines;

      currentOffset = currentOffset + amountLines + 1;

      return {
        startLine,
        endLine,
        filename: path,
      };
    });
  }

  getCombinedSource() {
    return Object.values(this.sourceFiles).join('\n');
  }

  getOriginalPathForLine(lineNumber) {
    for (var i = 0; i < this.offsets.length; i++) {
      if (
        this.offsets[i].startLine <= lineNumber &&
        lineNumber <= this.offsets[i].endLine
      ) {
        return this.offsets[i].filename;
      }
    }
  }
}
