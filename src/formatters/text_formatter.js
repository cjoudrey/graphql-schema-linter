export default class {
  constructor(configuration) {
    this.errors = '';
  }

  start() {

  }

  error(error) {
    const location = error.locations[0];

    this.errors = this.errors + `${location.line}:${location.column} ${error.message}\n`;
  }

  output() {
    return this.errors;
  }
}
