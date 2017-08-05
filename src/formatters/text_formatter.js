export default class {
  constructor(configuration) {
    this.errorsText = '';
    this.errorsCount = 0;
  }

  start() {

  }

  error(error) {
    const location = error.locations[0];

    this.errorsCount++;
    this.errorsText = this.errorsText + `${location.line}:${location.column} ${error.message}\n`;
  }

  output() {
    var summary;

    if (this.errorsCount == 1) {
      summary = "1 error detected";
    } else {
      summary = `${this.errorsCount} errors detected`;
    }

    return this.errorsText + "\n" + summary + "\n";
  }
}
